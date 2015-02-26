//
// this file generate some boilerplate IR code from c code
// like truncate, so the language just call functions that are "alwaysinline"
// this will easy things
//

// http://llvm.org/docs/LangRef.html#icmp-instruction

//
// expression operators
//
var operators = [
  {operator: "+", type: "binary", function: "expr_sum"},
  {operator: "-", type: "binary", function: "expr_sub"},
  {operator: "*", type: "binary", function: "expr_mult"},
  {operator: "/", type: "binary", function: "expr_div"},
  {operator: "%", type: "binary", function: "expr_mod", remove: ["f32", "f64"]},

  {operator: "^", type: "binary", function: "expr_bitwise_xor", remove: ["f32", "f64"]},
  {operator: "|", type: "binary", function: "expr_bitwise_or", remove: ["f32", "f64"]},
  {operator: "&", type: "binary", function: "expr_bitwise_and", remove: ["f32", "f64"]},

  {operator: "<<", type: "binary", function: "expr_shift_left", remove: ["f32", "f64"]},
  {operator: ">>", type: "binary", function: "expr_shift_right", remove: ["f32", "f64"]},

  {operator: "--", type: "right", function: "expr_post_decr"},
  {operator: "++", type: "right", function: "expr_post_incr"},

  {operator: "--", type: "left", function: "expr_pre_decr"},
  {operator: "++", type: "left", function: "expr_pre_incr"},
  {operator: "-", type: "left", function: "expr_negate"},
  {operator: "~", type: "left", function: "expr_bitwise_not", remove: ["f32", "f64"]},
  {operator: "!", type: "left", function: "expr_logical_not"},
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
          name: fn_name,
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
          name: fn_name,
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
          name: fn_name,
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
  "cos", "sin", "tan", "acos", "asin", "atan", "atan2"
  // Hyperbolic functions
  "cosh", "sinh", "tanh", "acosh", "asinh", "atanh",

  "exp", "frexp", "ldexp", "log", "log10", "modf", "exp2", "expm1", "ilogb", "log1p", "log2", "logb", "scalbn", "scalbln"

];

//
// truncate
//

types.forEach(function(atype) {
  types.forEach(function(btype) {
    if (atype.lang == btype.lang) return;

    var fn_name = ["trunc", atype.lang, btype.lang].join("_")
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
