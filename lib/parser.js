"use strict";

var parse_utils = require("./parser_utils.js");

var state,
  log,
  verbose,
  next,
  skip_whitespaces,
  eat,
  accept,
  test,
  expect,
  read_eos,
  is_eos,
  is_eof,
  start_look_ahead,
  commit_look_ahead,
  rollback_look_ahead;

function inspect(val) {
  return require("util").inspect(val, {depth: null, colors: true});
}

module.exports = function (tokenizer_ranges, verbose_level) {
  var fns = parse_utils(tokenizer_ranges);

  fns.log_level = verbose_level || 0;

  state = fns.state;
  log = fns.log;
  verbose = fns.verbose;
  next = fns.next;
  skip_whitespaces = fns.skip_whitespaces;
  eat = fns.eat;
  accept = fns.accept;
  test = fns.test;
  expect = fns.expect;
  read_eos = fns.read_eos;
  is_eos = fns.is_eos;
  is_eof = fns.is_eof;
  start_look_ahead = fns.start_look_ahead;
  commit_look_ahead = fns.commit_look_ahead;
  rollback_look_ahead = fns.rollback_look_ahead;

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
  while (!is_eos()) {
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
    if (accept("{")) {
      list.push(read_block());
      continue;
    }

    // expression-statement
    start_look_ahead();

    var expr = read_expression();

    // expr and is an expression not an error
    if (expr && !(expr instanceof Error)) {

      // semicolon.
      if (!test(";")) {
        rollback_look_ahead();
        return error("semicolon expected");
      }

      list.push(expr);
      commit_look_ahead();
      next(1, true);
      continue;
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

function read_expression_left_hand_side() {
  /* TODO
  = CallExpression
  / NewExpression
  */
  return read_literal();
}

// TODO add: delete, typeof
var left_unary_operators = ["++", "--", "+", "-", "~", "!"];
function read_expression_unary_left() {
  log("read_expression_unary_left");

  var operator = state.ctt;

  if (!accept(left_unary_operators)) {
    return error("expected unary operator: " + enclose(left_unary_operators, "'"), true);
  }

  var lit = read_literal();

  var ast = ast_new("unary-expr");
  ast.right = lit;
  ast.operator = operator;

  return ast;
}
var right_unary_operators = ["++", "--"];
function read_expression_unary_right() {
  log("read_expression_unary_right");
  var lit = read_expression_left_hand_side();

  if (!lit) {
    return error("left hand side expression expected", true);
  }

  if (lit instanceof Error) {
    return lit;
  }

  var operator = state.ctt;

  if (!accept(right_unary_operators)) {
    return lit;
    // return error("expected unary operator: " + enclose(unary_operators, "'"), true);
  }


  var ast = ast_new("unary-expr");
  ast.left = lit;
  ast.operator = operator;

  return ast;
}

function read_expression_unary() {
  return try_to_read(
    //read_expression_unary_right,
    read_expression_unary_left,
    read_literal
  );
}

function read_expression_conditional() {
  return read_ternary_expression(
    "conditional",
    [read_expression_logical_or],
    ["?"],
    [read_assignment_expression],
    [":"],
    [read_assignment_expression]
    );
}
function read_expression_logical_or() {
  return read_binary_expression("logical_or", ["||"], read_expression_logical_and);
}
function read_expression_logical_and() {
  return read_binary_expression("logical_and", ["&&"], read_expression_bitwise_or);
}
function read_expression_bitwise_or() {
  return read_binary_expression("bitwise_or", ["|"], read_expression_bitwise_xor);
}
function read_expression_bitwise_xor() {
  return read_binary_expression("bitwise_xor", ["^"], read_expression_bitwise_and);
}
function read_expression_bitwise_and() {
  return read_binary_expression("bitwise_and", ["&"], read_expression_equality);
}
function read_expression_equality() {
  return read_binary_expression("equality", ["==", "!="], read_expression_relational);
}
function read_expression_relational() {
  return read_binary_expression("expression", ["<=", ">=", "<", ">"], read_expression_shift);
}

function read_expression_shift() {
  return read_binary_expression("shift", ["<<", ">>>", ">>"], read_expression_additive);
}

function read_expression_additive() {
  return read_binary_expression("additive", ["+", "-"], read_expression_multiplicative);
}

function read_expression_multiplicative() {
  return read_binary_expression("multiplicative", ["*", "/", "%"], read_expression_unary);
}


function read_ternary_expression(name, st_below, st_operators, nd_below, nd_operators, rd_below) {
  log("read_ternary_expression");

  var leafs = [],
    left,
    middle,
    right,
    left_operator,
    right_operator,
    ast,
    err;

  log("read-binaray-lhs");

  left = try_to_read.apply(null, st_below);
  if (!left) {
    return error("literal or expression expected", true);
  }

  left_operator = state.ctt;

  if (!accept.call(null, st_operators)) {
    // exit with a full expression read
    if (left) {
      log("send up");
      return left;
    }

    return error(name + " first operator expected: '" + operators.join("' or '") + "'", true);
  }

  middle = try_to_read.apply(null, nd_below);
  if (!middle) {
    return error("literal or expression expected", true);
  }

  right_operator = state.ctt;

  if (!accept.call(null, nd_operators)) {
    return error(name + " second operator expected: '" + operators.join("' or '") + "'", true);
  }

  right = try_to_read.apply(null, nd_below);
  if (!right) {
    return error("literal or expression expected", true);
  }

  ast = ast_new("ternary-expr");
  ast.left = left;
  ast.middle = middle;
  ast.right = right;
  ast.left_operator = left_operator;
  ast.right_operator = right_operator;

  leafs.push(ast);
  log("is_puntuator(ctt)", is_puntuator());

  return ast;
}

function read_binary_expression(name, operators, next) {
  log("▌read_binary_expression", name);

  var leafs = [],
    left,
    ast,
    err,
    first = true;

  do {
    verbose("read-binary-left");

    left = next();

    if (!left) {
      err = error("literal or expression expected", true);
      break;
    }

    first = false;

    verbose("read-binary-operator");

    var operator = state.ctt;

    if (!accept.call(null, operators)) {
      log("send up");
      leafs.push(left);

      //err = error("binary operator expected: '" + operators.join("' or '") + "'", true);
      break;
    }

    ast = ast_new("binary-expr");
    ast.expression = true;
    ast.left = left;
    ast.right = null;
    ast.operator = operator;

    leafs.push(ast);
  } while (!is_puntuator());

  log("▌end read_binary_expression", name);

  if (err && !leafs.length) {
    log("return", name, err);
    return err;
  }

  var i = 0,
  max = leafs.length - 1;
  for (; i < max; ++i) {
    leafs[i].right = leafs[i + 1];
  }

  log("return", name, leafs[0]);

  return leafs[0];
}

function read_left_side_expression() {
  return read_literal();
  /*
  = CallExpression
  / NewExpression
  */
  return null;
}

function enclose(arr, char) {
  return char + operators.join(char + " or " + char) + char;

}
var assignment_operators = ["=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="];
function read_assignment_expression_full() {

  var left = read_left_side_expression();

  var operator = state.ctt;

  if (!accept(assignment_operators)) {
    return error("expected assignament operator: " + enclose(assignment_operators, "'"));
  }

  var right = read_assignment_expression();

  var ast = ast_new("assignment-expr");
  ast.left = left;
  ast.right = right;
  ast.operator = operator;

  return ast;
}


function read_assignment_expression() {
  start_look_ahead();
  var ast = read_assignment_expression_full();

  if (ast && !(ast instanceof Error)) {
    commit_look_ahead();
    return ast;
  }
  rollback_look_ahead();

  var exprs = [
    read_expression_conditional/*,
    read_expression_logical_or,
    read_expression_logical_and,
    read_expression_bitwise_xor,
    read_expression_bitwise_and,
    read_expression_relational,
    read_expression_shift,
    read_expression_additive,
    read_expression_multiplicative
    */
  ], i;


  for (i = 0; i < exprs.length; ++i) {
    ast = exprs[i]();

    log("read <--", inspect(exprs[i].name), ast);

    if (is_eos() && !(ast instanceof Error)) {
      log("expression read", inspect(ast));
      return ast;
    }
  }

  return null;
}

function read_expression() {
  //log("read_expression", new Error().stack);

  if (test("{") || test("fn") || test("function")) {
    return null;
  }

  var first = true,
    ast;

  // todo, secuence list is really needed-even-used
  // is there a difference with semicolon?

  do {
    if (!first && !accept(",")) {
      return error("comma expected", true);
    }

    ast = read_assignment_expression();
    if (ast === null || ast instanceof Error) {
      break;
    }

    first = false;
  } while (accept(","));

  return ast;
}


function read_multiline_comment() {
  // look ahead for the closing
  var comment = ast_new("comment", state.current - 1, state.current + 1);
  comment.multiline = true;
  comment.text = eat();

  return expect("*/", comment, "can't find end of the comment");
}

function read_singleline_comment() {
  var comment = ast_new("comment", state.current, state.current + 2);
  comment.multiline = false;
  comment.text = eat(true);

  return comment;
}

function read_parameter_list(declarator) {
  debug_skip_until(")");
}

function read_var_declarator_inline_init(declarator) {
  log("*fn* read_var_declarator_inline_init", ctt);

  skip_whitespaces();

  // var ui8 x(7)
  if (ctt !== "(") {
    return false;
  }
  next(1, true);

  if (ctt == ")") {

  } else {
    read_parameter_list();

    if (ctt !== ")") {
      return error("expected ')' parameter list close")
    }
  }

  next(1, true);

  declarator.init = {}; //TODO

  return true;
}

function read_var_declarator_initializer(declarator) {
  log("*fn* read_var_declarator_initializer", ctt);

  // var ui8 x = assignament-expression
  if (ctt !== "=") {
    return false;
  }

  next(1, true);

  var lit = read_literal();
  if (!lit) {
    return false;
  }

  declarator.init = lit;
  return true;
}

function read_var_declarator_literal_type() {
  log("read_var_declarator_literal_type");

  // var type identifier
  var ast = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }
  ast.type = state.ctt;

  next(1, true);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }

  ast.id = state.ctt;
  next(1, true);

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
              if ((ctt == "," || ctt == ";")) {
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

  return list.length ? list : null;
}

function read_literal() {
  if (is_eof()) {
    return error("eof");
  }

  log("read_literal", inspect(state.ctt));

  var ast = null;
  // null-literal
  if (accept("null")) {
    return ast_new("null-literal", state.current, null);
  }

  if (accept("true")) {
    ast = ast_new("bool-literal", state.current, null);
    ast.value = true;
    return ast;
  }

  if (accept("false")) {
    ast = ast_new("bool-literal", state.current, null);
    ast.value = false;
    return ast;
  }

  if (accept("\"", false)) {
    ast = ast_new("string-literal", state.current, null);

    if (accept("\"")) {
      ast.value = "";
      return ast;

    }

    ast.value = eat();
    return expect("\"", ast, "quote expected");
  }

  // array-literal
  if (accept("[")) {
    ast = ast_new("array-literal", state.current, null);
    ast.items = [];

    if (accept("]")) {
      return ast;
    }

    read_list(",", "]", function() {
      ast.items.push(read_literal());
    });

    return expect("]", ast, "close array expected");
  }

  // object-literal
  if (accept("{")) {
    ast = ast_new("object-literal", state.current, null);
    ast.properties = [];

    var list = [],
      prop;

    if (accept("}")) {
      return ast;
    }

    do {
      prop = ast_new("object-property", state.current, null);

      log("obj read left");

      prop.left = read_literal();
      list.push(prop);

      if (test(":")) {
        return error("colon expected");
      }
      next(1, true);

      log("obj read right");

      prop.right = read_literal();

      skip_whitespaces();

      // must be a comma ot "]"
      if (ctt !== "}" && ctt !== ",") {
        return error("comma or close array expected");
      }

      ast.properties.push("prop", prop);

    } while(accept("}"));
  }

  // numeric-literal
  if (test(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)) {
    ast = ast_new("numeric-literal", state.current, null);
    ast.value = state.ctt;
  }

  // StringLiteral
  // RegularExpressionLiteral

  if (!ast) {
    //its a variable literal
    if (is_var_identifier()) {
      ast = ast_new("var-literal", state.current, null);
      ast.value = state.ctt;
    }
  }

  next(1, true);
  return ast;
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

  // now we need a semicolon!
  if (!accept(";")) {
    return error("semicolon expected");
  }

  //set_ast_end_range(declaration, state.current);

  return declaration;

}

function read_block(ranges) {
  var block = ast_new("block", state.current, null);

  next(1);

  read_source_elements(block, ranges, true /*todo: false*/);

  //set_ast_end_range(block, state.current);

  return block;
}

function ast_new(type, start, end) {
  // build ranges start-end
  return {
    "type": type
  };
}

///
/// helpers
///

function error(message, force_return) {
  if (state.look_ahead && !force_return) {
    log('\u001b[31m' + message + '\u001b[39m', JSON.stringify(state));
    return null;
  }

  var err = new Error(message);
  err.parser = {
    position: state.current,
    line: state.ct.pos[0][0],
    column: state.ct.pos[0][1],
    token: state.ctt
  };

  if (state.look_ahead && force_return) {
    return err;
  }

  throw err;
}

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

function read_list(separators, end, callback) {
  if ("string" === typeof separators) {
    separators = [separators];
  }

  if ("string" === typeof end) {
    end = [end];
  }

  var both = separators.concat(end);

  next(-1);
  do {
    next(1, true);
    callback();

    skip_whitespaces();

    if (both.indexOf(ctt) === -1) {
      return error("excepted: '" + both.join(' or ') + "'");
    }
  } while(separators.indexOf(ctt) !== -1);

  skip_whitespaces();
  if (end.indexOf(ctt) === -1) {
    return error("excepted: '" + end.join(' or ') + "'");
  }
}

var reserved_words = ["new", "var", "if", "for", "while"];
function is_reserved_word(str) {
  //log("is_reserved_word", reserved_words.indexOf(str));
  return reserved_words.indexOf(str) !== -1;
}

var operators = ["?", "-", "+", "/", "*", "=", "==", "+="]; //...
function is_operator(str) {
  //log("is_operator", operators.indexOf(str));
  return operators.indexOf(str) !== -1;
}

var punctuation = [";", ",", "[", "]", "{", "}", "(", ")"]; //.concat(operators);
function is_puntuator(str) {
  str = str || state.ctt;

  return str && str.length === 1 && punctuation.indexOf(str) !== -1;
}

function is_var_identifier(str) {
  //log("is_var_identifier", str, is_operator(str), is_reserved_word(str));

  str = str || state.ctt;

  var op = is_operator(str);
  var rw = is_reserved_word(str);
  var punc = is_puntuator(str);

  verbose("is_var_identifier", inspect(str), !(op || rw || punc), op, rw, punc);

  return !(op || rw || punc);
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
