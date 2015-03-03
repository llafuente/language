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

test("i8", function (t) {

  var ast = setup("var i8 name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,5],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,5],
      "var_type" : {
        "type" : "i8",
        "range" : [2,4],
        "sub_type" : null,
        "dimensions" : null
      },
      "id" : "name"
    }]
  });

  t.end();
});


test("i8[]", function (t) {

  var ast = setup("var i8[] name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,7],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,7],
      "var_type" : {
        "type" : "array",
        "range" : [3,6],
        "sub_type" : {
          "type" : "i8",
          "range" : [2,3],
          "sub_type" : null,
          "dimensions" : null
        },
        "dimensions" : [{
          "type" : "number-literal",
          "value" : 0
        }]
      },
      "id" : "name"
    }]

  });

  t.end();
});


test("ptr<f32[]>", function (t) {

  var ast = setup("var ptr<f32[]> name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,10],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,10],
      "var_type" : {
        "type" : "ptr",
        "range" : [2,9],
        "sub_type" : {
          "type" : "array",
          "range" : [5,7],
          "sub_type" : {
            "type" : "f32",
            "range" : [4,5],
            "sub_type" : null,
            "dimensions" : null
          },
          "dimensions" : [{
            "type" : "number-literal",
            "value" : 0
          }]
        },
        "dimensions" : null
      },
      "id" : "name"
    }]

  });

  t.end();
});


test("object", function (t) {

  var ast = setup("var {} name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,6],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,6],
      "var_type" : {
        "type" : "object",
        "range" : [2,5],
        "sub_type" : null,
        "dimensions" : null
      },
      "id" : "name"
    }]
  });

  t.end();
});


test("ptr<f32[]>", function (t) {

  var ast = setup("var ptr<f32[]> name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,10],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,10],
      "var_type" : {
        "type" : "ptr",
        "range" : [2,9],
        "sub_type" : {
          "type" : "array",
          "range" : [5,7],
          "sub_type" : {
            "type" : "f32",
            "range" : [4,5],
            "sub_type" : null,
            "dimensions" : null
          },
          "dimensions" : [{
            "type" : "number-literal",
            "value" : 0
          }]
        },
        "dimensions" : null
      },
      "id" : "name"
    }]

  });

  t.end();
});

/*
test("pointer", function (t) {

  var ast = setup("var ui8* name;");

  t.ok(!(ast instanceof Error), "no error");

  console.log(ast);

  t.deepEqual(ast.body[0], {});

  t.end();
});
*/

test("ui8[1][2][]", function (t) {

  var ast = setup("var ui8[1][2][] name;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body[0], {
    "type" : "var-declaration",
    "range" : [0,13],
    "keyword" : "var",
    "body" : [{
      "type" : "var-declarator",
      "range" : [2,13],
      "var_type" : {
        "type" : "array",
        "range" : [3,12],
        "sub_type" : {
          "type" : "ui8",
          "range" : [2,3],
          "sub_type" : null,
          "dimensions" : null
        },
        "dimensions" : [{
          "type" : "number-literal",
          "range" : [4,5],
          "value" : 1
        },{
          "type" : "number-literal",
          "range" : [7,8],
          "value" : 2
        },{
          "type" : "number-literal",
          "value" : 0
        }]
      },
      "id" : "name"
    }]

  });

  t.end();
});
