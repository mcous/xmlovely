// xml pretty printer as a node transform stream
'use strict'

var StringDecoder = require('string_decoder').StringDecoder
var inherits = require('inherits')
var Transform = require('readable-stream').Transform
var repeat = require('lodash.repeat')
var reduce = require('lodash.reduce')
var isFinite = require('lodash.isFinite')

var EOL = require('os').EOL
var OPEN = '<'
var CLOSE = '>'
var END = '/'
var ATTRIBUTE = '"'

var PrettyPrinter = function(width, whitespace) {
  Transform.call(this)

  this._decoder = new StringDecoder('utf8')
  this._level = 0
  this._width = width
  this._tab = repeat(whitespace, width)
  this._attribute = false
  this._index = 0
  this._lookingForNodeEnd = false
  this._newLevel = false
  this._closingNode = false
}

inherits(PrettyPrinter, Transform)

PrettyPrinter.prototype._indent = function() {
  return repeat(this._tab, this._level)
}

PrettyPrinter.prototype._transform = function(chunk, encoding, done) {
  var stringChunk = this._decoder.write(chunk)

  var newChunk = reduce(stringChunk, function(result, char, index) {
    this._index += index

    if (!this._attribute || (char === ATTRIBUTE)) {
      if (this._newLevel) {
        this._newLevel = false

        if (!this._closingNode) {
          this._level++
        }
        this._closingNode = false

        if (char === OPEN) {
          this._lookingForNodeEnd = true
          return result
        }

        return result + this._indent() + char
      }

      if (this._lookingForNodeEnd) {
        this._lookingForNodeEnd = false

        if (char === END) {
          this._closingNode = true
          this._level--
        }

        return result + this._indent() + OPEN + char
      }

      if (char === OPEN) {
        if (this._index) {
          result += EOL
        }

        this._lookingForNodeEnd = true
        return result
      }

      if (char === CLOSE) {
        this._newLevel = true
        return result + char + EOL
      }

      if (char === END) {
        this._level--
      }
      else if (char === ATTRIBUTE) {
        this._attribute = !this._attribute
      }
    }

    return result + char
  }, '', this)

  this.push(newChunk)
  done()
}

var parseOptions = function(opts) {
  if (isFinite(opts)) {
    return {width: opts, whitespace: ' '}
  }

  opts = opts || {}

  return {
    width: opts.width || 2,
    whitespace: opts.whitespace || ' '
  }
}

module.exports = function(opts) {
  var options = parseOptions(opts)
  return new PrettyPrinter(options.width, options.whitespace)
}
