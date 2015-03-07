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
  var ast = setup("fn , a {}\n");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "function-declaration",
    "range" : [0,8],
    "id" : null,
    "parameters" : {
      "type" : "parameters",
      "range" : [4,6],
      "list" : [{
        "type" : "parameter",
        "range" : [4,6],
        "clone" : false,
        "const" : false,
        "id" : {
          "type" : "var-literal",
          "range" : [4,6],
          "value" : "a"
        },
        "default" : null,
        "assertions" : null
      }]
    },
    "return_type" : null,
    "body" : {
      "type" : "block",
      "range" : [6,8],
      "body" : null
    }

  });

  t.end();
});

test("anonymous function no parameters", function (t) {
  var ast = setup("fn {}");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "function-declaration",
    "range" : [0,4],
    "id" : null,
    "parameters" : {
      "type" : "parameters",
      "range" : [2,2],
      "list" : []
    },
    "return_type" : null,
    "body" : {
      "type" : "block",
      "range" : [2,4],
      "body" : null
    }

  });

  t.end();
});

test("anonymous function + parenthesis parameters", function (t) {
  var ast = setup("fn (a) {}");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "function-declaration",
    "range" : [0,8],
    "id" : null,
    "parameters" : {
      "type" : "parameters",
      "range" : [3,4],
      "list" : [{
        "type" : "parameter",
        "range" : [3,4],
        "clone" : false,
        "const" : false,
        "id" : {
          "type" : "var-literal",
          "range" : [3,4],
          "value" : "a"
        },
        "default" : null,
        "assertions" : null
      }]
    },
    "return_type" : null,
    "body" : {
      "type" : "block",
      "range" : [6,8],
      "body" : null
    }

  });

  t.end();
});



test("named function no parameters", function (t) {

  var ast = setup("fn fn_name {}");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "function-declaration",
    "range" : [0,6],
    "id" : {
      "type" : "var-literal",
      "range" : [2,4],
      "value" : "fn_name"
    },
    "parameters" : {
      "type" : "parameters",
      "range" : [4,4],
      "list" : []
    },
    "return_type" : null,
    "body" : {
      "type" : "block",
      "range" : [4,6],
      "body" : null
    }

  });

  t.end();
});


test("named function with complex parameters", function (t) {

  var ast = setup("fn fn_name const clone ui8 a, clone ui8{} b, const f32[5][] c {}");
console.log(ast);
console.log(ast.stack);
  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "function-declaration",
    "range" : [0,35],
    "id" : {
      "type" : "var-literal",
      "range" : [2,4],
      "value" : "fn_name"
    },
    "parameters" : {
      "type" : "parameters",
      "range" : [4,33],
      "list" : [{
        "type" : "parameter",
        "range" : [4,11],
        "clone" : true,
        "const" : true,
        "var_type" : {
          "type" : "ui8",
          "range" : [8,10],
          "sub_type" : null,
          "dimensions" : null
        },
        "id" : {
          "type" : "var-literal",
          "range" : [10,11],
          "value" : "a"
        },
        "default" : null,
        "assertions" : null
      },{
        "type" : "parameter",
        "range" : [13,20],
        "clone" : true,
        "const" : false,
        "var_type" : {
          "type" : "object",
          "range" : [15,19],
          "sub_type" : null,
          "dimensions" : null
        },
        "id" : {
          "type" : "var-literal",
          "range" : [19,20],
          "value" : "b"
        },
        "default" : null,
        "assertions" : null
      },{
        "type" : "parameter",
        "range" : [22,33],
        "clone" : false,
        "const" : true,
        "var_type" : {
          "type" : "array",
          "range" : [25,31],
          "sub_type" : {
            "type" : "f32",
            "range" : [24,25],
            "sub_type" : null,
            "dimensions" : null
          },
          "dimensions" : [{
            "type" : "number-literal",
            "range" : [26,27],
            "value" : 5
          },{
            "type" : "number-literal",
            "value" : 0
          }]
        },
        "id" : {
          "type" : "var-literal",
          "range" : [31,33],
          "value" : "c"
        },
        "default" : null,
        "assertions" : null
      }]
    },
    "return_type" : null,
    "body" : {
      "type" : "block",
      "range" : [33,35],
      "body" : null
    }

  });

  t.end();
});



test("default paramaters", function (t) {
  var ast = setup("fn sum a, b = 0 {}\n");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0].parameters.list,       [{
    "type" : "parameter",
    "range" : [4,5],
    "clone" : false,
    "const" : false,
    "id" : {
      "type" : "var-literal",
      "range" : [4,5],
      "value" : "a"
    },
    "default" : null,
    "assertions" : null
  },{
    "type" : "parameter",
    "range" : [7,13],
    "clone" : false,
    "const" : false,
    "id" : {
      "type" : "var-literal",
      "range" : [7,9],
      "value" : "b"
    },
    "default" : {
      "type" : "number-literal",
      "range" : [11,13],
      "value" : 0
    },
    "assertions" : null
  }]);

  t.end();
});


test("hardcore parameters (call-expr, asserts, member-expr, default)", function (t) {
  var ast = setup([
    "fn test",
//    "struct a,",
//    "b = a.length != 0 != null,",
    "c = supercall()",
    "{}",
].join("\n"));

console.log(ast);

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0].parameters.list,[
        {
          "type" : "parameter",
          "range" : [4,12],
          "clone" : false,
          "const" : false,
          "id" : {
            "type" : "var-literal",
            "range" : [4,6],
            "value" : "c"
          },
          "default" : {
            "type" : "call-expr",
            "range" : [8,12],
            "callee" : {
              "type" : "var-literal",
              "range" : [8,9],
              "value" : "supercall"
            },
            "arguments" : [{
                "type" : "arguments-seq",
                "range" : [9,12],
                "items" : []
              }]
          },
          "assertions" : null
        }
  ]);

  t.end();
});
