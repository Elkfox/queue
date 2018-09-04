/*==============================================================================
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/
Queue
https://github.com/Elkfox/queue
Author: Team Elkfox
Copyright (c) 2018 Elkfox Co Pty Ltd
https://elkfox.com
MIT License
==============================================================================*/

const Queue = function Queue (configuration) {

  // Deafult settings
  const defaultConfig = {
    method: 'GET',
    url: null,
    dataType: '',
    data: null,
    success: function success (success) {
      const successEvent = new CustomEvent(this.config.completedRequestEvent, { response: success })
      document.dispatchEvent(successEvent)
    },
    error: function error (error) {
      const errorEvent = new CustomEvent(this.config.failedRequestEvent, { response: error })
      document.dispatchEvent(errorEvent)
    },
    completedAllRequestsEvent: 'Queue:requestsCompleted',
    completedRequestEvent: 'Queue:requestCompleted',
    failedRequestEvent: 'Queue:requestFailed',
    requestStartedEvent: 'Queue:requestStarted',
    errorEvent: 'Queue:error'
  }
  this.config = Object.assign(defaultConfig, configuration)
  this.queue = []
  this.processing = false
  this.add = this.add.bind(this)
  this.process = this.process.bind(this)
}

Queue.prototype.add = function addRequestToQueue (req) {
  const request = Object.assign({}, this.config, req)
  if (!request.url) {
    const errorEvent = new CustomEvent(this.config.errorEvent, { response: 'Queue: No url provided' })
    document.dispatchEvent(errorEvent)
  }
  const defaultSuccess = this.config.success
  const defaultError = this.config.error
  request.success = [request.success] || [defaultSuccess]
  request.error = [request.error] || [defaultError]
  this.queue.push(request)

  // Check to see if the queue is already running
  if (this.processing) {
    return true
  }

  try {
    const startedEvent = new Event(this.config.requestStarted)
    document.dispatchEvent(startedEvent)
  } catch (error) {
    const errorEvent = new CustomEvent(this.config.errorEvent, { response: error })
    document.dispatchEvent(errorEvent)
  }

  this.processing = false
  this.process()
  return this.processing
}

Queue.prototype.process = function processQueue () {
  if (!this.queue.length) {
    this.processing = false
    const completedEvent = new Event(this.config.completedAllRequestsEvent)
    document.dispatchEvent(completedEvent)
    return
  }
  this.processing = true
  const request = this.queue.shift()
  request.success.push(this.process)
  request.error.push(this.process)
  try {
    // jQuery.ajax(request)
    // Create the ajax request
    this.request = new XMLHttpRequest()
    // Setup the success and error callbacks
    this.request.onreadystatechange = function requestStateChanged () {
      // If the request is completed
      if (this.readyState === 4) {
        // If the status code is okay
        if (this.status === 200) {
          // The response is a success
          // Execute all functions in the success array
          for (let func = 0; func < request.success.length; func += 1) {
            request.success[func](this.response)
          }
        } else {
          // The response is an error
          // Execute all functions in the error array
          for (let func = 0; func < request.error.length; func += 1) {
            request.error[func](this.response)
          }
        }
      }
    }
  } catch (error) {
    const errorEvent = new CustomEvent(this.config.errorEvent, { response: error })
    document.dispatchEvent(errorEvent)
  }
  // Open the request with the currect url and method
  this.request.open(request.method, request.url)
  // Define the response type, the default being json
  this.request.responseType = request.dataType
  // Send the request
  if (typeof request.data === 'object') {
    this.request.setRequestHeader('Content-Type', 'application/json')
    this.request.send(JSON.stringify(request.data))
    return request
  }
  this.request.send(request.data)
  return request
}

module.exports = Queue;
