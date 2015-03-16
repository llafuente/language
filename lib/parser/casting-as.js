module.exports = {
  read_modifier_as: read_modifier_as,
  read_cast: read_cast
};

function read_cast(right_side) {
  debug(2, "read_cast");
  var ast = ast_new("cast");

  if (!accept("(")) {
    return error("expected casting open: '('");
  }

  ast.var_type = read_type();

  if (is_error(ast.type)) {
    return ast.type;
  }

  if (!accept(")")) {
    return error("expected casting close: ')'");
  }

  ast.body = right_side();

  if (is_error(ast.body)) {
    return ast.body
  }

  if (!Array.isArray(ast.body)) {
    ast.body = [ast.body];
  }


  return ast_end(ast);
}


function read_modifier_as(ast_to_cast) {
  debug(2, "read_modifier_as");
  var ast = ast_new("cast");

  if (!accept("as")) {
    return ast_to_cast;
  }

  ast.var_type = read_type();

  if (is_error(ast.type)) {
    return ast.type;
  }

  as_ast.body = [ast_to_cast];

  return ast_end(ast);
}
