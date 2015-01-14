module.exports = {
  read_var_declarator_inline_init: read_var_declarator_inline_init,
  read_var_declarator_initializer: read_var_declarator_initializer,
  read_var_declarator_literal_type: read_var_declarator_literal_type,
  read_var_declarator_literal: read_var_declarator_literal,
  read_var_declarator_list: read_var_declarator_list,
  read_var_declaration: read_var_declaration
};

function read_var_declarator_inline_init(declarator) {
  log("read_var_declarator_inline_init");

  skip_whitespaces();

  // var ui8 x(7)
  if (!accept("(")) {
    return error("expected '('");
  }
  // read_parameter_list();
  if (!accept(")")) {
    return error("expected '('");
  }
  //TODO
  declarator.init = "function call!";

  return declarator;
}

function read_var_declarator_initializer(declarator) {
  log("read_var_declarator_initializer");

  // var ui8 x = assignament-expression
  if (!accept("=")) {
    return false;
  }

  var expr = read_assignment_expression();
  if (!expr) {
    return error("assginament expression expected");
  }
  declarator.init = expr;

  return declarator;
}

function read_var_declarator_literal_type() {
  log("read_var_declarator_literal_type");

  // var type identifier
  var ast = ast_new("var-declarator");

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }
  ast.var_type = eat(true);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }

  ast.id = eat(true);

  if (test("[")) {
    start_look_ahead();
    eat(true);

    ast.size = read_assignment_expression();

    if (!ast.size || ast.size instanceof Error || !accept("]")) {
      ast.size = null;
      rollback_look_ahead();
    } else {
      commit_look_ahead();
    }
  }

  if (!ast.size) {
    ast.size = ast_new("number-literal", state.current, null);
    ast.size.value = 1;
    delete ast.size.range; // not applicable
  }

  return ast_end(ast);
}

function read_var_declarator_literal() {
  log("read_var_declarator_literal");

  // var x
  var ast = ast_new("var-declarator", state.current, null);

  if (!is_var_identifier()) {
    return error("variable idenfier expected");
  }
  ast.var_type = null;
  ast.id = state.ctt;

  next(1, true);

  return ast_end(ast);
}

function read_var_declarator_list() {
  log("read_var_declarator_list");

  var list = [],
  i,
  j,
  test_on_left = [
  read_var_declarator_literal_type,
  read_var_declarator_literal,
  ],
  tests_right = [
  read_var_declarator_initializer,
  read_var_declarator_inline_init,
  read_eos
  ];

  var err = read_list(",", ";", function() {
    var found = false;
    var declarator = one_of(test_on_left, "unexpected declarator left side", true);

    if (!is_error(declarator)) {
      start_look_ahead();

      log("declarator-left-side", declarator);

      if (test([",", ";"])) {
        found = true;
      } else {
        // check right side
        start_look_ahead();
        for (j = 0; j < tests_right.length && !found; ++j) {
          var t = tests_right[j](declarator);
          if (t && test([",", ";"])) {
            commit_look_ahead();
            found = true;
          } else {
            rollback_look_ahead();
          }
        }
      }
    }

    if (found) {
      list.push(declarator);
    }

    return found;
  }, "unexpected var-declarator");

  return list.length ? list : null;
}



function read_var_declaration () {
  log("read_var_declaration");

  var declaration = ast_new("var-declaration");
  declaration.keyword = state.ctt;

  if (!accept(["var", "const", "unvar"])) {
    return error("expected: var, const, unvar");
  }

  declaration.body = read_var_declarator_list();
  if (!declaration.body) {
    return error("invalid empty declaration");
  }

  ast_end(declaration);

  return declaration;

}
