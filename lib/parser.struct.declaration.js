module.exports = {
    read_struct: read_struct
};

function read_struct() {
  var ast = ast_new("struct-declaration");

  if (accept("struct")) {
    ast.continous = false;
  } else if (accept("block")) {
    ast.continous = true;
  }

  if (ast.continous !== undefined) {
    var id = read_identifier_literal();
    if (is_error(id)) {
      return id;
    }

    if (!accept("{")) {
      return error("expected: '{'");
    }

    ast.body = [];

    var t,
      sub_ast,
      i = 0;

    do {
      ++i;
      sub_ast = one_of([
        read_var_declaration,
        read_function_declaration
      ], "expected: struct body statement", true);
      t = !is_error(sub_ast);


      if (t) {
        if (sub_ast.type == "var-declaration") {
          if (!accept(";")) {
            return error("expected: ';'")
          }
        }
        ast.body.push(sub_ast);
      }

    } while (t);


    if (!accept("}")) {
      return error("expected: '}'");
    }

    return ast_end(ast);
  }

  return error("expected struct literal");
}
