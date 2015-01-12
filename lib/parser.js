"use strict";

var parse_utils = require("./parser_utils.js");

module.exports = function (tokenizer_ranges, verbose_level) {

  [
    "./parser.ast.js",
    "./parser.tokens.js",
    "./parser.literal.js",
    "./parser.expression.js",
    "./parser.comments.js",
    "./parser.debug.js"
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
    // expect comment
    if (accept("/*")) {
      list.push(read_multiline_comment());
      continue;
    }

    if (accept("//")) {
      list.push(read_singleline_comment());
      continue;
    }
    // expect statement
    // * variable
    if (accept(["var", "const", "unvar"])) {
      list.push(read_var_declaration());
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

function read_var_declarator_inline_init(declarator) {
  log("read_var_declarator_inline_init");

  skip_whitespaces();

  // var ui8 x(7)
  if (!accept("(")) {
    return error("expected '('");
  }
  // read_parameter_list();
  if (!accept(")")) {
    return error("expected '('");
  }
  //TODO
  declarator.init = "function call!";

  return declarator;
}

function read_var_declarator_initializer(declarator) {
  log("read_var_declarator_initializer");

  // var ui8 x = assignament-expression
  if (!accept("=")) {
    return false;
  }

  var expr = read_assignment_expression();
  if (!expr) {
    return error("assginament expression expected", true);
  }
  declarator.init = expr;

  return declarator;
}

function read_var_declarator_literal_type() {
  log("read_var_declarator_literal_type");

  // var type identifier
  var ast = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }
  ast.type = eat(true);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }

  ast.id = eat(true);


  if (test("[")) {
    start_look_ahead();
    eat(true);

    ast.size = read_assignment_expression();

    if (!ast.size || ast.size instanceof Error || !accept("]")) {
      ast.size = null;
      rollback_look_ahead();
    }

    commit_look_ahead();
  }

  if (!ast.size) {
    ast.size = ast_new("number-literal", state.current, null);
    ast.size.value = 1;
  }

  return ast;
}

function read_var_declarator_literal() {
  log("*fn* read_var_declarator_literal");

  // var x
  var ast = ast_new("var-declarator", state.current, null);
  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }
  ast.type = null;
  ast.id = state.ctt;

  next(1, true);

  return ast;
}

function read_var_declarator_list() {
  log("read_var_declarator_list");

  var list = [],
    i,
    j,
    tests_left = [
      read_var_declarator_literal_type,
      read_var_declarator_literal,
    ],
    tests_right = [
      read_var_declarator_initializer,
      read_var_declarator_inline_init,
      read_eos
    ],
    declarator,
    found;

  var err = read_list(",", ";", function() {
    found = false;
    for (i = 0; i < tests_left.length; ++i) {
      start_look_ahead();

      declarator = tests_left[i]();

      if (declarator) {
        log("/lead", declarator);
        if (test([",", ";"])) {
          found = true;
        } else {
          // check right side
          start_look_ahead();
          for (j = 0; j < tests_right.length && !found; ++j) {
            var t = tests_right[j](declarator);
            if (t && test([",", ";"])) {
              commit_look_ahead();
              found = true;
            } else {
              rollback_look_ahead();
            }
          }
        }
      }

      if (found) {
        commit_look_ahead();
        list.push(declarator);
        break;
      }

      rollback_look_ahead();
    }
    return found;
  }, "unexpected var-declarator");
/*
  next(-1);
  do {
    next(1, true);
    found = false;


    for (i = 0; i < tests_left.length; ++i) {
      start_look_ahead();

      declarator = tests_left[i]();
      skip_whitespaces();


      if (declarator) {
        log("/lead", declarator);

        if (is_eos() || test(",")) {
          found = true;
        } else {
          // test 'right' side
          for (j = 0; j < tests_right.length; ++j) {
            var t = tests_right[j](declarator);
            log("**call**", tests_right[j].name, t);

            if (t) {
              skip_whitespaces();
              if (test(",") || test(";")) {
                found = true;
                break;
              }
            }
          }
        }
      }

      if (found) {
        commit_look_ahead();
        list.push(declarator);
      } else {
        rollback_look_ahead();
      }

    }

    if (!found) {
      return error("unexpected variable declaration");
    }

    skip_whitespaces();

  } while(test(","));
*/
  return list.length ? list : null;
}



function read_var_declaration () {
  log("read_var_declaration");

  var declaration = ast_new("var-declaration", state.current, null),
    declarator;

  declaration.keyword = state.ctt;
  declaration.body = [];

  declaration.body = read_var_declarator_list();
  if (!declaration.body) {
    return error("invalid empty declaration");
  }

  //set_ast_end_range(declaration, state.current);

  return declaration;

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
    return errror("expected open block: '{'", true);
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
