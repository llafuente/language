module.exports = {
  read_enum: read_enum
};

function read_enum() {
  var ast = ast_new("enum-declaration");

  if (!accept("enum")) {
    return error("expected enum literal");
  }

  var id = read_identifier_literal();
  if (is_error(id)) {
    return id;
  }

  if (!accept("{")) {
    return error("expected: '{'");
  }


  ast.body = [];

  var t,
  sub_ast,
  i = 0,
  prop;

  do {
    prop = ast_new("enum-property");

    prop.id = read_identifier_literal();

    if (is_error(prop.id)) {
      return prop.id;
    }

    if (accept("=")) {
      prop.value = read_numeric_literal();

      if (is_error(prop.value)) {
        return prop.value;
      }

      if (prop.value.value < i) {
        //TODO final
        return error("enum-property value lower than the last one.");
      }
      i = prop.value.value;
    }

    if (i > 255) {
      return error("enum-property value maximum exceeded");
    }

    prop.value = i;

    ast.body.push(ast_end(prop));
    skip_whitespaces();

    ++i;
  } while (accept(","));


  if (!accept("}")) {
    return error("expected: '}'");
  }

  return ast_end(ast);
}
