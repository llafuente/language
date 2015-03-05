module.exports = {
  read_literal: read_literal,
  read_constant_literal: read_constant_literal,

  read_null_literal: read_null_literal,
  read_boolean_literal: read_boolean_literal,
  read_string_literal: read_string_literal,
  read_array_literal: read_array_literal,
  read_object_literal: read_object_literal,
  read_numeric_literal: read_numeric_literal,
  read_identifier_literal: read_identifier_literal,

  read_arguments: read_arguments,
  read_type: read_type
};

function read_constant_literal() {
  debug(2, "read_constant_literal", inspect(state.ctt));

  return one_of([
    read_null_literal,
    read_boolean_literal,
    read_string_literal,
    read_array_literal,
    read_object_literal,
    read_numeric_literal
    ], "literal expected", true);
}

function read_literal() {
  debug(2, "read_literal", inspect(state.ctt));

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

  return error("expected null literal");
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

  return error("expected boolean literal");
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

    return error("expected string close quote");
  }

  return error("expected string literal");
}

function read_array_literal() {
  var ast = ast_new("array-literal");

  // array-literal
  if (accept("[")) {
    ast.items = [];

    var err = read_list(",", "]", function() {
      var lit = read_assignment_expression();

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

  return error("expected array literal");
}

function read_object_literal() {
  var ast = ast_new("object-literal", state.current, null);
  // object-literal
  if (accept("{")) {
    ast.properties = [];

    var err = read_list(",", "}", function() {
      var prop = ast_new("object-property", state.current, null);

      debug(3, "obj read left");

      prop.left = read_literal();

      if (is_error(prop.left)) {
        return prop.left;
      }

      if (!accept(":")) {
        return error("colon expected");
      }

      debug(3, "obj read right");

      prop.right = read_assignment_expression();

      if (is_error(prop.right)) {
        return prop.right;
      }

      ast.properties.push(ast_end(prop));

      return true;
    }, "unexpected array item");

    if (err) {
      return err;
    }

    return ast_end(ast);
  }

  return error("expected object literal");
}

function read_numeric_literal() {
  var ast = ast_new("number-literal", state.current, null);
  // numeric-literal
  if (test(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)) {
    ast.value = parseFloat(eat(true), 10);
    return ast_end(ast);
  }

  return error("expected numeric literal");
}

function read_identifier_literal() {
  var ast = ast_new("var-literal", state.current, null);
  //its a variable literal
  if (is_var_identifier()) {
    ast.value = eat(true);
    return ast_end(ast);
  }

  return error("expected identifier literal");
}

function read_argument() {
  var arg = ast_new("argument"),
    id;

  start_look_ahead();
  id = read_identifier_literal();
  // test "lit: expr"
  if (accept (":")) {
    lit = read_assignment_expression();
    if (is_error(lit)) {
      rollback_look_ahead();
      return lit;
    }
    commit_look_ahead();
  } else {
    // test "expr (as lit)?"
    rollback_look_ahead();
    id = null;

    lit = read_assignment_expression();
    if (is_error(lit)) {
      return lit;
    }

    if (accept("as")) {
      var id = read_identifier_literal();
      if (is_error(id)) {
        return id;
      }
    }
  }

  if (id) {
    id.type = "string-literal";
  }

  arg.parameter = id;
  arg.value = lit;
  return ast_end(arg);

}

function read_arguments() {
  var ast = ast_new("arguments-seq");

  // array-literal
  if (accept("(")) {
    ast.items = [];
    var i = 0;
    var err = read_list(",", ")", function() {
      var arg = read_argument();

      if (is_error(arg)) {
        return arg;
      }

      ast.items.push(ast_end(arg));

      return true;
    }, "unexpected argument item");

    if (err) {
      return err;
    }

    return ast_end(ast);
  }

  return error("expected argument list");
}


function read_type() {
  var ast = ast_new("type");
  var type = null;
  var sub_type = null;
  var dimensions = null;

  if (!is_type()) {
    type = null;
  } else {
    // TODO study this change! right side of the type must not contains spaces ??
    type = eat();
  }

  if (accept("<")) {
    if (type === null) {
      return error("expected: 'type_wrapper<type>'");
    }

    sub_type = read_type();

    if (!accept(">")) {
      return error("expected: '>'");
    }
  } else if (test("[")) { //shortcut [?]
    ast.type = type;
    ast.sub_type = null;
    ast.dimensions = dimensions;

    ast_end(ast);

    sub_type = ast;
    ast = ast_new("type");

    type = "array";
    dimensions = read_sequence(
      function() {
        if (accept("[")) {
          return null; // do not insert
        }
        return error("expected: '['");
      },
      function() {
        if (test("]")) {
          return {"type": "number-literal", "value": 0}; // dynamic
        }
        return read_numeric_literal();
      },
      function() {
        if (accept("]")) {
          return null; // do not insert
        }
        return error("expected: ']'");
      }
    );
  } else if (accept("{")) { //shortcut {}
    if (!accept("}")) {
      return error("expected: '}'");
    }
    type = "object";
  }

  ast.type = type;
  ast.sub_type = sub_type;
  ast.dimensions = dimensions;

  skip_whitespaces();

  return ast_end(ast);
}
