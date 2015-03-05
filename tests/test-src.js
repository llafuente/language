require("ass");

var tap = require("tap"),
test = tap.test,
tokenizer = require("../lib/tokenizer.js"),
parser = require("../lib/parser.js");

function inspect(obj) {
  console.log(
    require("util").inspect(obj, {depth:null, colors: true})
  );
}

function setup(code) {
  var tokens = tokenizer.parse(code, 0);
  tokens = tokenizer.rangenize (tokens);
  try {
    var ast = parser(tokens, 0);
  } catch(e) {
    return e;
  }

  return ast;
}
var target_path = __dirname + "/src/";
require("fs")
.readdirSync(target_path)
.forEach(function(file) {
  var file_text = require("fs").readFileSync(target_path + file, {encoding: 'utf-8'});
  var ast = setup(file_text);

  // TODO check against test/ast/<file>.json

  inspect(ast);
});
