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
  ].forEach(function(lib) {
    var fns = require(lib);

    for (var i in fns) {
      if (i === "log_level") {
        fns.log_level = verbose_level || 0
      } else {
        global[i] = fns[i];
      }
    }
  });

  operators = operators
  // ternary expr
  .concat(conditional_operators)
  // assignaments
  .concat(assignment_operators)
  // unary expr
  .concat(right_unary_operators)
  .concat(left_unary_operators)
  // binary expr
  .concat(logical_or_operators)
  .concat(logical_and_operators)
  .concat(bitwise_or_operators)
  .concat(bitwise_xor_operators)
  .concat(bitwise_and_operators)
  .concat(equality_operators)
  .concat(relational_operators)
  .concat(shift_operators)
  .concat(additive_operators)
  .concat(multiplicative_operators);


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

function read_parameter_list(declarator) {
  debug_skip_until(")");
}

///
/// helpers
///

function debug_skip_until(str) {
  if ("string" === str) {
    while (str != ctt) {
      next(1);
    }
  } else {
    while (str.indexOf(ctt) === -1) {
      next(1);
    }
  }
}
