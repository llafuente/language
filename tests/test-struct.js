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
  var ast = setup("struct test {\n var a1 = 0;\nfn sum a {\na1 += a;\n}\n}\n");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "struct-declaration",
    "range" : [0,33],
    "continous" : false,
    "body" : [{
      "type" : "var-declaration",
      "range" : [6,13],
      "keyword" : "var",
      "body" : [{
        "type" : "var-declarator",
        "range" : [8,10],
        "var_type" : null,
        "id" : "a1",
        "init" : {
          "type" : "number-literal",
          "range" : [12,13],
          "value" : 0
        }
      }]
    },{
      "type" : "function-declaration",
      "range" : [15,32],
      "id" : {
        "type" : "var-literal",
        "range" : [17,19],
        "value" : "sum"
      },
      "parameters" : {
        "type" : "parameters",
        "range" : [19,21],
        "list" : [{
          "type" : "parameter",
          "range" : [19,21],
          "clone" : false,
          "const" : false,
          "id" : {
            "type" : "var-literal",
            "range" : [19,21],
            "value" : "a"
          },
          "default" : null,
          "assertions" : null
        }]
      },
      "return_type" : null,
      "body" : {
        "type" : "block",
        "range" : [21,32],
        "body" : [{
          "type" : "assignment-expr",
          "range" : [23,28],
          "left" : {
            "type" : "var-literal",
            "range" : [23,25],
            "value" : "a1"
          },
          "right" : {
            "type" : "var-literal",
            "range" : [27,28],
            "value" : "a"
          },
          "operator" : "+="
        }]
      }
    }]

  });

  t.end();
});
