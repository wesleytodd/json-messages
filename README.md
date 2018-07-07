# Standard JSON Messages

A little wrapper library to standardize messages returned from JSON api's.
It is intended to standardize application level messaging for things like errors,
success messages and other application level signaling.  This format is a superset
of the [JSON-API spec for error messages](http://jsonapi.org/format/#errors)
but adds on a few things so extend it to other message types.

## The Format

1. `_messages` will is an array of objects at the top level of the response
2. Each entry in the `_messages` array will have these properties:
	1. Required fields:
		1. `code`: A application unique camel case string
		2. `detail`: A human readable and translatable string to display to the end user
		3. `level`: A severity description; `error`, `warning` or `success`
	2. Optional fields:
		1. `id`: A unique id for this message instance
		2. `status`: The status code which should be returned with this message
		3. `title`: A title for the message
		4. `meta`: An object with extra context for the message
		5. `source`: An object with context for the source of the message, like error stack trace or the related field
		6. `links`: An object with links to related context, like a page describing the error


## Examples

```
{
  "_messages": [{
    "code": "resourceNotFound",
    "detail": "These are not the resources you are looking for."
    "level": "error"
  }]
}
```

```
{
  "_messages": [{
    "code": "invalidInput",
    "detail": "The input you provided is invalid"
    "level": "error",
    "source": {
      "field": "input"
    }
  }]
}
```

```
{
  "_messages": [{
    "code": "duplicateKetInsert",
    "detail": "Duplicate key"
    "level": "error",
    "title": "Database insert error"
    "status": "500",
    "meta": {
      "key": 123
    }
  }]
}
```

## Usage

```
$ npm install --save json-messages
```

```javascript
const http = require('http')
const messages = require('messages')

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')

  // Send an error response
  if (req.url !== '/hello') {
    res.statusCode = 404
    res.end(JSON.stringify({
      _messages: messages({
        code: 'notFound',
        message: 'Not found: ' + req.url,
        level: messages.levels.ERROR,
        status: 404,
        source: {
          field: 'url'
        },
        meta: {
          url: req.url
        }
      })
    }))
    return
  }

  // Send a success message
  res.end(JSON.stringify({
    _messages: messages({
      code: 'helloWorld',
      message: 'Hello World',
      level: messages.levels.SUCCESS
    })
  }))
})
server.listen(0)
```

- I18n: The `message` field is human readable and can be translated based on the `code` as a key.
- Debugging: In production, `code` field can be used to track down errors.  In dev `error` levels include a stack.
- Message Metadata: Standardized way to include metadata without mucking with the message guarantees.
- Browser compatible: Helpful to keep your API's and clients speaking the same language.
