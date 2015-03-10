/*

missing operators:
div - mult -> int
array/set operators ?
* concatenation
* diff/Complement
* unique
* intersection (A ∩ B)
* union (A ∪ B)

*/

module.exports = {
    operators: [],
    // ">>>="
    assignment_operators: ["=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", "&=", "^=", "|="],
    conditional_operators: ["?", ":"],
    logical_or_operators: ["||"],
    logical_and_operators: ["&&"],
    bitwise_or_operators: ["|"],
    bitwise_xor_operators: ["^"],
    bitwise_and_operators: ["&"],
    equality_operators: ["==", "!="],
    relational_operators: ["<=", ">=", "<", ">"],
    // TODO >>> right unsigned shift i not needed, we have ui
    shift_operators: ["<<", ">>"],
    additive_operators: ["+", "-"],
    multiplicative_operators: ["*", "/", "%"],

    right_unary_operators: ["++", "--", "?"],
    // TODO add: typeof
    left_unary_operators: ["++", "--", "+", "-", "~", "!", "@", "delete", "clone"],

    read_expression: read_expression,
    read_assignment_expression: read_assignment_expression,
    read_assignment_expression_full: read_assignment_expression_full,
    read_expression_conditional: read_expression_conditional,
    read_expression_logical_or: read_expression_logical_or,
    read_expression_logical_and: read_expression_logical_and,
    read_expression_bitwise_or: read_expression_bitwise_or,
    read_expression_bitwise_xor: read_expression_bitwise_xor,
    read_expression_bitwise_and: read_expression_bitwise_and,
    read_expression_equality: read_expression_equality,
    read_expression_relational: read_expression_relational,
    read_expression_shift: read_expression_shift,
    read_expression_additive: read_expression_additive,
    read_expression_multiplicative: read_expression_multiplicative,
    read_expression_call: read_expression_call,
    read_expression_unary: read_expression_unary,
    read_member_expression: read_member_expression,
    read_expression_unary_left: read_expression_unary_left,
    read_expression_unary_right: read_expression_unary_right,
    read_primary_expression: read_primary_expression,

    is_expression: is_expression
};

module.exports.operators = module.exports.operators
  // ternary expr
  .concat(module.exports.conditional_operators)
  // assignaments
  .concat(module.exports.assignment_operators)
  // unary expr
  .concat(module.exports.right_unary_operators)
  .concat(module.exports.left_unary_operators)
  // binary expr
  .concat(module.exports.logical_or_operators)
  .concat(module.exports.logical_and_operators)
  .concat(module.exports.bitwise_or_operators)
  .concat(module.exports.bitwise_xor_operators)
  .concat(module.exports.bitwise_and_operators)
  .concat(module.exports.equality_operators)
  .concat(module.exports.relational_operators)
  .concat(module.exports.shift_operators)
  .concat(module.exports.additive_operators)
  .concat(module.exports.multiplicative_operators);

function read_expression() {
  if (test("{") || test("fn") || test("function")) {
    return null; // no lead
  }

  // TODO secuence list is really needed-even-used
  // is there a difference with semicolon?

  var ast = read_assignment_expression();

  return ast;
}

function read_assignment_expression() {
  return one_of([
    read_assignment_expression_full,
    read_expression_conditional
  ], "expected assignament expression", true);
}

function read_assignment_expression_full() {
  var ast = ast_new("assignment-expr");

  var left = read_expression_left_hand_side();
  if (is_error(left)) {
    return left;
  }

  var operator = state.ctt;

  if (!accept(assignment_operators)) {
    return error("expected assignament operator: " + enclose(assignment_operators, "'"));
  }

  var right = read_assignment_expression();

  if (is_error(right)) {
    return right;
  }


  ast.left = left;
  ast.right = right;
  ast.operator = operator;

  return ast_end(ast);
}


function read_expression_conditional() {
  var ast = read_ternary_expression(
    "conditional",
    [read_expression_logical_or],
    ["?"],
    [read_assignment_expression],
    [":"],
    [read_assignment_expression]
    );


  if (!is_error(ast)) {
    var as_ast = read_modifier_as();
    if (!is_error(as_ast)) {
      as_ast.body = [ast];
      return as_ast;
    }
  }
  return ast;
}


function read_expression_logical_or() {
  return read_binary_expression("logical_or", logical_or_operators, read_expression_logical_and);
}

function read_expression_logical_and() {
  return read_binary_expression("logical_and", logical_and_operators, read_expression_bitwise_or);
}

function read_expression_bitwise_or() {
  return read_binary_expression("bitwise_or", bitwise_or_operators, read_expression_bitwise_xor);
}

function read_expression_bitwise_xor() {
  return read_binary_expression("bitwise_xor", bitwise_xor_operators, read_expression_bitwise_and);
}

function read_expression_bitwise_and() {
  return read_binary_expression("bitwise_and", bitwise_and_operators, read_expression_equality);
}

function read_expression_equality() {
  return read_binary_expression("equality", equality_operators, read_expression_relational);
}

function read_expression_relational() {
  return read_binary_expression("expression", relational_operators, read_expression_shift);
}

function read_expression_shift() {
  return read_binary_expression("shift", shift_operators, read_expression_additive);
}


function read_expression_additive() {
  return read_binary_expression("additive", additive_operators, read_expression_multiplicative);
}

function read_expression_multiplicative() {
  return read_binary_expression("multiplicative", multiplicative_operators, read_expression_unary);
}

// TODO build a tree instead of list?
function read_expression_call() {
  debug(2, "read_expression_call", inspect(state.ctt));
  var ast = ast_new("call-expr");

  ast.callee = read_member_expression();

  if (is_error(ast.callee)) {
    return ast.callee;
  }

  if (!test("(")) {
    return ast.callee; // return just the member expression, there is no call
  }

  ast.arguments = read_many([
    read_arguments,
    read_property_access,
    read_index_access
  ], "unpexpected", true);

  if (is_error(ast.arguments)) {
    return ast.arguments;
  }

  return ast_end(ast);
}

function read_expression_new() {
  var ast = ast_new("new-expr");

  if (accept("new")) {
    var callee = one_of([
      read_member_expression,
      read_expression_new,
    ], "expected: new expression", true);

    if (is_error(callee)) {
      return callee;
    }

    ast.callee = callee;
    ast.arguments = [];

    return ast_end(ast);
  }
  return error("not-implemented");
}

function read_expression_left_hand_side() {
  return one_of([
    read_expression_call,
    read_expression_new
    ]);
}

function read_expression_unary() {
  return one_of([
    read_expression_unary_right,
    read_expression_unary_left,
    read_expression_left_hand_side],
    "expected: unary expression",
    true
  );
}

function read_property_access() {
  if (accept(".")) {
    var lit = one_of([
      read_string_literal,
      read_numeric_literal,
      read_identifier_literal
    ], "invalid property", true);

    if (is_error(lit)) {
      return lit;
    }

    // var-literal need to be rewrited to string-literal
    if (lit.type === "var-literal") {
      lit.type = "string-literal";
    }

    return lit;
  }

  return error("expected: property access");
}

function read_index_access() {
  if (accept("[")) {
    var expr = read_expression();

    if (!accept("]")) {
      return error("expected: ']'");
    }
    return expr;
  }

  return error("expected: index access");
}

function read_slice_access() {
  var ast = ast_new("slice-access"),
  start,
  end;

  if (accept("[")) {
    if (accept(":")) {
      start = ast_new("number-literal");
      start.value = 0;
      ast_end(start);

      end = read_expression();
      if (is_error(end)) {
        return end;
      }

    } else {
      start = read_expression();
      if (is_error(start)) {
        return start;
      }

      if (!accept(":")) {
        return error("expected: ':'");
      }
      if (test("]")) {
        end = ast_new("number-literal");
        end.value = -1;
        ast_end(end);
      } else {
        end = read_expression();
        if (is_error(end)) {
          return end;
        }
      }
    }

    if (!accept("]")) {
      return error("expected: ']'");
    }
    ast.start = start;
    ast.end = end;

    return ast_end(ast);
  }

  return error("expected: slice access");
}

function read_expression_new_with_arguments() {
  var ast = ast_new("new-expr");

  if (accept("new")) {
    ast.callee = read_member_expression();
    if (is_error(ast.callee)) {
      return error("expected member expression");
    }
    ast.arguments = read_arguments();
    if (is_error(ast.arguments)) {
      return error("expected member arguments");
    }

    return ast_end(ast);
  }
  return error("expected new expression with arguments");
}

function read_expression_function() {
  var fn = read_function_declaration();

  return fn;
}

function read_expression_parenthesis() {
  var ast = ast_new("group-expr");
  if (accept("(")) {
    var expr = read_assignment_expression();

    if (is_error(expr) || accept(")")) {
      ast.body = expr;
      return ast_end(ast);
    }
    return error("expected: ')'");
  }

  return error("expected: '('");
}

function read_member_expression() {
  debug(2, "read_member_expression", inspect(state.ctt));
  var ast = ast_new("member-expr");

  // TODO new read_member_expression (arguments)
  var expr = one_of([
    read_primary_expression,
    read_expression_function,
    read_expression_new_with_arguments,
    read_expression_parenthesis
  ], "exprected: primary expression, function expression or new expression with arguments", true);

  ast.object = expr;

  var properties = read_many([
    read_property_access,
    read_index_access,
    read_slice_access
  ], "err", true);

  if (!is_error(properties)) {
    ast.properties = properties;
  } else {
    return expr;
  }

  return ast_end(ast);
}

function read_expression_unary_left() {
  var ast = ast_new("left-unary-expr");

  var operator = state.ctt;

  if (!accept(left_unary_operators)) {
    return error("expected unary operator: " + enclose(left_unary_operators, "'"));
  }

  var lit = read_expression_unary();

  ast.right = lit;
  ast.operator = operator;

  return ast_end(ast);
}

// postfix expression
function read_expression_unary_right() {
  var ast = ast_new("right-unary-expr");

  var lit = read_expression_left_hand_side();

  if (!lit) {
    return error("left hand side expression expected");
  }

  if (lit instanceof Error) {
    return lit;
  }

  var operator = state.ctt;

  if (!accept(right_unary_operators)) {
    return lit;
    // return error("expected unary operator: " + enclose(unary_operators, "'"));
  }


  ast.left = lit;
  ast.operator = operator;

  return ast_end(ast);
}

function read_primary_expression() {
  var lit = read_literal();
  if (is_error(lit)) {
    if (test("(")) {
      eat(true);
      var exp = read_expression();

      return expect(")", exp, "expected: ')'");
    }

    return error("expected primary expression");
  }

  return lit;
}

function is_expression(ast) {
  return [
    "assignment-expr",
    "call-expr",
    "new-expr",
    "member-expr",
    "left-unary-expr",
    "right-unary-expr",
    "binary-expr",
    "ternary-expr",
    //literals are expression!
    "null-literal",
    "bool-literal",
    "string-literal",
    "array-literal",
    "object-literal",
    "number-literal",
    "var-literal",
  ].indexOf(ast.type) !== -1;

}
