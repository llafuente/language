module.exports = {
    assignment_operators: ["=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="],
    conditional_operators: ["?", ":"],
    logical_or_operators: ["||"],
    logical_and_operators: ["&&"],
    bitwise_or_operators: ["|"],
    bitwise_xor_operators: ["^"],
    bitwise_and_operators: ["&"],
    equality_operators: ["==", "!="],
    relational_operators: ["<=", ">=", "<", ">"],
    shift_operators: ["<<", ">>>", ">>"],
    additive_operators: ["+", "-"],
    multiplicative_operators: ["*", "/", "%"],

    right_unary_operators: ["++", "--"],
    // TODO add: delete, typeof
    left_unary_operators: ["++", "--", "+", "-", "~", "!"],

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
    read_expression_unary: read_expression_unary,
    read_member_expression: read_member_expression,
    read_expression_unary_left: read_expression_unary_left,
    read_expression_unary_right: read_expression_unary_right,
    read_primary_expression: read_primary_expression
};

function read_expression() {
  if (test("{") || test("fn") || test("function")) {
    return null; // no lead
  }

  var first = true,
    ast;

  // TODO secuence list is really needed-even-used
  // is there a difference with semicolon?

  return read_assignment_expression();
}

function read_assignment_expression() {
  start_look_ahead();
  var ast = read_assignment_expression_full();

  if (ast && !(ast instanceof Error)) {
    commit_look_ahead();
    return ast;
  }
  rollback_look_ahead();

  // or

  var ast = read_expression_conditional();
  if (ast && !(ast instanceof Error)) {
    return ast;
  }

  return null;
}

function read_assignment_expression_full() {

  var left = read_expression_left_hand_side();

  var operator = state.ctt;

  if (!accept(assignment_operators)) {
    return error("expected assignament operator: " + enclose(assignment_operators, "'"));
  }

  var right = read_assignment_expression();

  var ast = ast_new("assignment-expr");
  ast.left = left;
  ast.right = right;
  ast.operator = operator;

  return ast;
}


function read_expression_conditional() {
  return read_ternary_expression(
    "conditional",
    [read_expression_logical_or],
    ["?"],
    [read_assignment_expression],
    [":"],
    [read_assignment_expression]
    );
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

function read_expression_left_hand_side() {
  /* TODO
  = CallExpression
  / NewExpression
  */
  return read_member_expression();
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

function read_member_expression() {
  // TODO fn expression
  // TODO new read_member_expression (arguments)
  var expr = read_primary_expression();

  var member = ast_new("member-expr");
  member.object = expr;

  if (test("[")) {
    start_look_ahead();
    var expr = read_expression();

    if (!accept("]")) {
      return error("expected: ']'");
    }
    member.property = expr;
  } else if (test(".")) {

  }

  return expr;
}

function read_expression_unary_left() {
  log("read_expression_unary_left");

  var operator = state.ctt;

  if (!accept(left_unary_operators)) {
    return error("expected unary operator: " + enclose(left_unary_operators, "'"), true);
  }

  // TODO: read_expression_unary
  var lit = read_literal();

  var ast = ast_new("left-unary-expr");
  ast.right = lit;
  ast.operator = operator;

  return ast;
}

// postfix expression
function read_expression_unary_right() {
  log("read_expression_unary_right");
  var lit = read_expression_left_hand_side();

  if (!lit) {
    return error("left hand side expression expected", true);
  }

  if (lit instanceof Error) {
    return lit;
  }

  var operator = state.ctt;

  if (!accept(right_unary_operators)) {
    return lit;
    // return error("expected unary operator: " + enclose(unary_operators, "'"), true);
  }


  var ast = ast_new("right-unary-expr");
  ast.left = lit;
  ast.operator = operator;

  return ast;
}

function read_primary_expression() {
  var lit = read_literal();
  if (!lit || lit instanceof Error) {
    if (test("(")) {
      start_look_ahead();
      eat(true);
      var exp = read_expression();
      return expect(")", exp, "expected: ')'")
    }

    return null;
  }
  return lit;
}
