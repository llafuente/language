"use strict";

var grammar = require("./plee-grammar.js"),
  fs = require("fs"),
  util = require("util"),
  beautify = require('js-beautify').js_beautify;

if (process.argv.length == 2) {
    throw new Error("parse file not sent");
}

var contents = fs.readFileSync(process.argv[2], 'utf-8'),
    result;

try {
  result = grammar.parse(contents);
  //require("util").inspect(result, {colors: true, depth: null});

} catch(e) {
    result = e;
}


console.log(JSON.stringify(result, null, 2));