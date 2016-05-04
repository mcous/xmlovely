// xml pretty printer as a node transform stream
'use strict'

var StringDecoder = require('string_decoder').StringDecoder
var inherits = require('inherits')
var Transform = require('readable-stream').Transform
var repeat = require('lodash.repeat')
var reduce = require('lodash.reduce')
var isFinite = require('lodash.isfinite')

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
  var _this = this
  var newChunk = reduce(stringChunk, function(result, char, index) {
    _this._index += index

    if (!_this._attribute || (char === ATTRIBUTE)) {
      if (_this._newLevel) {
        _this._newLevel = false

        if (!_this._closingNode) {
          _this._level++
        }
        _this._closingNode = false

        if (char === OPEN) {
          _this._lookingForNodeEnd = true
          return result
        }

        return result + _this._indent() + char
      }

      if (_this._lookingForNodeEnd) {
        _this._lookingForNodeEnd = false

        if (char === END) {
          _this._closingNode = true
          _this._level--
        }

        return result + _this._indent() + OPEN + char
      }

      if (char === OPEN) {
        if (_this._index) {
          result += EOL
        }

        _this._lookingForNodeEnd = true
        return result
      }

      if (char === CLOSE) {
        _this._newLevel = true
        return result + char + EOL
      }

      if (char === END) {
        _this._level--
      }
      else if (char === ATTRIBUTE) {
        _this._attribute = !_this._attribute
      }
    }

    return result + char
  }, '')

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
