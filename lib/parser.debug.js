module.exports = {
    log: log,
    verbose: verbose,
    log_level: 1,
    inspect: inspect,
    enclose: enclose,
    debug: debug
};

function debug() {
  var args = Array.prototype.slice.call(arguments);
  var level = args[0];

  if (module.exports.log_level < level) return;

  if (args.length == 2 && "object" === typeof args[1]) {
    args[1] = inspect(args[1]);
  }
  args[0] = state.indent;

  console.log.apply(console, args);
}

function log() {
  if (module.exports.log_level < 1) return;

  var args = Array.prototype.slice.call(arguments);
  if (args.length == 1 && "object" === typeof args[0]) {
    args[0] = inspect(args[0]);
  }
  args.unshift(state.indent);

  console.log.apply(console, args);
}

function verbose() {
  if (module.exports.log_level < 2) return;

  var args = Array.prototype.slice.call(arguments);
  if (args.length == 1 && "object" === typeof args[0]) {
    args[0] = inspect(args[0]);
  }
  args.unshift(state.indent);

  console.log.apply(console, args);
}

function inspect(val) {
  return require("util").inspect(val, {depth: null, colors: true});
}

function enclose(arr, char) {
  return char + arr.join(char + " or " + char) + char;
}
