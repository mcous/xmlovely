# xmlovely

Transform stream to pretty print a compact XML stream

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
