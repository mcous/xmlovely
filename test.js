'use strict'

var Transform = require('readable-stream').Transform
var expect = require('chai').expect
var xmlovely = require('./index.js')

describe('xmlovely', function() {
  var pretty
  beforeEach(function() {
    pretty = xmlovely()
  })

  it('should be a transform stream', function() {
    expect(pretty).to.be.an.instanceOf(Transform)
  })
})
