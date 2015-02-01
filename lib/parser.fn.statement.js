module.exports = {
  read_function_declaration: read_function_declaration,
  read_parameters: read_parameters,
  read_function_body: read_function_body,
  read_return: read_return,

  parameter_operators: ["clone", "const"],
  parameter_default_operators: ["="],
  parameter_assertion_operators: ["!=", ">", "<", ">=", "<="],
};

function read_parameter_pass_style(parameter) {
  while(test(parameter_operators)) {
    parameter[eat(true)] = true;
  }
}

function read_parameter_default() {
  if (accept("=")) {
    // TODO this could contain a function call? neat!?
    return one_of([
      read_constant_literal,
      read_expression_conditional,
    ]);
  }
  return null;
}

function read_parameter_assertions() {
  var assertions = [];

  start_look_ahead();

  while(test(parameter_assertion_operators)) {
    var assert = ast_new("parameter-assertion");

    assert.operator = eat(true);

    lit = read_literal();
    if (is_error(lit)) {
      return lit;
    }
    assert.value = lit;
    assertions.push(ast_end(assert));
  }

  if (assertions.length) { // if read something back 1
    commit_look_ahead();
  } else {
    rollback_look_ahead();
  }

  return assertions.length ? assertions : null;
}

function read_parameter_with_type(param) {
  start_look_ahead();

  var type = read_type();
  if (is_error(type)) {
    rollback_look_ahead();
    return false;
  }

  var id = read_identifier_literal();
  if (is_error(id)) {
    rollback_look_ahead();
    return false;
  }

  commit_look_ahead();

  param.var_type = type;
  param.id = id;

  return true;
}

function read_parameter_without_type(param) {
  param.id = read_identifier_literal();
  return true;
}

function read_parameters() {
  log("read_parameters");
  var ast = ast_new("parameters");
  ast.list = [];

  var err = read_list(",", [":", "{", ")"], function() {
    var param = ast_new("parameter");
    param.clone = false;
    param.const = false;

    read_parameter_pass_style(param);

    if (!read_parameter_with_type(param)) {
      read_parameter_without_type(param);
      if (is_error(param.id)) {
        return param.id;
      }
    }

    // read default
    param.default = read_parameter_default();
    if (is_error(param.default)) {
      return param.default;
    }

    // read assertions
    param.assertions = read_parameter_assertions();

    ast.list.push(ast_end(param));
    return true;
  }, null, true);

  if (is_error(err)) {
    return err;
  }

  // read_list consume ":" and "{" tokens, so go back...
  prev(true);

  log("read_parameters - end!", err, ast);
  return ast_end(ast);
}

function read_function_body() {
  return read_block_statement();
}

function read_function_declaration() {
  log("read_function_declaration");

  var ast = ast_new("function-declaration");

  if (accept(["fn", "function"])) {
    var id;
    if (accept(",")) {
      id = null;
    } else if (test("{")) {
      id = null;
    } else if (test("(")) {
      id = null;
    } else {
      id = read_identifier_literal();

      if (is_error(id)) {
        return error("expected: function identifier");
      }

      if (test([",", "{"])) {
        // anonymous
        id = null;
        prev(true);
      }
    }

    var parameters = optional_parenthesis(read_parameters)();

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

function read_return() {
  var ast = ast_new("return-statement");
  if (accept("return")) {
    var expr = read_assignment_expression();
    if (is_error(expr)) {
      return expr;
    }

    ast.value = expr;
    ast.var_type = undefined;

    return ast_end(ast);
  }

  return error("expected: return statement");
}
