module.exports = {
  read_literal: read_literal,
  read_null_literal: read_null_literal,
  read_boolean_literal: read_boolean_literal,
  read_string_literal: read_string_literal,
  read_array_literal: read_array_literal,
  read_object_literal: read_object_literal,
  read_numeric_literal: read_numeric_literal,
  read_identifier_literal: read_identifier_literal
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
  if (accept("null")) {
    return ast_new("null-literal", state.current, null);
  }

  return error("expected null literal", true);
}


function read_boolean_literal() {
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

  return error("expected boolean literal", true);
}

function read_string_literal() {
  if (accept("\"", false)) {
    ast = ast_new("string-literal", state.current, null);

    if (accept("\"")) {
      ast.value = "";
      return ast;

    }

    ast.value = eat();
    return expect("\"", ast, "quote expected");
  }

  return error("expected string literal", true);
}

function read_array_literal() {
  // array-literal
  if (accept("[")) {
    var ast = ast_new("array-literal", state.current, null);
    ast.items = [];

    var err = read_list(",", "]", function() {
      // TODO read_assignment_expression
      var lit = read_literal();

      if (lit && !(lit instanceof Error)) {
        ast.items.push(lit);
        return true;
      }
      return false;
    }, "unexpected array item");

    if (err) {
      return err;
    }

    return ast;
  }

  return error("expected array literal", true);
}


function read_object_literal() {
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

  return error("expected object literal", true);
}

function read_numeric_literal() {
  // numeric-literal
  if (test(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)) {
    ast = ast_new("number-literal", state.current, null);
    ast.value = eat(true);
    return ast;
  }

  return error("expected numeric literal", true);
}

function read_identifier_literal() {
  //its a variable literal
  if (is_var_identifier()) {
    ast = ast_new("var-literal", state.current, null);
    ast.value = eat(true);
    return ast;
  }

  return error("expected identifier literal", true);
}
