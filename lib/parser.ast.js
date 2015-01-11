module.exports = {
    ast_new: ast_new
};

function ast_new(type, start, end) {
  // build ranges start-end
  return {
    "type": type
  };
}
