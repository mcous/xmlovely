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

  it('should place opening and closing tags on newlines', function(done) {
    pretty.once('data', function(result) {
      expect(result.toString()).to.equal('<tag>\n</tag>\n')
      done()
    })

    pretty.write('<tag></tag>')
  })

  it('should indent children by two spaces', function(done) {
    var expected = [
      '<tag>',
      '  <child/>',
      '  <child/>',
      '</tag>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write('<tag><child/><child/></tag>')
  })

  it('should be able to handle text children', function(done) {
    var expected = [
      '<tag>',
      '  some text',
      '</tag>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write('<tag>some text</tag>')
  })

  it('should be able to handle several nodes', function(done) {
    var unpretty = [
      '<foo>',
      'some text',
      '</foo>',
      '<foo>',
      '<bar>',
      '<baz>',
      '<qux/>',
      '<foo/>',
      '</baz>',
      'hello',
      '<baz/>',
      '</bar>',
      '</foo>'
    ].join('')

    var expected = [
      '<foo>',
      '  some text',
      '</foo>',
      '<foo>',
      '  <bar>',
      '    <baz>',
      '      <qux/>',
      '      <foo/>',
      '    </baz>',
      '    hello',
      '    <baz/>',
      '  </bar>',
      '</foo>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write(unpretty)
  })

  it('should ignore anything inside quotation marks', function(done) {
    var unpretty = [
      '<node>',
      '<child attr="<ignore this/>"/>',
      '<child attr="http://and-also-this.com"/>',
      '</node>'
    ].join('')
    var expected = [
      '<node>',
      '  <child attr="<ignore this/>"/>',
      '  <child attr="http://and-also-this.com"/>',
      '</node>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write(unpretty)
  })

  it('should take a single parameter that defaults to the tab width', function(done) {
    pretty = xmlovely(6)

    var unpretty = '<foo><bar><baz/></bar></foo>'
    var expected = [
      '<foo>',
      '      <bar>',
      '            <baz/>',
      '      </bar>',
      '</foo>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write(unpretty)
  })

  it('should take an options object that sets the width and whitespace', function(done) {
    pretty = xmlovely({width: 2, whitespace: '\t'})

    var unpretty = '<foo><bar><baz/></bar></foo>'
    var expected = [
      '<foo>',
      '\t\t<bar>',
      '\t\t\t\t<baz/>',
      '\t\t</bar>',
      '</foo>',
      ''
    ].join('\n')

    pretty.once('data', function(result) {
      expect(result.toString()).to.equal(expected)
      done()
    })

    pretty.write(unpretty)
  })

  it('should handle splits in weird places', function(done) {
    var unpretty = [
      '<node',
      '><child',
      ' attr="',
      '</>"',
      '/',
      '>',
      '<',
      '/node>'
    ]
    var expected = [
      '<node>',
      '  <child attr="</>"/>',
      '</node>',
      ''
    ].join('\n')

    var result = ''
    pretty.on('data', function(data) {
      result += data
    })

    pretty.on('end', function() {
      expect(result).to.equal(expected)
      done()
    })

    unpretty.forEach(function(chunk) {
      pretty.write(chunk)
    })
    pretty.end()
  })
})
