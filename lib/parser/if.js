module.exports = {
  read_if: read_if
};

function read_if() {
  var ast = ast_new("if-statement");

  if (!accept("if")) {
    return error("expected if literal");
  }

  var test_expr = read_expression();
  if (is_error(test_expr)) {
    return test_expr;
  }

  ast.test = test_expr;

  if (!accept("{")) {
    return error("expected: '{'");
  }

  read_source_elements(ast, true);

  if (is_error(ast.body)) {
    return ast.body;
  }
  if (!accept("}")) {
    return error("expected: '}'");
  }

  if (accept("else")) {
    if (test("if")) {
      ast.else = read_if();
    } else {
      ast.else = read_block_statement();
    }
  }

  return ast_end(ast);
}
