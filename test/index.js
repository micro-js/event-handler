/**
 * Imports
 */

var ev = require('..')
var test = require('tape')
var identity = require('@f/identity')
var keychord = require('@f/keychord')
var keycodes = require('@f/keycodes')

/**
 * Tests
 */

test('should work', function (t) {
  t.deepEqual(ev([{handler: isEven, decoder: identity}, {handler: isOdd, decoder: identity}])(4), [true, false])

  var handle = ev([{handler: keychord, decoder: identity}, {'ctrl+shift+enter': [{handler: keychord, decoder: identity}, {handler: keychord, decoder: identity}]}])
  t.deepEqual(handle(event('ctrl+shift+enter')), ['ctrl+shift+enter', ['ctrl+shift+enter', 'ctrl+shift+enter']])

  t.deepEqual(ev(identity)({type: 'input', target: {nodeName: 'INPUT', value: 'test'}}), 'test')
  t.end()
})

test('default handler', function (t) {
  var descriptor = {
    'ctrl+shift+enter': function() {
      return 'combination'
    },
    'default': function() {
      return 'default'
    }
  }

  t.equal(ev(descriptor)(event('ctrl+shift+enter')), 'combination')
  t.equal(ev(descriptor)(event('x')), 'default')
  t.end()
})

/**
 * Helpers
 */

function isEven (n) {
  return n % 2 === 0
}

function isOdd (n) {
  return !isEven(n)
}

var keys = Object
  .keys(keycodes)
  .reduce(function (acc, code) {
    acc[keycodes[code]] = code
    return acc
  }, {})

function event (chord) {
  var parts = chord.split('+')

  return parts
    .reduce(function (acc, part) {
      switch (part) {
        case 'ctrl':
          acc.ctrlKey = true
          break
        case 'alt':
          acc.altKey = true
          break
        case 'meta':
          acc.metaKey = true
          break
        case 'shift':
          acc.shiftKey = true
          break
        default:
          acc.which = keys[part]
          break
      }

      return acc
    }, {})
}
