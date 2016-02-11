/**
 * Modules
 */

var isFunction = require('@f/is-function')
var isObject = require('@f/is-object')
var keychord = require('@f/keychord')
var isArray = require('@f/is-array')
var over = require('@f/over')
var map = require('@f/map')

/**
 * Expose eventHandler
 */

module.exports = eventHandler

/**
 * eventHandler
 */

function eventHandler (fn) {
  if (isFunction(fn)) return fn
  if (isArray(fn)) return combine(map(eventHandler, fn))
  if (isObject(fn)) return match(map(eventHandler, fn))
}

/**
 * Match an event handler to conditions generated
 * from the event
 */

function match (obj) {
  return function (e) {
    var chord = eventKey(e)
    var fn = obj[chord]
    var defaultFn = obj.default;

    if (isFunction(fn)) {
      return fn(e)
    }

    if (isFunction(defaultFn)) {
      return defaultFn(e);
    }
  }
}

/**
 * Map a list of handlers over the event
 */

function combine (fns) {
  return function (e) {
    return over(e, fns)
  }
}

/**
 * Generate a string key for an event. Right now this is just equivalent
 * to keychord, but later we could add special keys for other conditions.
 */

function eventKey (e) {
  return keychord(e)
}
