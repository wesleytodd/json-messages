'use strict'
// vim: set ts=2 sw=2:
const assert = require('assert')
const {describe, it} = require('mocha')
const {name: pkgName} = require('../package.json')
const message = require('../')

describe(pkgName, () => {
  it('should return an empty array', () => {
    const msgs = message()
    assert(Array.isArray(msgs))
    assert.equal(msgs.length, 0)
  })

  it('should format a single message', () => {
    const m = {
      id: 1234,
      code: 'TEST_ERROR',
      detail: 'The error message',
      level: message.levels.ERROR,
      status: 500,
      title: 'A message title',
      meta: {
        test: 'foo'
      },
      source: {
        stack: (new Error('foo')).stack
      },
      links: {
        about: 'https://example.com/about'
      }
    }
    const msgs = message(m)
    assert.equal(msgs.length, 1)
    assert.equal(msgs[0].id, String(m.id))
    assert.equal(msgs[0].code, m.code)
    assert.equal(msgs[0].level, m.level)
    assert.equal(msgs[0].detail, m.detail)
    assert.equal(msgs[0].status, String(m.status))
    assert.equal(msgs[0].title, m.title)
    assert.equal(msgs[0].meta.test, m.meta.test)
    assert.equal(msgs[0].source.stack, m.source.stack)
    assert.equal(msgs[0].links.about, m.links.about)
  })

  it('should format an array of messages', () => {
    const msgs = message([{
      code: 'FOO',
      level: message.levels.WARNING
    }, {
      code: 'BAR',
      level: message.levels.SUCCESS
    }])

    assert.equal(msgs.length, 2)
    assert.equal(msgs[0].code, 'FOO')
    assert.equal(msgs[1].code, 'BAR')
  })
})
