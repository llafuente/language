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
    indent: ""
  },
  ct = null,
  ctt = null,
  look_ahead;

  state.current = -1;
  next(1, true);

  function log() {
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
      state.ctt = state.ct = ct = ctt = null;
      log(">>> EOF");
      return false;
    }

    state.ct = ct = ranges[state.current];
    state.ctt = ctt = ct.token;

    log("** next", inspect(ctt));


    if (skip_white_spaces === true) {
      return skip_whitespaces();
    }
    return true;
  }

  function skip_whitespaces() {
    var t;
    while (ctt !== null && /^(\s)*$/.test(ctt)) {
      t = next(1);
    }

    return t;
  }

  function eat(str, skip_white_spaces) {
    var cp_ctt = ctt;

    next(1, skip_white_spaces);

    return cp_ctt;
  }

  function accept(str, skip_white_spaces) {
    if (skip_white_spaces === undefined) {
      skip_white_spaces = true;
    }

    if (arguments.length > 1) {
      var i = 0,
      max = arguments.length;
      for (i = 0; i < max; ++i) {
        if (accept(arguments[i], skip_white_spaces)) {
          return true;
        }
      }
      return false;
    }

    if (str === ctt) {
      log("accept-ok", inspect(str));
      next(1, skip_white_spaces);
      return true;
    }
    log("accept-KO", inspect(str));
    return false;
  }

  function test(str) {
    log("-test", inspect(str), inspect(ctt));
    return ctt === str;
  }

  function expect(str, ok, err) {
    log("-expect", str);

    if (accept(str)) {
      log("expect-ok", str);
      return ok;
    }
    log("expect-KO", str);
    return error(err);
  }

  function read_eos() {
    skip_whitespaces();
    if (ctt == ";") {
      return true;
    }
    return false;
  }

  function is_eos() {
    log("is_eos", inspect(ctt));

    return ct === null || ctt == ";";
  }

  function is_eof() {
    return ct === null;
  }

  function start_look_ahead() {
    log('> start_look_ahead @', inspect(ctt));
    stack.push({current: state.current}); // clone
    ++look_ahead;
    state.indent += "  ";
  }

  function commit_look_ahead() {
    stack.pop();
    --look_ahead;

    state.indent = state.indent.substring(0, state.indent.length - 2);

    log('< commit_look_ahead @', inspect(ctt));
  }

  function rollback_look_ahead() {
    state = stack.pop();

    ct = ranges[state.current];
    ctt = ct.token;
    --look_ahead;

    state.indent = state.indent.substring(0, state.indent.length - 2);

    log('< rollback_look_ahead @', inspect(ctt));
  }

  return {
    state: state,
    log: log,
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
};
