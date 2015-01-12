module.exports = {
    ast_new: ast_new,
    ast_end: ast_end,
    is_ast: is_ast
};

function ast_new(type) {
  // build ranges start-end
  return {
    "type": type,
    range: [state.current, NaN]
  };
}

function ast_end(ast) {
  ast.range[1] = state.current;

  return ast;
}

function is_ast(obj) {
  return obj && !is_error(obj);

}
