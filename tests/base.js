"use strict";
require('ass');

var tap = require("tap"),
    test = tap.test,
    grammar = require("../plee-grammar.js"),
    fs = require("fs"),
    path = require("path");

test("%%file%%", function (t) {
    var file_contents = fs.readFileSync(path.join(__dirname, "..", "%%file%%"), "utf-8");
    t.deepEqual(grammar.parse(file_contents), %%ast%%, "%%file%% AST MATCH!");

    t.end();
});
