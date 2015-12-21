// xml pretty printer as a node transform stream
'use strict'

var inherits = require('inherits')
var Transform = require('readable-stream').Transform

var PrettyPrinter = function() {
  Transform.call(this)
}

inherits(PrettyPrinter, Transform)

module.exports = function() {
  return new PrettyPrinter()
}
