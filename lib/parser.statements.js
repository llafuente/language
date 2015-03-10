module.exports = {
  read_block_statement: read_block_statement,
  read_log: read_log,
  read_source_elements: read_source_elements
};


function read_block_statement() {
  var block = ast_new("block", state.current, null);

  debug(1, "▌read_block");

  if (!accept("{")) {
    return error("expected open block: '{'");
  }

  read_source_elements(block, true /*TODO false*/);

  if (!accept("}")) {
    return error("expected open block: '{'");
  }

  //set_ast_end_range(block, state.current);
  debug(1, "▌read_block");
  return ast_end(block);
}

// set body
function read_source_elements(ast, could_be_empty) {
  var list = [],
  eos = false; // end of scope
  while (!is_eob()) {

    // elements without modifiers, no semicolon
    var statement = one_of([
      read_multiline_comment,
      read_singleline_comment,
      read_function_declaration,
      // Block, has min priority
      read_block_statement,
      read_while
      ], "statement expected", true);

    // expect comment
    if (!is_error(statement)) {
      list.push(statement);
      continue;
    }

    //statements that ends with semicolon
    statement = one_of([
      read_var_declaration,
      read_enum,
      read_log,
      read_assert,
      read_defer,
      read_return,
      read_struct,
      read_bitmask,
      read_resize
    ], "statement expected", true);

    if (!is_error(statement) && read_eos()) {
      list.push(statement);
      continue;
    }

    log("read_source_elements end with semicolon");

    // semicolon and allow modifiers
    statement = one_of([
      read_expression,
      // TODO if
      // TODO for
      // TODO while
      // TODO switch
      // TODO return
      // TODO function
      // TODO labeled statement
      ], "statement expected", true);

    if (!is_error(statement) && is_expression(statement)) {
      // look for modifiers
      var modifier = read_modifiers();
      if (!is_error(modifier)) {
        modifier.body = [statement];
        statement = modifier;
      }
    }

    if (!is_error(statement) && read_eos()) {
      list.push(statement);
      continue;
    }

    // expect function declaration

    return error("unexpected statement");
  }

  if (!could_be_empty && !list.length) {
    return error("body cannot be empty");
  }

  ast.body = list.length ? list : null;

  return null;
}


function read_modifiers() {
  return one_of([
    read_modifier_when,
    read_modifier_unless,
    // moved to read_expression, this could be used in parameters
    //read_modifier_as
  ], "expected modifier", true);
}

function read_modifier_when() {
  var modifier = ast_new("if-statement");
  if (accept("when")) {
    var expr = read_expression();
    if (is_error(expr)) {
      return expr;
    }
    modifier.test = expr;
    return ast_end(modifier);
  }
  return error("expected: when modifier");
}

function read_modifier_unless() {
  var modifier = ast_new("if-statement");
  var t = ast_new("left-unary-expr");

  if (accept("unless")) {
    var expr = read_expression();
    if (is_error(expr)) {
      return expr;
    }
    t.right = expr;
    t.operator = "!";
    modifier.test = t;
    ast_end(modifier.test);
    return ast_end(modifier);
  }
  return error("expected: when modifier");
}

function read_log() {
  log("read_log");

  var ast = ast_new("call-expr");
  if (accept("log")) {
    ast.callee = "log";
    ast.arguments = [];

    read_list(",", read_eos, function() {
      var expr = read_expression();
      if (is_error(expr)) {
        return expr;
      }

      ast.arguments.push(expr);

    }, true);

    prev(true);

    return ast_end(ast);
  }

  return error("expected: log statement");
}

// TODO if no literal use all range text
function read_assert() {
  var ast = ast_new("call-expr");
  if (accept("assert")) {
    var expr = read_expression();
    if (is_error(expr)) {
      return expr;
    }
    var err = read_string_literal();
    if (is_error(err)) {
      err = null;
    }

    ast.callee = "assert";
    ast.arguments = [expr, err];

    ast_end(ast);

    return ast;
  }

  return error("exprect: assert statement");
}

function read_resize() {
  var ast = ast_new("resize-statement");
  if (accept("resize")) {
    var target = read_expression_call();
    if (is_error(target)) {
      return target;
    }

    ast.target = target;

    return ast_end(ast);
  }

  return error("expected: resize");
}
function read_delete() {
  return error("not implemented");
}

// TODO if no literal use all range text
function read_defer() {
  var ast = ast_new("defer-statement");
  if (accept("defer")) {

    var deferred = read_expression();
    if (is_error(deferred)) {
      return deferred;
    }

    ast.deferred = deferred;

    return ast_end(ast);
  }

  return error("exprect: assert statement");
}
