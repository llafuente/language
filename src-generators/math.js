//
// this file generate some boilerplate IR code from c code
// like truncate, so the language just call functions that are "alwaysinline"
// this will easy things
//

// http://llvm.org/docs/LangRef.html#icmp-instruction

//
// _ession operators
//
var operators = [
  {operator: "+", type: "binary", function: "__sum__"},
  {operator: "-", type: "binary", function: "__sub__"},
  {operator: "*", type: "binary", function: "__mult__"},
  {operator: "/", type: "binary", function: "__div__"},
  {operator: "%", type: "binary", function: "__mod__", remove: ["f32", "f64"]},

  {operator: "^", type: "binary", function: "__bitwise_xor__", remove: ["f32", "f64"]},
  {operator: "|", type: "binary", function: "__bitwise_or__", remove: ["f32", "f64"]},
  {operator: "&", type: "binary", function: "__bitwise_and__", remove: ["f32", "f64"]},

  {operator: "<<", type: "binary", function: "__shift_left__", remove: ["f32", "f64"]},
  {operator: ">>", type: "binary", function: "__shift_right__", remove: ["f32", "f64"]},

  {operator: "--", type: "right", function: "__post_decr__"},
  {operator: "++", type: "right", function: "__post_incr__"},

  {operator: "--", type: "left", function: "__pre_decr__"},
  {operator: "++", type: "left", function: "__pre_incr__"},
  {operator: "-", type: "left", function: "__negate__"},
  {operator: "~", type: "left", function: "__bitwise_not__", remove: ["f32", "f64"]},
  {operator: "!", type: "left", function: "__logical_not__"},
];

//
// types c vs lang
//
var types = [
  {c: "float_t", lang: "f32", bytes: 4, signed: true, floating: true},
  {c: "double_t", lang: "f64", bytes: 8, signed: true, floating: true}
];

[8, 16, 32, 64].forEach(function(v) {
  types.push({c: "int" + v + "_t", lang: "i" + v, bytes: v / 8, signed: true, floating: false});
  types.push({c: "uint" + v + "_t", lang: "ui" + v, bytes: v / 8, signed: false, floating: false});
});


var c_functions = [];
var declared = [];

types.forEach(function(type) {
  operators.forEach(function(op) {
    if (!op.remove || op.remove.indexOf(type.lang) === -1) {
      switch(op.type) {
      case "binary":
        var fn_name = [op.function, type.lang, type.lang].join("_");

        declared.push({
          type: "function",
          id: op.function,
          ir_uid: fn_name,
          input: [type.lang, type.lang],
          output: [type.lang]
        });

        c_functions.push(
          type.c + " " + fn_name + "(" + type.c + " a, " + type.c + " b) {\n" +
          "  return a " + op.operator + " b;\n" +
          "}"
        );
        break;
      case "left":
        var fn_name = [op.function, type.lang].join("_");

        declared.push({
          type: "function",
          id: op.function,
          ir_uid: fn_name,
          input: [type.lang],
          output: [type.lang]
        });

        c_functions.push(
          type.c + " " + fn_name + "(" + type.c + " a) {\n" +
          "  return " + op.operator + "a;\n" +
          "}"
        );
        break;
      case "right":
        var fn_name = [op.function, type.lang].join("_");

        declared.push({
          type: "function",
          id: op.function,
          ir_uid: fn_name,
          input: [type.lang],
          output: [type.lang]
        });

        c_functions.push(
          type.c + " " + fn_name + "(" + type.c + " a) {\n" +
          "  return a" + op.operator + ";\n" +
          "}"
        );
        break;
      }
    }
  });
});
// functions
[
  // Trigonometric functions
  "cos", "sin", "tan", "acos", "asin", "atan", "atan2",
  // Hyperbolic functions
  "cosh", "sinh", "tanh", "acosh", "asinh", "atanh",

  "exp", "frexp", "ldexp", "log", "log10", "modf", "exp2", "expm1", "ilogb", "log1p", "log2", "logb", "scalbn", "scalbln"

];

//
// truncate/cast
//

types.forEach(function(atype) {
  types.forEach(function(btype) {
    if (atype.lang == btype.lang) return;

    var fn_name = ["__cast__", atype.lang, btype.lang].join("_");

    declared.push({
      type: "function",
      id: "__cast__",
      ir_uid: fn_name,
      input: [atype.lang],
      output: [btype.lang]
    });

    c_functions.push(
      atype.c + " " + fn_name + "(" + btype.c + " a) {\n" +
      "  return a;\n" +
      "}"
    );
  });
});

var cfile = [
"#include <inttypes.h>",
"#include <math.h>",
c_functions.join("\n\n"),
//"int main() {}"
];


require("fs").writeFileSync("math.c", cfile.join("\n"));
require("fs").writeFileSync("../src/math.json", JSON.stringify(declared, null, 2));
