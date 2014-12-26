"use strict";

//require("noboxout-log");

var stack = [],
  state = {
    current: 0
  },
  ranges = null,
  ct = null,
  ctt = null,
  look_ahead = 0,
  indent = "";

function inspect(val) {
  return require("util").inspect(val, {depth: null, colors: true});
}

function log() {
  var args = Array.prototype.slice.call(arguments);
  if (args.length == 1 && "object" === typeof args[0]) {
    args[0] = inspect(args[0]);
  }
  args.unshift(indent);

  console.log.apply(console, args);
}

function start_look_ahead() {
  log('> start_look_ahead @', inspect(ctt));
  stack.push({current: state.current}); // clone
  ++look_ahead;
  indent += "  ";
}

function commit_look_ahead() {
  stack.pop();
  --look_ahead;

  indent = indent.substring(0, indent.length - 2);

  log('< commit_look_ahead @', inspect(ctt));
}

function rollback_look_ahead() {
  state = stack.pop();

  ct = ranges[state.current];
  ctt = ct.token;
  --look_ahead;

  indent = indent.substring(0, indent.length - 2);

  log('< rollback_look_ahead @', inspect(ctt));
}

module.exports = function (tokenizer_ranges, verbose) {
  ranges = tokenizer_ranges;

  state.current = -1;
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
  while (state.current < ranges.length && !eos) {
    log("read_source_elements", ctt);
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
    if (accept("var", "const", "unvar")) {
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
    if (expr) {
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

  log("expect body to have at least one statement", list.length);

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

function read_unary() {
  if (ctt == "+" || ctt == "-") {
    next(1, true);

    read_literal();
  }
  return error("+ or - expexted");
}

function read_binary_exp_conditional() {
  var to_read = [read_binary_exp_logical_or, read_binary_exp_logical_and, read_binary_exp_bitwise_xor, read_binary_exp_bitwise_and, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal];
  return read_ternary_expression(
    "conditional",
    to_read,
    ["?"],
    to_read,
    [":"],
    to_read
    );
}
function read_binary_exp_logical_or() {
  return read_binary_expression("logical_and", ["||"], [read_binary_exp_logical_and, read_binary_exp_bitwise_xor, read_binary_exp_bitwise_and, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_logical_and() {
  return read_binary_expression("logical_and", ["&&"], [read_binary_exp_bitwise_or, read_binary_exp_bitwise_xor, read_binary_exp_bitwise_and, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_bitwise_or() {
  return read_binary_expression("bitwise_or", ["|"], [read_binary_exp_bitwise_xor, read_binary_exp_bitwise_and, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_bitwise_xor() {
  return read_binary_expression("bitwise_xor", ["^"], [read_binary_exp_bitwise_and, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_bitwise_and() {
  return read_binary_expression("bitwise_and", ["&"], [read_binary_exp_equality, read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_equality() {
  return read_binary_expression("equality", ["==", "!="], [read_binary_exp_relational, read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}
function read_binary_exp_relational() {
  return read_binary_expression("expression", ["<=", ">=", "<", ">"], [read_binary_exp_shift, read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}

function read_binary_exp_shift() {
  return read_binary_expression("shift", ["<<", ">>>", ">>"], [read_binary_exp_multiplicative, read_binary_exp_additive, read_literal]);
}

function read_binary_exp_multiplicative() {
  return read_binary_expression("multiplicative", ["*", "/", "%"], [read_binary_exp_additive, read_literal]);
}

function read_binary_exp_additive() {
  return read_binary_expression("additive", ["+", "-"], [read_literal]);
}

function read_ternary_expression(name, st_below, st_operators, nd_below, nd_operators, rd_below) {
  log("read_binary_exp_additive", ctt);
  var leafs = [],
  left,
  middle,
  right,
  left_operator,
  right_operator,
  ast,
  err;

  do {
    test = try_to_read.apply(null, st_below);
    if (!test) {
      err = error("literal or expression expected");
      break;
    }

    left_operator = ctt;

    if (!accept.apply(null, st_operators)) {
      err = error(name + " first operator expected: '" + operators.join("' or '") + "'");
      break;
    }

    middle = try_to_read.apply(null, nd_below);
    if (!middle) {
      err = error("literal or expression expected");
      break;
    }

    right_operator = ctt;

    if (!accept.apply(null, nd_operators)) {
      err = error(name + " second operator expected: '" + operators.join("' or '") + "'");
      break;
    }

    right = try_to_read.apply(null, nd_below);
    if (!right) {
      err = error("literal or expression expected");
      break;
    }

    ast = ast_new("ternary-expr");
    ast.left = left;
    ast.middle = middle;
    ast.right = right;
    ast.left_operator = left_operator;
    ast.right_operator = right_operator;

    leafs.push(ast);
    log("is_puntuator(ctt)", is_puntuator(ctt));
  } while (false); //!is_puntuator(ctt) /*&& next(1, true)*/);

  log("END READ", ctt);

  if (err) {
    return err;
  }

  return ast;
}

function read_binary_expression(name, operators, below) {
  log("read_binary_exp_additive", ctt);
  var leafs = [],
  left,
  ast,
  err;

  do {
    left = try_to_read.apply(null, below);
    if (!left) {
      err = error("literal or expression expected");
      break;
    }

    var operator = ctt;

    if (is_eos(ctt)) {
      leafs.push(left);
      break;
    }

    if (!accept.apply(null, operators)) {
      err = error("additive operator expected: '" + operators.join("' or '") + "'");
      break;
    }

    ast = ast_new("binary-expr");
    ast.left = left;
    ast.right = null;
    ast.operator = operator;

    leafs.push(ast);
    log("is_puntuator(ctt)", is_puntuator(ctt));
  } while (!is_puntuator(ctt) /*&& next(1, true)*/);

  log("END READ", ctt);

  if (err && !leafs.length) {
    return err;
  }

  var i = 0,
  max = leafs.length - 1;
  for (; i < max; ++i) {
    leafs[i].right = leafs[i + 1];
  }

  return leafs[0];
}

function read_expression() {
  //log("read_expression", new Error().stack);

  var exprs = [
    /*
    read_binary_exp_conditional,
    */
    read_binary_exp_logical_or,
    read_binary_exp_logical_and,
    read_binary_exp_bitwise_xor,
    read_binary_exp_bitwise_and,
    read_binary_exp_relational,
    read_binary_exp_shift,
    read_binary_exp_multiplicative,
    read_binary_exp_additive
    ], i;

  do {
    for (i = 0; i < exprs.length; ++i) {
      var ast = exprs[i]();
      if (ast) {
        log("expression read", inspect(ast));
        return ast;
      }
    }
  } while (ctt != ";" && ctt != null);
  log("???");
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
  comment.text = eat();

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
  log("*fn* read_var_declarator_literal_type", ctt);

  // var type identifier
  var ast = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }
  ast.type = ctt;

  next(1, true);

  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }

  ast.id = ctt;
  next(1, true);

  return ast;
}

function read_var_declarator_literal() {
  log("*fn* read_var_declarator_literal", ctt);

  // var x
  var ast = ast_new("var-declarator", state.current, null);
  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }
  ast.type = null;
  ast.id = ctt;

  next(1, true);

  return ast;
}

function read_var_declarator_list() {
  log("*fn* read_var_declarator_list", ctt);

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

        if ((ctt == "," || ctt == ";")) {
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

  } while(ctt === ",");

  return list.length ? list : null;
}

function read_literal() {
  if (ctt === null) {
    return error("eof");
  }

  log("read_literal", inspect(ctt));

  var ast = null;
  // null-literal
  if (ctt === "null") {
    ast = ast_new("null-literal", state.current, null);
  }

  if (ctt === "true") {
    ast = ast_new("bool-literal", state.current, null);
    ast.value = true;
  }

  if (ctt === "false") {
    ast = ast_new("bool-literal", state.current, null);
    ast.value = false;
  }
  if (ctt === "\"") {
    ast = ast_new("string-literal", state.current, null);

    next(1);
    if (ctt !== "\"") {
      ast.value = ctt;

      next(1);
      if (ctt !== "\"") {
        return error("quote expected");
      }
    } else {
      ast.value = "";
    }
  }

  // array-literal
  if (ctt === "[") {
    ast = ast_new("array-literal", state.current, null);
    ast.items = [];

    if (ctt === "]") {
      next(1, true);
    } else {

      next(1, true);
      read_list(",", "]", function() {
        ast.items.push(read_literal());
      });

      /*
      do {

        ast.items.push(read_literal());

        // must be a comma ot "]"
        if (ctt !== "]" && ctt !== ",") {
          return error("comma or close array expected");
        }

        skip_whitespaces();
      } while(ctt === ",");
      */

      if (ctt !== "]") {
        return error("close array expected");
      }
    }
  }

  // object-literal
  if (ctt === "{") {
    ast = ast_new("object-literal", state.current, null);
    ast.properties = [];

    var list = [],
      prop;

    do {
      next(1, true);

      prop = ast_new("object-property", state.current, null);

      log("obj read left");

      prop.left = read_literal();
      list.push(prop);

      skip_whitespaces();

      if (ctt !== ":") {
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

    } while(ctt !== "}");
  }

  // numeric-literal
  if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(ctt)) {
    log("here is a number!!", ctt);
    ast = ast_new("numeric-literal", state.current, null);
    ast.value = ctt;
  }

  // StringLiteral
  // RegularExpressionLiteral

  if (!ast) {
    //its a variable literal
    if (is_var_identifier(ctt)) {
      ast = ast_new("variable-literal", state.current, null);
      ast.value = ctt;
    }
  }

  next(1, true);
  return ast;
}

function read_var_declaration () {
  log("*fn* read_var_declaration");

  var declaration = ast_new("var-declaration", state.current, null),
    declarator;

  declaration.keyword = ctt;
  declaration.body = [];

  declaration.body = read_var_declarator_list(ranges);
  if (!declaration.body) {
    return error("invalid empty declaration");
  }

  // now we need a semicolon!
  if (ctt !== ";") {
    log(declaration);
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

function error(message) {
  if (look_ahead) {
    log(message, ctt);
    return null;
  }

  log(state, ct, ctt);

  var err = new Error(message);
  err.parser = {
    position: state.current,
    line: ct.pos[0][0],
    column: ct.pos[0][1],
    token: ctt
  };

  throw err;
}

function skip_whitespaces() {
  var t;
  while (ctt !== null && /^(\s)*$/.test(ctt)) {
    t = next(1);
  }

  return t;
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

function read_eos() {
  skip_whitespaces();
  if (ctt == ";") {
    return true;
  }
  return false;
}

function is_eos() {
  log("is_eos", inspect(ctt));

  return ct === null || ctt == ";";
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
  return str && str.length === 1 && punctuation.indexOf(str) !== -1;
}

function is_var_identifier(str) {
  //log("is_var_identifier", str, is_operator(str), is_reserved_word(str));

  var op = is_operator(str);
  var rw = is_reserved_word(str);
  var punc = is_puntuator(str);

  log("is_var_identifier", inspect(str), !(op || rw || punc), op, rw, punc);

  return !(op || rw || punc);
}

// function list
function try_to_read() {
  var i,
    max = arguments.length,
    ast;

  for (i = 0; i < max; ++i) {
    start_look_ahead();
    log("> try_to_read", inspect(arguments[i].name));
    ast = arguments[i]();
    log("< try_to_read", inspect(arguments[i].name), inspect(ast));

    if (ast) {
      commit_look_ahead();
      return ast;
    }

    rollback_look_ahead();
  }

  return null;
}













function next(amount, skip_white_spaces) {
  amount = amount || 1;
  state.current += amount;

  if (state.current >= ranges.length) {
    ct = ctt = null;
    log(">>> EOF");
    return false;
  }

  ct = ranges[state.current];
  ctt = ct.token;

  log("** next", inspect(ctt));


  if (skip_white_spaces === true) {
    return skip_whitespaces();
  }
  return true;
}




function eat(str, skip_white_spaces) {
  var cp_ctt = ctt;

  next(1, skip_white_spaces);

  return cp_ctt;
}

function accept(str, skip_white_spaces) {
  if (arguments.length > 1) {
    var i = 0,
      max = arguments.length;
    for (i = 0; i < max; ++i) {
      if (accept(arguments[i])) {
        return true;
      }
    }
    return false;
  }

  if (skip_white_spaces) {
    skip_whitespaces();
  }

  if (str === ctt) {
    log("accept-ok", inspect(str));
    next(1, true);
    return true;
  }
  log("accept-KO", inspect(str))
  return false;
}

function test(str) {
  log("-test", inspect(str), inspect(ctt));
  return ctt === str;
}

function expect(str, ok, err) {
  log("-expect", str);

  if (accept(str)) {
    log("expect-ok", str);
    return ok;
  }
  log("expect-KO", str);
  return error(err);
}
