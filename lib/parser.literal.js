module.exports = {
  read_literal: read_literal,
  read_null_literal: read_null_literal,
  read_boolean_literal: read_boolean_literal,
  read_string_literal: read_string_literal,
  read_array_literal: read_array_literal,
  read_object_literal: read_object_literal,
  read_numeric_literal: read_numeric_literal,
  read_identifier_literal: read_identifier_literal,

  read_arguments: read_arguments
};

function read_literal() {
  if (is_eof()) {
    return error("eof reached");
  }

  log("read_literal", inspect(state.ctt));

  return one_of([
    read_null_literal,
    read_boolean_literal,
    read_string_literal,
    read_array_literal,
    read_object_literal,
    read_numeric_literal,
    read_identifier_literal
  ], "literal expected", true);
}

function read_null_literal() {
  var ast = ast_new("null-literal");

  if (accept("null")) {
    return ast_end(ast);
  }

  return error("expected null literal", true);
}


function read_boolean_literal() {
  var ast = ast_new("bool-literal", state.current, null);
  if (accept("true")) {
    ast.value = true;
    return ast_end(ast);
  }

  if (accept("false")) {
    ast.value = false;
    return ast_end(ast);
  }

  return error("expected boolean literal", true);
}

function read_string_literal() {
  var ast = ast_new("string-literal", state.current, null);
  if (accept("\"", false)) {

    if (accept("\"")) {
      ast.value = "";
      return ast_end(ast);
    }

    ast.value = eat();

    if (accept("\"")) {
      return ast_end(ast);
    }

    return error("expected string close quote", true);
  }

  return error("expected string literal", true);
}

function read_array_literal() {
  var ast = ast_new("array-literal");

  // array-literal
  if (accept("[")) {
    ast.items = [];

    var err = read_list(",", "]", function() {
      // TODO read_assignment_expression
      var lit = read_literal();

      if (!is_error(lit)) {
        ast.items.push(lit);
        return true;
      }
      return false;
    }, "unexpected array item");

    if (err) {
      return err;
    }

    return ast_end(ast);
  }

  return error("expected array literal", true);
}

// TODO fix using read_list
function read_object_literal() {
  var ast = ast_new("object-literal", state.current, null);
  // object-literal
  if (accept("{")) {
    ast.properties = [];

    var list = [],
      prop;

    if (accept("}")) {
      return ast_end(ast);
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

  return error("expected object literal", true);
}

function read_numeric_literal() {
  var ast = ast_new("number-literal", state.current, null);
  // numeric-literal
  if (test(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)) {
    ast.value = eat(true);
    return ast_end(ast);
  }

  return error("expected numeric literal", true);
}

function read_identifier_literal() {
  var ast = ast_new("var-literal", state.current, null);
  //its a variable literal
  if (is_var_identifier()) {
    ast.value = eat(true);
    return ast_end(ast);
  }

  return error("expected identifier literal", true);
}

function read_arguments() {
  var ast = ast_new("arguments-seq");

  // array-literal
  if (accept("(")) {
    ast.items = [];

    var err = read_list(",", ")", function() {
      var lit = read_assignment_expression();

      if (!is_error(lit)) {
        ast.items.push(lit);
        return true;
      }
      return false;
    }, "unexpected argument item");

    if (err) {
      return err;
    }

    return ast_end(ast);
  }

  return error("expected argument list", true);
}
