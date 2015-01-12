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
    "./parser.var.statement.js",
  ].forEach(function(lib) {
    var fns = require(lib);

    for (var i in fns) {
      if (i === "log_level") {
        fns.log_level = 6; //verbose_level || 0
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

  var p = ast_new("program", 0, tokenizer_ranges.length);
  var err = read_source_elements(p, true);

  if (err) {
    throw err;
  }

  log(p);
  return p;
};

// set body
function read_source_elements(ast, could_be_empty) {
  var list = [],
    eos = false; // end of scope
  while (!is_eob()) {
    log("read_source_elements");

    var statement = one_of([
      read_multiline_comment,
      read_singleline_comment,
      read_var_declaration
    ], "statement expected", true);

    // expect comment
    if (!is_error(statement)) {
      list.push(statement);
      continue;
    }


    // Block, has min priority
    if (test("{")) {
      var block = read_block();
      if (!(block instanceof Error)) {
        list.push(block);
        continue;
      }
    }

    // expression-statement
    start_look_ahead();

    var expr = read_expression();

    // expr and is an expression not an error
    if (expr && !(expr instanceof Error)) {
      // semicolon.
      if (accept(";")) {
        list.push(expr);
        commit_look_ahead();
        continue;
      }
    }

    rollback_look_ahead();

    /*
    / EmptyStatement
    / ExpressionStatement
    / IfStatement
    / IterationStatement
    / ContinueStatement
    / BreakStatement
    / ReturnStatement
    / LabelledStatement
    / SwitchStatement
    / ThrowStatement
    / DebuggerStatement
    */
    // expect function declaration

    return error("unexpected statement");
  }

  if (!could_be_empty && !list.length) {
    return error("body cannot be empty");
  }

  ast.body = list.length ? list : null;

  return null;
}

function read_parenthesis_expr() {
  if (ctt != "(") {
    return error("expected '('");
  }

  var expression = ast_new("expression-statement");
  next(1, true);
  var ast = read_expression();

  if (ctt != ")") {
    return error("expected ')'");
  }
}









function read_parameter_list(declarator) {
  debug_skip_until(")");
}


function read_block() {
  log("▌read_block");

  start_look_ahead();

  if (!accept("{")) {
    rollback_look_ahead();
    return errror("expected open block: '{'", true);
  }

  var block = ast_new("block", state.current, null);

  read_source_elements(block, true /*TODO false*/);

  if (!accept("}")) {
    rollback_look_ahead();
    return error("expected open block: '{'", true);
  }

  commit_look_ahead();

  //set_ast_end_range(block, state.current);
  log("▌read_block");
  return block;
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



// function list
function try_to_read() {
  var i,
    max = arguments.length,
    ast;

  for (i = 0; i < max; ++i) {
    start_look_ahead();
    verbose("> try_to_read", inspect(arguments[i].name));
    ast = arguments[i]();
    verbose("< try_to_read", inspect(arguments[i].name), inspect(ast));

    if (ast && !(ast instanceof Error)) {
      commit_look_ahead();
      return ast;
    }

    rollback_look_ahead();
  }

  return null;
}
