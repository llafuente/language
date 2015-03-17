var util = require("util"),
    string_encode = require("./string-encode.js");

var tables = {
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

function traverse(node, callback, parent, prop, index) {
    parent = parent || null;
    prop = prop || null;
    index = index || null;

    console.log("current-node", $(node)) ;
    var i, max;

    callback(node, parent);

    switch(node.type) {
    case "if-statement":
        max = node.body.length;
        for (i = 0; i < max; ++i) {
            traverse(node.body[i], callback, node, "body", i);
        }

        if (node.else != null) {
            traverse(node.else, callback, node, "else");
        }


        break;
    case "program":
    case "var-declaration":
    case "block":
        max = node.body.length;
        for (i = 0; i < max; ++i) {
            traverse(node.body[i], callback, node, "body", i);
        }
        break;
    case "var-declarator":
    case "call-expr":
    //character.charCodeAt().toString(16)
        max = node.arguments.length;
        for (i = 0; i < max; ++i) {
            traverse(node.arguments[i], callback, node, "arguments", i);
        }
        break;
    case "string-literal":
        var position = tables.constants.length;
        tables.constants.push(
            string_encode(node.value)
        );

        replace_node(parent, prop, index, {
            type: "reference",
            value: "@constant_" + position
        });

    // ignore
    case "comment":
        break;
    default:
        throw new Error("unkown " + node.type);
    }
}

module.exports = function(tokens, ast) {
    traverse(ast, function() {});
}
