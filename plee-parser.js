"use strict";

var grammar = require("./plee-grammar.js"),
  fs = require("fs"),
  util = require("util"),
  chalk = require('chalk');

if (process.argv.length == 2) {
    throw new Error("parse file not sent");
}

console.log();

var contents = fs.readFileSync(process.argv[2], 'utf-8');

console.log("************");
console.log(contents);
console.log("************");

try {
  var result = require("util").inspect(
    grammar.parse(contents), {colors: true, depth: null}
  );

  console.log(result);
} catch(e) {
    console.log(e);

  var lines = contents.split("\n"),
    err_line = lines[e.line -1],
    chars = err_line.split(""),
    x = "",
    max = e.column + 8,
    i,
    pad = "      ",
    pad_i;

  chars[e.column - 1] = chalk.bgRed(chars[e.column - 1]);

  console.log("file:", process.argv[2]);
  console.log("error context:");

  for(i = 0; i < max; ++i) {
    x+= " ";
  }

  max = Math.max(0, e.line - 5);
  for(i = max; i < e.line; ++i) {
    pad_i = pad.substring(0, pad.length - ("" + i).length) + i;

    if (e.line - 1 === i) {
        console.log(pad_i + " | " + chars.join(""));
    } else {
        console.log(pad_i + " | " + lines[i]);
    }
  }

  if (max + e.message.length < 80) {
    console.log(x + "^", chalk.bgRed(e.message));
  } else {
    console.log(x + "^\n", chalk.bgRed(e.message));
  }
  console.log("");

  max = Math.min(lines.length, e.line + 5);

  for(i = e.line; i < max; ++i) {
    pad_i = pad.substring(0, pad.length - ("" + i).length) + i;

    console.log(pad_i + " | " + lines[i]);
  }

}
