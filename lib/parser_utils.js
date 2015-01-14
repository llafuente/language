"use strict";

function inspect(val) {
  return require("util").inspect(val, {depth: null, colors: true});
}

module.exports = function(ranges) {
  var stack = [],
    state = {
      current: 0,
      ctt: null,
      ct: null,
      indent: "",
      look_ahead: 0
    },
    ret;

  function next(amount, skip_white_spaces) {
    amount = amount || 1;
    state.current += amount;

    if (state.current >= ranges.length) {
      state.ctt = state.ct = null;
      log("█ EOF");
      return false;
    }

    state.ct = ranges[state.current];
    state.ctt = state.ct.token;

    debug(3, "█ next", inspect(state.ctt));

    if (skip_white_spaces === true) {
      return skip_whitespaces();
    }
    return true;
  }

  function prev(skip_white_spaces) {
    if (state.current === 0) {
      return false;
    }


    do {
      state.current -= 1;

      state.ct = ranges[state.current];
      state.ctt = state.ct.token;
    } while (skip_white_spaces && is_whitespace())

    debug(3, "█ prev", inspect(state.ctt));

    return true;
  }

  function is_whitespace(text) {
    text = text || state.ctt;

    return /^(\s)*$/.test(text);
  }

  function skip_whitespaces() {
    var t;
    while (state.ctt !== null && is_whitespace()) {
      t = next(1);
    }

    return t;
  }

  function eat(skip_white_spaces) {
    var cp_ctt = state.ctt;
    debug(4, "█ eat", cp_ctt);

    next(1, skip_white_spaces);

    return cp_ctt;
  }

  function accept(str, skip_white_spaces) {
    if (skip_white_spaces === undefined) {
      skip_white_spaces = true;
    }

    if (Array.isArray(str)) {
      var i = 0,
      max = str.length;
      for (i = 0; i < max; ++i) {
        if (accept(str[i], skip_white_spaces)) {
          return true;
        }
      }
      return false;
    }

    if (str === state.ctt) {
      debug(3, "█ accept-ok", inspect(state.ctt), inspect(str));

      next(1, skip_white_spaces);
      return true;
    }

    debug(3, "█ accept-KO", inspect(str));
    return false;
  }

  /**
   * test current token against regexp or strings
   *
   * @param {RegExp|String} str
   */
  function test(str) {
    debug(3, "█ test", inspect(str), inspect(state.ctt));

    if (Object.prototype.toString.call(str) == "[object RegExp]") {
      return str.test(state.ctt);
    }
    if (Array.isArray(str)) {
      return str.some(test);
    }
    return state.ctt === str;
  }

  /**
  * test current token against a string
  * if test pass return ok, err otherwise
  */
  function expect(str, ok, err) {
    if (accept(str)) {
      debug(3, "█ expect-ok", str);
      return ok;
    }

    debug(3, "█ expect-KO", str);
    return error(err);
  }

  function read_eos() {
    skip_whitespaces();
    if (state.ctt == ";") {
      return true;
    }
    return false;
  }

  function is_eos() {
    var ret = state.ct === null || state.ctt == ";";

    debug(4, "█ is_eos", ret);

    return ret;
  }

  function is_eob() {
    var ret = state.ct === null || state.ctt == "}";

    debug(4, "█ is_eob", ret);

    return ret;
  }

  function is_eof() {
    return state.ct === null;
  }

  function start_look_ahead() {
    debug(3, '█ start_look_ahead @', inspect(state.ctt));
    var _state = {},
      idx;
    for (idx in state) {
      _state[idx] = state[idx];
    }

    stack.push(_state); // clone

    ++state.look_ahead;
    state.indent += "  ";
  }

  function commit_look_ahead() {
    stack.pop();
    --state.look_ahead;

    state.indent = state.indent.substring(0, state.indent.length - 2);

    debug(2, '█ commit_look_ahead @', inspect(JSON.stringify(state)));
  }

  function rollback_look_ahead() {
    var _state = stack.pop(),
      idx;

    for (idx in _state) {
      state[idx] = _state[idx];
    }

    debug(2, '█ rollback_look_ahead @', inspect(JSON.stringify(state)));
  }

  function error(message) {
    var err = new Error(message);
    err.parser = {
      position: state.current,
      line: state.ct.pos[0][0],
      column: state.ct.pos[0][1],
      token: state.ctt
    };

    return err;
  }

  function is_error(ast) {
    return ast && ast instanceof Error;
  }

  // basic constructions
  function read_binary_expression(name, operators, next) {
    log("▌read_binary_expression", name);

    var leafs = [],
      left,
      ast,
      err,
      first = true;

    do {
      verbose("read-binary-left");

      ast = ast_new("binary-expr");

      left = next();

      if (!left) {
        err = error("literal or expression expected");
        break;
      }

      first = false;

      verbose("read-binary-operator");

      var operator = state.ctt;

      if (!accept.call(null, operators)) {
        leafs.push(left);

        //err = error("binary operator expected: '" + operators.join("' or '") + "'");
        break;
      }


      ast.expression = true;
      ast.left = left;
      ast.operator = operator;
      ast.right = null;

      leafs.push(ast);
    } while (!is_puntuator());

    if (err && !leafs.length) {
      log("▌return err", name, err);
      return err;
    }

    var i = 0,
    max = leafs.length - 1;
    for (; i < max; ++i) {
      leafs[i].right = leafs[i + 1];
    }

    log("▌return", name, JSON.stringify(leafs[0]));

    return ast_end(leafs[0]);
  }

  function read_ternary_expression(name, st_below, st_operators, nd_below, nd_operators, rd_below) {
    log("read_ternary_expression");

    var leafs = [],
      left,
      middle,
      right,
      left_operator,
      right_operator,
      ast = ast_new("ternary-expr"),
      err;

    verbose("read-binary-lhs");

    left = one_of(st_below, "expected lhs", false);
    if (!left) {
      return error("literal or expression expected");
    }

    left_operator = state.ctt;

    if (!accept.call(null, st_operators)) {
      // exit with a full expression read
      if (left) {
        log("send up", name, JSON.stringify(left));
        return left;
      }

      return error(name + " first operator expected: " + enclose(operators, "'"));
    }

    middle = one_of(nd_below, "literal or expression expected", true);
    if (is_error(middle)) {
      return middle;
    }

    right_operator = state.ctt;

    if (!accept.call(null, nd_operators)) {
      return error(name + " second operator expected: " + enclose(operators, "'"));
    }

    right = one_of(nd_below, "literal or expression expected", true);
    if (is_error(right)) {
      return right;
    }


    ast.left = left;
    ast.middle = middle;
    ast.right = right;
    ast.left_operator = left_operator;
    ast.right_operator = right_operator;

    leafs.push(ast);

    return ast_end(ast);
  }

  // loop utils
  function one_of(list, err, transactional) {
    transactional = transactional || false;

    var i,
      max = list.length,
      ret;

    for (i = 0; i < max; ++i) {
      transactional && start_look_ahead();

      ret = list[i]();

      verbose(list[i].name, ret);

      if (is_ast(ret)) {
        transactional && commit_look_ahead();
        return ret;
      }
      transactional && rollback_look_ahead();
    }

    return error(err, true);
  }
  function read_many(list, err, transactional) {
    var ast_list = [],
      ast,
      err;
    do {
      ast = one_of(list, err, transactional);
      err = is_error(ast);
      if (!err) {
        ast_list.push(ast);
      }
    } while (!err);

    return !ast_list.length ? ast/*error*/ : ast_list;
  }

  function read_list(separators, end, callback, err_str) {
    if ("string" === typeof separators) {
      separators = [separators];
    }

    if ("string" === typeof end) {
      end = [end];
    }

    // empty list :)
    if (accept(end)) {
      return null;
    }

    var both = separators.concat(end);

    do {
      var err_or_cont = callback();

      if(is_error(err_or_cont)) {
        return err_or_cont;
      }
      
      if (err_or_cont === false) { // use default
        return error(err_str);
      }
    } while(!test(end) && accept(separators));

    if (!accept(end)) {
      return error("excepted: " + enclose(end, "'"));
    }
  }

  ret = {
    state: state,

    error: error,
    is_error: is_error,

    next: next,
    prev: prev,

    is_whitespace: is_whitespace,
    skip_whitespaces: skip_whitespaces,

    eat: eat,
    accept:accept,
    test: test,
    expect: expect,
    read_eos: read_eos,
    is_eos: is_eos,
    is_eob: is_eob,
    is_eof: is_eof,
    start_look_ahead: start_look_ahead,
    commit_look_ahead: commit_look_ahead,
    rollback_look_ahead: rollback_look_ahead,

    read_binary_expression: read_binary_expression,
    read_ternary_expression: read_ternary_expression,

    one_of: one_of,
    read_many: read_many,
    read_list: read_list
  };

  state.current = -1;

  return ret;
};
