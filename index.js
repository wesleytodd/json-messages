'use strict'
// vim: set ts=2 sw=2:

// Exports
module.exports = formatMessages
module.exports.levels = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success'
}

// Message fields
const fields = [{
  name: 'id',
  format: formatString(null)
}, {
  name: 'status',
  format: formatString(null)
}, {
  name: 'title',
  format: formatString(null)
}, {
  name: 'detail',
  format: formatString(null)
}, {
  name: 'level',
  format: formatString(module.exports.levels.ERROR)
}, {
  name: 'code',
  format: formatString(null)
}, {
  name: 'meta',
  format: formatObject
}, {
  name: 'source',
  format: formatObject
}, {
  name: 'links',
  format: (links) => {
    if (!links) {
      return null
    }

    return Object.keys(links).reduce((obj, l) => {
      if (typeof links[l] === 'string') {
        obj[l] = links[l]
      } else if (typeof links[l] === 'object' && typeof links[l].href === 'string') {
        obj[l] = {
          href: links[l].href
        }
        if (typeof links[l].meta === 'object') {
          obj[l].meta = links[l].meta
        }
      }

      return obj
    }, {})
  }
}]

function formatMessages (msg = []) {
  return (Array.isArray(msg) ? msg : [msg]).map((m) => {
    return fields.reduce((message, {name, format}) => {
      if (typeof m[name] !== 'undefined' && m[name] !== null) {
        message[name] = format(m[name])
      }
      return message
    }, {})
  })
}

function formatString (def) {
  return function (str) {
    return (str && String(str)) || def
  }
}

function formatObject (obj) {
  return typeof obj === 'object' ? obj : null
}
