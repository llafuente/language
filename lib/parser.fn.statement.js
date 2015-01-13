module.exports = {
  read_function_declaration: read_function_declaration,
  read_parameters: read_parameters,
  read_function_body: read_function_body
};

function read_parameters() {
  log("read_parameters");
  var ast = ast_new("parameters");
  ast.list = [];

  var err = read_list(",", [":", "{"], function() {
    var param = ast_new("parameter");
    param.id = read_literal();
    if (is_error(param.id)) {
      return false;
    }
    // TODO read type
    param.var_type = undefined;

    // TODO read default
    param.default = undefined;

    // TODO read assertions
    param.assertions = [];

    ast.list.push(ast_end(param));
    return true;
  }, "unexpected parameter", true);

  if (is_error(err)) {
    return err;
  }

  // read_list consume ":" and "{" tokens, so go back...
  prev(true);

  log("read_parameters - end!", err, ast);
  return ast_end(ast);
}

function read_function_body() {
  return read_block();
}

function read_function_declaration() {
  log("read_function_declaration");

  var ast = ast_new("function-declaration");

  if (accept(["fn", "function"])) {
    var id = read_identifier_literal();

    if (is_error(id)) {
      return error("expected: function identifier");
    }

    var parameters = read_parameters();

    if (is_error(id)) {
      return error("expected: function identifier");
    }

    var return_type = null;
    if (test(":")) {
      // return type!
      eat(true);

      return_type = read_identifier_literal();
      if (is_error(return_type)) {
        return error("expected: type");
      }
    }

    var body = read_function_body();
    if (is_error(body)) {
      return error("expected: function body");
    }

    ast.id = id;
    ast.parameters = parameters;
    ast.return_type = return_type;
    ast.body = body;

    return ast_end(ast);
  }

  return error("expected: function declaration");

}
