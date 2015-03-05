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

test("single-line comment", function (t) {
  var ast = setup("var a; // comment\nvar b;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body, [{
    "type" : "var-declaration", // != undefined
    "range" : [0,3], // != undefined
    "keyword" : "var", // != undefined
    "body" : [{
      "type" : "var-declarator", // != undefined
      "range" : [2,3], // != undefined
      "var_type" : null, // != undefined
      "id" : "a" // != undefined
    }] // != undefined
  },{
    "type" : "comment", // != undefined
    "range" : [5,7], // != undefined
    "multiline" : false, // != undefined
    "text" : " comment\n" // != undefined
  },{
    "type" : "var-declaration", // != undefined
    "range" : [7,10], // != undefined
    "keyword" : "var", // != undefined
    "body" : [{
      "type" : "var-declarator", // != undefined
      "range" : [9,10], // != undefined
      "var_type" : null, // != undefined
      "id" : "b" // != undefined
    }] // != undefined
  }]);

  t.end();
});


test("multi-line comment", function (t) {
  var ast = setup("/* \n*\n*\n*\n */ var x;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body, [{
    "type" : "comment", // != undefined
    "range" : [0,4], // != undefined
    "multiline" : true, // != undefined
    "text" : " \n*\n*\n*\n " // != undefined
  },{
    "type" : "var-declaration", // != undefined
    "range" : [4,7], // != undefined
    "keyword" : "var", // != undefined
    "body" : [{
      "type" : "var-declarator", // != undefined
      "range" : [6,7], // != undefined
      "var_type" : null, // != undefined
      "id" : "x" // != undefined
    }] // != undefined
  }]);

  t.end();
});

test("multi-line nested comment", function (t) {
  var ast = setup("/*\n /*\n */\n */ var x;");

  t.ok(!(ast instanceof Error), "no error");

  t.deepEqual(ast.body, [{
    "type" : "comment", // != undefined
    "range" : [0,4], // != undefined
    "multiline" : true, // != undefined
    "text" : "\n /*\n */\n " // != undefined
  },{
    "type" : "var-declaration", // != undefined
    "range" : [4,7], // != undefined
    "keyword" : "var", // != undefined
    "body" : [{
      "type" : "var-declarator", // != undefined
      "range" : [6,7], // != undefined
      "var_type" : null, // != undefined
      "id" : "x" // != undefined
    }] // != undefined
  }]);

  t.end();
});
