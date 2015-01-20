module.exports = {
    read_while: read_while
};


function read_while() {
    var ast = ast_new("loop-statement");
    if (accept("while")) {
        var expr = read_expression();

        if (is_error(expr)) {
            return expr;
        }

        ast.test = expr;
        ast.body = read_block_statement();

        if (is_error(ast.body)) {
            return ast.body;
        }

        return ast_end(ast);
    }
    return error("expected: while statement");
}
