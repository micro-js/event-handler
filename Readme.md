
# event-handler

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Syntax sugar for events handlers. Kind of like the excellent, [classnames](https://github.com/JedWatson/classnames), but for events.

## Installation

    $ npm install @f/event-handler

## Usage

This module gives you some special syntax to make your event handlers more declarative and functional. You can create handlers for only certain keypresses, or easily attach multiple handlers to a single event. 

This example calls `updateText` with every keydown event, but also calls `submit` only when enter is pressed:

```js
var ev = require('@f/event-handler')

function render () {
  return <input onKeyDown={ev([{enter: submit}, updateText])} />
}
```

You may pass an array, object, or just a plain function, and you may also do any of these things recursively. So, for instance:

```js
var ev = require('@f/event-handler')

function render () {
  return <input onKeyDown={ev[{enter: [submit, close]}, updateText]} />
}
```

This will close the input and submit when `enter` is pressed, it will also update the text on every normal keydown.

## Return values

If you rely on the return values of your handler, we have you covered. The value returned by your handlers will be returned from the constructed handler. If you've passed an array, that array will be mapped [over](https://github.com/micro-js/over) the event, and the resulting array will be returned.

## API

### eventHandler(descriptor)

- `descriptor` - An object, array, or function. If it's an object, the keys will be used as filters to call the handler only if the event matches the key. At the moment, the only allowed keys are [keychords](https://github.com/micro-js/keychord), though more may be forthcoming if there is interest. If an array is passed, all the functions in the array are called.

**Returns:** A constructed event handler that you may just pass `event` to, and it will execute the handlers you've specified according to your `descriptor`.

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/event-handler.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/event-handler
[git-image]: https://img.shields.io/github/tag/micro-js/event-handler.svg?style=flat-square
[git-url]: https://github.com/micro-js/event-handler
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/event-handler.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/event-handler
