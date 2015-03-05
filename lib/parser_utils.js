"use strict";

function inspect(val) {
  return require("util").inspect(val, {depth: null, colors: true});
}

module.exports = function(ranges) {
  var stack = [],
    state = {
      current: 0,
      ctt: null,
      prev_ctt: null,
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
    state.prev_ctt = state.ctt;
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
      state.prev_ctt = state.current > 0 ? ranges[state.current - 1].token : null;
      state.ctt = state.ct.token;

    } while (skip_white_spaces && is_whitespace());

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
        if ("function" === typeof str[i]) {
          //nasty hack that works :S
          if (str[i]()) {
            return true;
          }
        }
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

    debug(3, "█ accept-KO", inspect(state.ctt), inspect(str));
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

  // end of statement is ; or new-line
  function read_eos() {
    if (is_eof() || accept(";")) {
      return true;
    }

    return state.prev_ctt != null && state.prev_ctt.indexOf("\n") !== -1;
  }

  function is_eos() {
    var ret = state.ct === null || state.ctt == ";"
    || (state.prev_ctt != null && state.prev_ctt.indexOf("\n") !== -1);

    // or new-line

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

  function error(message, __final) {
    var ct = is_eof() ? ranges[ranges.length - 1] : state.ct;

    var err = new Error(message);
    err.parser = {
      position: state.current || ranges.length - 1,
      line: ct.pos[0][0],
      column: ct.pos[0][1],
      token: state.ctt
    };

    if (__final) {
      throw err;
    }

    return err;
  }

  function is_error(ast) {
    return ast && ast instanceof Error;
  }

  // basic constructions
  function read_binary_expression(name, operators, next) {
    debug(5, "▌read_binary_expression", name);

    var leafs = [],
      left,
      ast,
      err,
      first = true;

    do {
      debug(6, "read-binary-left");

      ast = ast_new("binary-expr");

      left = next();

      if (is_error(left)) {
        err = left;
        break;
      }

      if (!left) {
        err = error("literal or expression expected");
        break;
      }

      first = false;

      debug(6, "read-binary-operator");

      var operator = state.ctt;

      if (!accept.call(null, operators)) {
        if (is_error(left)) {
          err = left;
          break;
        }

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
      debug(3, "▌return err", name, err);
      return err;
    }

    var i = 0,
    max = leafs.length - 1;
    for (; i < max; ++i) {
      leafs[i].right = leafs[i + 1];
    }

    debug(5, "▌return", name, JSON.stringify(leafs[0]));

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

  /*
  * provided a list of function, will test one by one
  * until the first return a non-eror
  */
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

    return error(err);
  }

  function read_many(list, err_str, transactional) {
    var ast_list = [],
      ast,
      t;
    do {
      ast = one_of(list, err_str, transactional);
      t = !is_error(ast);
      if (t) {
        ast_list.push(ast);
      }
    } while (t);

    return !ast_list.length ? ast/*error*/ : ast_list;
  }

  function read_sequence() {
    var list = [],
      sub_list,
      i,
      t = true;

    do {
      start_look_ahead();
      sub_list = [];
      for (i = 0; i < arguments.length; ++i) {

        var x = arguments[i]();
        if (is_error(x)) {
          t = false;
        } else if (x !== null) {
          sub_list.push(x);
        }
      }
      if (t) {
        commit_look_ahead();
        list = list.concat(sub_list);
      } else {
        rollback_look_ahead();
      }
    } while(t);

    return list;
  }

  function read_list(separators, end, callback, err_str) {
    var sep_fn;

    if ("string" === typeof separators || Array.isArray(separators)) {
      sep_fn = function () {
        return accept(separators);
      };
    } else if ("function" === typeof separators) {
      sep_fn = separators;
    }

    var end_fn;

    if ("string" === typeof end || Array.isArray(end)) {
      end_fn = function () {
        return accept(end);
      };
    } else if ("function" === typeof end) {
      end_fn = end;
    }

    // empty list :)
    if (end_fn()) {
      return null;
    }

    var both = separators.concat(end);

    do {
      var err_or_cont = callback();

      if(is_error(err_or_cont)) {
        return err_or_cont;
      }

      // stop if false -> return default error
      if (err_or_cont === false) {
        return err_str ? error(err_str) : null;
      }
    } while(!end_fn() && sep_fn());
  }

  function optional_parenthesis(callback) {
    return function () {
      start_look_ahead();

      var required = false;
      if (accept("(")) {
        required = true;
      }

      var ast = callback();
      if (is_error(ast)) {
        rollback_look_ahead();
        return ast;
      }

      if (required && !accept(")")) {
        rollback_look_ahead();
        return error("expected: ')'");
      }
      commit_look_ahead();
      return ast;
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
    read_sequence: read_sequence,
    read_list: read_list,
    optional_parenthesis: optional_parenthesis
  };

  state.current = -1;

  return ret;
};
