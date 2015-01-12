module.exports = {
    ast_new: ast_new,
    is_ast: is_ast
};

function ast_new(type, start, end) {
  // build ranges start-end
  return {
    "type": type
  };
}

function is_ast(obj) {
  return obj && !is_error(obj);

}
