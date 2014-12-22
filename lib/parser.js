"use strict";

//require("noboxout-log");

var stack = [],
  state = {
    current: 0
  },
  ranges = null,
  ct = null,
  ctt = null,
  look_ahead = 0;

function start_look_ahead() {
  stack.push({current: state.current}); // clone
  ++look_ahead;
}

function commit_look_ahead() {
  stack.pop();
  --look_ahead;
}

function rollback_look_ahead() {
  state = stack.pop();

  ct = ranges[state.current];
  ctt = ct.token;
  --look_ahead;
}

function advance(amount, skip_white_spaces) {
  amount = amount || 1;
  state.current += amount;

  if (state.current >= ranges.length) {
    ct = ctt = null;
  } else {
    ct = ranges[state.current];
    ctt = ct.token;
  }

  if (skip_white_spaces === true) {
    skip_whitespaces();
  }

  console.log("** advance", ctt);
}

module.exports = function (tokenizer_ranges, verbose) {
  ranges = tokenizer_ranges;

  state.current = -1;
  advance(1, true);

  var p = ast_new("program", 0, tokenizer_ranges.length);
  read_source_elements(p, true);

  return p;
};

// set body
function read_source_elements(ast, could_be_empty) {
  var list = [],
    eos = false; // end of scope
  while (state.current < ranges.length && !eos) {
    console.log("read_source_elements", ctt);
    // expect comment
    if (ctt === "/*") {
      list.push(read_multiline_comment());
      continue;
    }

    if (ctt === "//") {
      list.push(read_singleline_comment());
      continue;
    }
    // expect statement
    // * variable
    if (ctt === "var" || ctt === "const" || ctt === "unvar") { // TODO variable can start only with var?
      list.push(read_var_declaration());
      continue;
    }

    // Block, has min priority
    if (ctt === "{") {
      list.push(read_block());
      continue;
    }

    // expression-statement
    start_look_ahead();
    var expr = read_expression();
    if (expr) {
      // semicolon.
      require_semicolon();

      commit_look_ahead();
      continue;
    } else {
      rollback_look_ahead();
    }

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

    advance(1);
  }

  if (!could_be_empty && !list.length) {
    return error("body cannot be empty");
  }

  ast.body = list.length ? list : null;

  return list;
}

function read_parenthesis_expr() {
  if (ctt != "(") {
    return error("expected '('");
  }

  var expression = ast_new("expression-statement");
  advance(1, true);
  read_expression();

  if (ctt != ")") {
    return error("expected ')'");
  }
}

function read_binary_expr() {
  read_list(operators, end, callback)

}

function read_expression() {
  var exprs = [
      read_parenthesis_expr,
      read_binary_expr
    ], i;
  for (i = 0; i < expr; ++i) {
    var ast = exprs[i]();
    if (ast) {
      return ast;
    }
  }
}


function read_multiline_comment() {
  // look ahead for the closing
  if (ranges[state.current + 2].token !== "*/") {
    return error("can't find end of the comment");
  }

  var comment = ast_new("comment", state.current, state.current + 2);
  comment.multiline = true;
  comment.text = ranges[state.current + 1].token;

  advance(2);

  return comment;
}

function read_singleline_comment() {
  var comment = ast_new("comment", state.current, state.current + 2);
  comment.multiline = false;
  comment.text = ranges[state.current + 1].token;

  advance(1);

  return comment;
}

function read_parameter_list(declarator) {
  debug_skip_until(")");
}

function read_var_declarator_inline_init(declarator) {
  console.log("*fn* read_var_declarator_inline_init", ctt);

  skip_whitespaces();

  // var ui8 x(7)
  if (ctt !== "(") {
    return false;
  }
  advance(1, true);

  if (ctt == ")") {

  } else {
    read_parameter_list();

    if (ctt !== ")") {
      return error("expected ')' parameter list close")
    }
  }

  advance(1, true);

  declarator.init = {}; //TODO

  return true;
}

function read_var_declarator_initializer(declarator) {
  console.log("*fn* read_var_declarator_initializer", ctt);

  // var ui8 x = assignament-expression
  if (ctt !== "=") {
    return false;
  }

  advance(1, true);

  var lit = read_literal();
  if (!lit) {
    return false;
  }

  declarator.init = lit;
  return true;
}

function read_var_declarator_literal_type() {
  console.log("*fn* read_var_declarator_literal_type", ctt);

  // var type identifier
  var ast = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }
  ast.type = ctt;

  advance(1, true);

  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }

  ast.id = ctt;
  advance(1, true);

  return ast;
}

function read_var_declarator_literal() {
  console.log("*fn* read_var_declarator_literal", ctt);

  // var x
  var ast = ast_new("var-declarator", state.current, null);
  if (!is_var_identifier(ctt)) {
    return error("variable idenfier expected");
  }
  ast.type = null;
  ast.id = ctt;

  advance(1, true);

  return ast;
}

function read_var_declarator_list() {
  console.log("*fn* read_var_declarator_list", ctt);

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

  advance(-1);
  do {
    advance(1, true);
    found = false;


    for (i = 0; i < tests_left.length; ++i) {
      start_look_ahead();

      declarator = tests_left[i]();
      skip_whitespaces();


      if (declarator) {
        console.log("/lead", declarator);

        if ((ctt == "," || ctt == ";")) {
          found = true;
        } else {
          // test 'right' side
          for (j = 0; j < tests_right.length; ++j) {
            var t = tests_right[j](declarator);
            console.log("**call**", tests_right[j].name, t);

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
  console.log("read_literal", ctt);

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

    advance(1);
    if (ctt !== "\"") {
      ast.value = ctt;

      advance(1);
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
      advance(1, true);
    } else {

      advance(1, true);
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
      advance(1, true);

      prop = ast_new("object-property", state.current, null);

      console.log("obj read left");

      prop.left = read_literal();
      list.push(prop);

      skip_whitespaces();

      if (ctt !== ":") {
        return error("colon expected");
      }
      advance(1, true);

      console.log("obj read right");

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
    console.log("here is a number!!", ctt);
    ast = ast_new("numeric-literal", state.current, null);
    ast.value = ctt;
  }

  // StringLiteral
  // RegularExpressionLiteral

  if (!ast) {
    console.log("fallback to variable-literal");
    //its a variable literal
    if (is_var_identifier(ctt)) {
      ast = ast_new("variable-literal", state.current, null);
      ast.value = ctt;
    }
  }

  advance(1, true);
  return ast;
}

function read_var_declaration () {
  console.log("*fn* read_var_declaration");

  var declaration = ast_new("var-declaration", state.current, null),
    declarator;

  declaration.keyword = ctt;
  declaration.body = [];

  advance(1, true); // skip var
  declaration.body = read_var_declarator_list(ranges);
  if (!declaration.body) {
    return error("invalid empty declaration");
  }

  // now we need a semicolon!
  if (ctt !== ";") {
    console.log(declaration);
    return error("semicolon expected");
  }

  //set_ast_end_range(declaration, state.current);

  return declaration;

}

function read_block(ranges) {
  var block = ast_new("block", state.current, null);

  advance(1);

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
    console.log(message, ctt);
    return null;
  }

  console.log(state, ct, ctt);

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
  while (/^(\s)*$/.test(ctt)) {
    advance(1);
  }
}

function debug_skip_until(str) {
  if ("string" === str) {
    while (str != ctt) {
      advance(1);
    }
  } else {
    while (str.indexOf(ctt) === -1) {
      advance(1);
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
  return ct === null || ctt == ";";
}

function require_semicolon() {
  skip_whitespaces();

  if (!ct || ctt !== ";") {
    return error("expected semilocon");
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

  advance(-1);
  do {
    advance(1, true);
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
  //console.log("is_reserved_word", reserved_words.indexOf(str));
  return reserved_words.indexOf(str) !== -1;
}

var operators = ["?", "-", "+", "/", "*", "=", "==", "+="]; //...
function is_operator(str) {
  //console.log("is_operator", operators.indexOf(str));
  return operators.indexOf(str) !== -1;
}

var punctuation = [";", ",", "[", "]", "{", "}", "(", ")"].concat(operators);
function is_puntuator(str) {
  return str.length === 1 && punctuation.indexOf(str) !== -1;

}

function is_var_identifier(str) {
  //console.log("is_var_identifier", str, is_operator(str), is_reserved_word(str));

  var op = is_operator(str);
  var rw = is_reserved_word(str);
  var punc = is_puntuator(str);

  console.log("**call** is_var_identifier", str, op, rw, punc);

  return !(op || rw || punc);
}
