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

test("anonymous function + comma parameters", function (t) {
  var ast = setup("test-call(a, \"string-lit\", 100);\n");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "binary-expr",
    "range" : [0,14],
    "expression" : true,
    "left" : {
      "type" : "var-literal",
      "range" : [0,1],
      "value" : "test"
    },
    "operator" : "-",
    "right" : {
      "type" : "call-expr",
      "range" : [2,14],
      "callee" : {
        "type" : "var-literal",
        "range" : [2,3],
        "value" : "call"
      },
      "arguments" : [{
        "type" : "arguments-seq",
        "range" : [3,14],
        "items" : [{
          "type" : "argument",
          "range" : [4,5],
          "parameter" : null,
          "value" : {
            "type" : "var-literal",
            "range" : [4,5],
            "value" : "a"
          }
        },{
          "type" : "argument",
          "range" : [7,10],
          "parameter" : null,
          "value" : {
            "type" : "string-literal",
            "range" : [7,10],
            "value" : "string-lit"
          }
        },{
          "type" : "argument",
          "range" : [12,13],
          "parameter" : null,
          "value" : {
            "type" : "number-literal",
            "range" : [12,13],
            "value" : 100
          }
        }]
      }]
    }

  });

  t.end();
});
