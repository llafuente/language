"use strict";

var state = {
    current: 0,
    stack: []
  },
  ranges = null,
  ct = null,
  ctt = null;

function advance(amount) {
  amount = amount || 1;
  state.current += amount;

  ct = ranges[state.current];
  ctt = ct.token;

}

module.exports = function (tokenizer_ranges, verbose) {
  ranges = tokenizer_ranges;

  var p = ast_new("program", 0, tokenizer_ranges.length);
  read_source_elements(p, true);

  return p;
};

var reserved_words = ["new", "var", "if", "for", "while"];
function is_reserved_word(str) {
  console.log("is_reserved_word", reserved_words.indexOf(str));
  return reserved_words.indexOf(str) !== -1;
}

var operators = ["?", "-", "+", "/", "*", "=", "==", "+="]; //...
function is_operator(str) {
  console.log("is_operator", operators.indexOf(str));
  return operators.indexOf(str) !== -1;
}

function is_var_identifier(str) {
  console.log("is_var_identifier", str, is_operator(str), is_reserved_word(str));

  return !(is_operator(str) || is_reserved_word(str));
}

// set body
function read_source_elements(ast, could_be_empty) {
  var list = [],
    eos = false; // end of scope
  while (state.current < ranges.length && !eos) {
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
    if (ctt === "var") { // TODO variable can start only with var?
      list.push(read_var_declaration());
      continue;
    }

    // Block, has min priority
    if (ctt === "{") {
      list.push(read_block());
      continue;
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
    throw error("body cannot be empty");
  }

  ast.body = list.length ? list : null;

  return list;
}


function read_multiline_comment() {
  // look ahead for the closing
  if (ranges[state.current + 2].token !== "*/") {
    throw error("can't find end of the comment");
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

function read_var_declarator() {
  var declaration = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier(ctt)) {
    throw error("variable idenfier expected");
  }
  declaration.id = ranges[state.current];

  advance(1);
  skip_whitespaces();

  if (ctt === "=") {
    // initialization;
    debug_skip_until([",", ";"]);
  }


}

function read_var_declaration() {
  advance(1);
  skip_whitespaces();

  var declaration = ast_new("var-declaration", state.current, null);

  declaration.body = [];

  do {
    declaration.body.push(read_var_declarator(ranges));
  } while(ranges[state.current] == ",");

  // now we need a semicolon!

  if (ctt !== ";") {
    throw error("semicolon expected");
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

function error(message) {
  console.log(state, ct, ctt);
  throw new Error(message);

}
