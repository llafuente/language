  var util = require("util"),
    string_encode = require("./string-encode.js");

var __globals = {
    variables: [],
    constants: []
};


function $(x) {
    return util.inspect(x, {depth: null, colors: true});
}

function replace_node(parent, prop, index, newone) {
    if (index !== null) {
        parent[prop][index] = newone;
    } else {
        parent[prop] = newone;
    }
}

function traverse(node, callbacks, parent, prop, index, level) {
    parent = parent || null;
    prop = prop || null;
    index = index === undefined ? null : index;
    level = level || 0;

    console.log("current-node", $(node)) ;
    var i, max;

    callbacks.enter && callbacks.enter(node, parent, prop, index, level);

    switch(node.type) {
    case "if-statement":
        max = node.body.length;
        for (i = 0; i < max; ++i) {
            traverse(node.body[i], callbacks, node, "body", i, level + 1);
        }

        if (node.else != null) {
            traverse(node.else, callbacks, node, "else", null, level + 1);
        }


        break;
    case "program":
    case "var-declaration":
    case "block":
        max = node.body.length;
        for (i = 0; i < max; ++i) {
            traverse(node.body[i], callbacks, node, "body", i, level + 1);
        }
        break;
    case "call-expr":
    //character.charCodeAt().toString(16)
        max = node.arguments.length;
        for (i = 0; i < max; ++i) {
            traverse(node.arguments[i], callbacks, node, "arguments", i, level + 1);
        }
        break;
    // ignore
    case "var-declarator":
    case "string-literal":
    case "comment":
    case "constant":
        break;
    default:
        throw new Error("unkown " + node.type);
    }

    callbacks.leave && callbacks.leave(node, parent, prop, index, level);
}

module.exports = function(tokens, ast) {
  // replace string-literals
    traverse(ast, {
      enter: function(node, parent, prop, index) {
        switch(node.type) {
        case "string-literal":
          var position = __globals.constants.length;
          var encoded_arr = string_encode(node.value);

          __globals.constants.push(
            {
              name: "@constant_" + position,
              opts: "private unnamed_addr constant",
              type: "string",
              ir_type: "[" + encoded_arr.length +" x i8]",
              value: encoded_arr.join("")
            }
          );

          replace_node(parent, prop, index, {
            type: "constant",
            id: position
          });
          break;
        }
      }
    });
    console.log($(ast));

    var main = require("fs").readFileSync(__dirname + "/main.tpl.ll", {encoding: 'utf-8'});

    // build IR
    var stack = [],
      ref,
      ins = 1,
      stack_scope = [];
    traverse(ast, {
      enter:  function(node, parent, prop, index, level) {
        switch(node.type) {
        case "program":
        case "call-expr":
          ref = [];
          stack.push(ref);
          break;
        case "constant":
          break;
        default:
          throw new Error("???");
        }
      },
      leave: function(node, parent, prop, index, level) {
        switch(node.type) {
        case "program":
          stack.push("ret i32 0");
          break;
        case "var-declarator":
          break;
        case "call-expr":

          var args = stack.pop();

          console.log(args);

          stack.push("%" + (ins++) + " = call i32 (i8*, ...)* @" + node.callee +"(" + args.join(", ") + ")");
          break;
        case "constant":
          var c = __globals.constants[node.id];
          switch(c.type) {
          case "string":
            ref.push(
              "i8* getelementptr inbounds (" + c.ir_type + "* " + c.name + ", i32 0, i32 0)"
            );
            break;
          default:
            throw new Error("unkown type");

          }
          break;
        default:
          throw new Error("???");
        }
      }
    });

    main = main
      .replace("%%main%%", stack.join("\n"))
      .replace("%%constants%%", __globals.constants.map(function (v) {
        return [v.name, "=", v.opts, v.ir_type, "c\"" + v.value + "\"", ", align 1"].join(" ");
      }).join("\n"))
    ;

    console.log(main);

    require("fs").writeFileSync(process.env.PWD + "/hello.ll", main, {encoding: 'utf-8'});
};
