# Queue

Pure Javascript Ajax requests and queuing.

## Usage
```
const queue = new Queue([config]);
queue.add([request]);
```

## `config` - object

The config object is **not** required

Name                      | Description                                                             | Type     | Default
--------------------------|-------------------------------------------------------------------------|----------|--------------------------------------
success                   | The callback for all successful ajax requests processed by this queue   | function | Dispatch a `Queue:requestCompleted` event
error                     | The callback for all unsuccessful ajax requests processed by this queue | function | Dispatch a `Queue:requestFailed` event
completedAllRequestsEvent | The event type that will be dispatched once all requests have finished  | string   | `Queue:requestsCompleted`
completedRequestEvent     | The event type that will be dispatched after each request is finished   | string   | `Queue:requestCompleted`
failedRequestEvent        | The event type that will be dispatched after a request has failed       | string   | `Queue:requestFailed`
requestStartedEvent       | The event type that will be dispatched after each request has started   | string   | `Queue:requestStarted`
errorEvent                | The event type that will be dispatched after Q has thrown an error      | string   | `Queue:error`

## Methods

### `add`
#### Description
Adds a request to the currently running queue, this will cause the queue to process each item, one at a time until all requests have been resolved.
#### Example
```
  const queue = new Queue()

  // Build the ajax request
  const request = {
    url: '/cart/add.js',
    data: item,
    success: options.success,
    error: options.error
  }

  // Add the request to the ajax request queue
  this.queue.add(request)
  })
```

#### `request` - object
Name    | Description                                                          | Required   | Type     | Default
--------------------------|----------------------------------------------------------------------|------------|----------|--------------------------
success | The callback for a successful response, overwrites the queue default. | `false` | function | Dispatch a `Queue:requestCompleted` event
error   | The callback for an unsuccessful response, overwrites the queue default. | `false` | function | Dispatch a `Queue:requestFailed` event
url     | The url that the request will be sent to | `true` | string | `null`
method  | The method that will be used to make the request  | `false` | string | `GET`
data    | Any data that you wish to send to the request  | `false` | any | `null`
dataType[*](#dataType)  | The type of data that we expect to recieve from the request | `false` | string | `''`

##### dataType

[Read more here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)

Options:
`''`, `'arraybuffer'`, `'blob'`, `'document'`, `'json'`, `'text'`
