module.exports = {
  read_bitmask: read_bitmask
};

function read_bitmask() {
  var ast = ast_new("bitmask-declaration");

  if (!accept("bitmask")) {
    return error("expected bitmask literal");
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
    ++i;
    prop = ast_new("bitmask-property");

    prop.id = read_identifier_literal();

    if (is_error(prop.id)) {
      return prop.id;
    }

    if (accept("=")) {
      prop.default = read_boolean_literal();
      // TODO we can also read_numeric_literal?
      if (is_error(prop.default)) {
        return prop.default;
      }
    } else {
      prop.default = false;
    }
    ast.body.push(ast_end(prop));
    skip_whitespaces();
  } while (accept(","));


  if (!accept("}")) {
    return error("expected: '}'");
  }

  return ast_end(ast);
}
