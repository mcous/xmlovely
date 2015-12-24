# xmlovely

[![Version](http://img.shields.io/npm/v/xmlovely.svg?style=flat-square)](https://www.npmjs.org/package/xmlovely)
[![Build Status](http://img.shields.io/travis/mcous/xmlovely.svg?style=flat-square)](https://travis-ci.org/mcous/xmlovely) [![Coverage](http://img.shields.io/coveralls/mcous/xmlovely.svg?style=flat-square)](https://coveralls.io/r/mcous/xmlovely)  [![Dependencies](http://img.shields.io/david/mcous/xmlovely.svg?style=flat-square)](https://david-dm.org/mcous/xmlovely)
[![DevDependencies](http://img.shields.io/david/dev/mcous/xmlovely.svg?style=flat-square)](https://david-dm.org/mcous/xmlovely#info=devDependencies)

Node transform stream to pretty print a compact XML stream

## usage

`$ npm install --save xmlovely`

``` javascript
var xmlovely = require('xmlovely')
var prettyPrinter = xmlovely()

getReadableXmlStreamSomehow()
  .pipe(prettyPrinter)
  .pipe(getOutputStreamSomehow())
```

### options

``` javascript
var xmlovely = require('xmlovely')
var options = getOptionsSomehow()
var prettyPrinter = xmlovely(options)
```

Options may be a number or an object. If it is an object, you may specify the whitespace character to use and the number of those characters that make up a "tab". If it is a number, the whitespace character while be a space, and the value of `options` is the tab-width.

``` javascript
var optionsNumber = WHITESPACE_WIDTH

var optionsObject = {
  width: WHITESPACE_WIDTH,
  whitespace: WHITESPACE_CHARACTER
}
```

For exmaple, to use 3-space "tabs":

``` javascript
var xmlovely = require('xmlovely')
var prettyPrinter = xmlovely(3)

prettyPrinter.pipe(process.stdout)
prettyPrinter.write('<node><child/></node>')

// logs:
// <node>↵
// ···<child/>↵
// </node>↵
```

To use actual tabs:

``` javascript
var xmlovely = require('xmlovely')
var prettyPrinter = xmlovely({width: 1, whitespace: '\t'})

prettyPrinter.pipe(process.stdout)
prettyPrinter.write('<node><child/></node>')

// logs:
// <node>↵
// →<child/>↵
// </node>↵
```
