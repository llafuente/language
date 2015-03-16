"use strict";

var parse_utils = require("./parser_utils.js");

module.exports = function (tokenizer_ranges, verbose_level) {

  [
    "./parser.debug.js",
    "./parser.ast.js",
    "./parser.tokens.js",
    "./parser.literal.js",
    "./parser.expression.js",
    "./parser.comments.js",
    "./parser.statements.js",
    "./parser.var.statement.js",
    "./parser.fn.statement.js",
    "./parser.while.statement.js",
    "./parser/bitmask.js",
    "./parser/casting-as.js",
    "./parser/enum.js",
    "./parser/struct-block.js",
    "./parser/if.js",
  ].forEach(function(lib) {
    var fns = require(lib);

    for (var i in fns) {
      if (i === "log_level") {
        fns.log_level = verbose_level || 0;
      } else {
        global[i] = fns[i];
      }
    }
  });

  var fns = parse_utils(tokenizer_ranges),
    i;

  // globalize, polute atm for easy to use...
  for (i in fns) {
    global[i] = fns[i];
  }

  next(1, true);

  var p = ast_new("program");

  var err = read_source_elements(p, true);

  if (err) {
    throw err;
  }

  return ast_end(p);
};
