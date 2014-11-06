"use strict";

var grammar = require("./plee-grammar.js"),
  fs = require("fs"),
  util = require("util"),
  js_beautify = require('js-beautify');

if (process.argv.length == 2) {
    throw new Error("parse file not sent");
}

var contents = fs.readFileSync(process.argv[2], 'utf-8'),
    result;

try {
  result = require("util").inspect(
    grammar.parse(contents), {colors: true, depth: null}
  );

} catch(e) {
    result = e;
}


var opts = jsbeautifier.default_options()
opts.indent_size = 2
var res = jsbeautifier.beautify(JSON.strinfigy(result), opts);

console.log(res);