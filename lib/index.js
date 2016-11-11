/**
 * Modules
 */

var isFunction = require('@f/is-function')
var isObject = require('@f/is-object')
var getValue = require('@f/get-value')
var keychord = require('@f/keychord')
var identity = require('@f/identity')
var isArray = require('@f/is-array')
var over = require('@f/maybe-over')
var map = require('@f/map')
var has = require('@f/has')

/**
 * Expose eventHandler
 */

module.exports = eventHandler

/**
 * eventHandler
 */

function eventHandler (fn) {
  if (isFunction(fn)) return defaultDecode(fn)
  if (isArray(fn)) return combine(map(eventHandler, fn))
  if (isObject(fn)) {
    if (isCustomDecoder(fn)) {
      return customDecode(fn)
    } else {
      return match(map(eventHandler, fn))
    }
  }
}

function isCustomDecoder (fn) {
  return has('decoder', fn) || has('handler', fn) || has('stopPropagation', fn) || has('preventDefault', fn) || has('selectTarget', fn)
}

function defaultDecode (fn) {
  return function (e) {
    var arg

    switch (e.type) {
      case 'input':
      case 'change':
        arg = getValue(e.target)
        break
      case 'invalid':
        arg = e.target.validationMessage
        break
      case 'submit':
        e.preventDefault()
        break
    }

    return arg !== undefined
      ? fn(arg)
      : fn()
  }
}

function customDecode (fn) {
  var decoder = fn.decoder || identity
  var stopPropagation = fn.stopPropagation
  var preventDefault = fn.preventDefault
  var selectTarget = fn.selectTarget

  fn = fn.handler

  return function (e) {
    var arg = decoder(e)

    if (preventDefault) e.preventDefault()
    if (stopPropagation) e.stopPropagation()
    if (selectTarget) e.target.select()

    if (!fn) return

    return arg !== undefined
      ? fn(arg)
      : fn()
  }
}

/**
 * Match an event handler to conditions generated
 * from the event
 */

function match (obj) {
  return function (e) {
    var chord = eventKey(e)
    var fn = obj[chord]
    var defaultFn = obj.default

    if (isFunction(fn)) {
      return fn(e)
    }

    if (isFunction(defaultFn)) {
      return defaultFn(e)
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
