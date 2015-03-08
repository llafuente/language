module.exports = {
  read_modifier_as: read_modifier_as
};

function read_modifier_as() {
  debug(2, "read_modifier_as");
  var ast = ast_new("cast");

  if (!accept("as")) {
    return error("expected bitmask literal");
  }

  ast.var_type = read_type();

  if (is_error(ast.type)) {
    return ast.type;
  }

  return ast_end(ast);
}
