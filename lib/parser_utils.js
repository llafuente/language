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

  function log() {
    if (ret.log_level < 1) return;

    var args = Array.prototype.slice.call(arguments);
    if (args.length == 1 && "object" === typeof args[0]) {
      args[0] = inspect(args[0]);
    }
    args.unshift(state.indent);

    console.log.apply(console, args);
  }

  function verbose() {
    if (ret.log_level < 2) return;

    var args = Array.prototype.slice.call(arguments);
    if (args.length == 1 && "object" === typeof args[0]) {
      args[0] = inspect(args[0]);
    }
    args.unshift(state.indent);

    console.log.apply(console, args);
  }

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

    verbose("█ next", inspect(state.ctt));

    if (skip_white_spaces === true) {
      return skip_whitespaces();
    }
    return true;
  }

  function skip_whitespaces() {
    var t;
    while (state.ctt !== null && /^(\s)*$/.test(state.ctt)) {
      t = next(1);
    }

    return t;
  }

  function eat(skip_white_spaces) {
    var cp_ctt = state.ctt;

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
      log("accept-ok", inspect(state.ctt), inspect(str));
      next(1, skip_white_spaces);
      return true;
    }

    verbose("accept-KO", inspect(str));
    return false;
  }

  /**
   * test current token against regexp or strings
   *
   * @param {RegExp|String} str
   */
  function test(str) {
    verbose("test", inspect(str), inspect(state.ctt));

    if (Object.prototype.toString.call(str) == "[object RegExp]") {
      return str.test(state.ctt);
    }
    return state.ctt === str;
  }

  /**
  * test current token against a string
  * if test pass return ok, err otherwise
  */
  function expect(str, ok, err) {
    if (accept(str)) {
      log("expect-ok", str);
      return ok;
    }

    verbose("expect-KO", str);
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
    verbose("is_eos", inspect(state.ctt));

    return state.ct === null || state.ctt == ";";
  }

  function is_eof() {
    return state.ct === null;
  }

  function start_look_ahead() {
    log('#> start_look_ahead @', inspect(state.ctt));
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

    log('#> commit_look_ahead @', inspect(JSON.stringify(state)));
  }

  function rollback_look_ahead() {
    var _state = stack.pop(),
      idx;

    for (idx in _state) {
      state[idx] = _state[idx];
    }

    log('#> rollback_look_ahead @', inspect(JSON.stringify(state)));
  }

  ret = {
    state: state,

    log: log,
    verbose: verbose,
    log_level: 1,

    next: next,
    skip_whitespaces: skip_whitespaces,
    eat: eat,
    accept:accept,
    test: test,
    expect: expect,
    read_eos: read_eos,
    is_eos: is_eos,
    is_eof: is_eof,
    start_look_ahead: start_look_ahead,
    commit_look_ahead: commit_look_ahead,
    rollback_look_ahead: rollback_look_ahead
  };

  state.current = -1;
  next(1, true);

  return ret;
};
