"use strict";

var grammar = require("./plee-grammar.js"),
  fs = require("fs"),
  util = require("util"),
  beautify = require('js-beautify').js_beautify;

if (process.argv.length == 2) {
    throw new Error("parse file not sent");
}

var filename = process.argv[2],
    contents = fs.readFileSync(filename, 'utf-8'),
    result;

try {
  result = grammar.parse(contents);
  //require("util").inspect(result, {colors: true, depth: null});

} catch(e) {
    result = e;
}

var test_base = require("fs").readFileSync("./tests/base.js", "utf8");
test_base = test_base
    .replace(/%%file%%/g, filename)
    .replace(/%%ast%%/g, JSON.stringify(result, null, 2));

var test_base = require("fs").writeFileSync("./tests/test-" + require("path").basename(filename), test_base);