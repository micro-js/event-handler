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

  // Recurse
  fn = map(eventHandler, fn)

  if (isArray(fn)) return combine(fn)
  if (isObject(fn)) return match(fn)
}

/**
 * Match an event handler to conditions generated
 * from the event
 */

function match (obj) {
  return function (e) {
    var chord = eventKey(e)
    var fn = obj[chord]

    if (isFunction(fn)) {
      return fn(e)
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
