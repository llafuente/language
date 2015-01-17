module.exports = {
  read_block: read_block,
  read_log: read_log,
  read_source_elements: read_source_elements
};


function read_block() {
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
    log("read_source_elements dont end with semicolon");

    var statement = one_of([
      read_multiline_comment,
      read_singleline_comment,
      read_var_declaration,
      read_function_declaration,
      // Block, has min priority
      read_block
      ], "statement expected", true);

    // expect comment
    if (!is_error(statement)) {
      list.push(statement);
      continue;
    }

    //statements that ends with semicolon
    statement = one_of([
      read_log,
      read_return
    ], "statement expected", true);

    if (!is_error(statement) && accept(";")) {
      list.push(statement);
      continue;
    }

    log("read_source_elements end with semicolon");

    // now statements that need semicolon at the end!
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

    console.log(is_expression(statement), statement);
    if (!is_error(statement) && is_expression(statement)) {
      // look for modifiers
      console.log("modifier search!");
      var modifier = read_modifiers();
      console.log(modifier);
      if (!is_error(modifier)) {
        modifier.body = [statement];
        statement = modifier;
      }
    }

    if (!is_error(statement) && accept(";")) {
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
    read_modifier_unless
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
  return error("expected: when modifier")
}

function read_modifier_unless() {
  return error("not implemented");
}

function read_log() {
  log("read_log");

  var ast = ast_new("call-expr");
  if (accept("log")) {
    ast.callee = "log";
    ast.arguments = [];

    read_list(",", ";", function() {
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
