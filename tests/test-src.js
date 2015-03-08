require("ass");

var tap = require("tap"),
  test = tap.test,
  tokenizer = require("../lib/tokenizer.js"),
  parser = require("../lib/parser.js"),
  argv = require('yargs'),
  file_to_update = [],
  inspect_test = null,
  debug_level = 0;

if (argv.argv.update) {
  if ("string" === typeof argv.argv.update) {
    file_to_update = [argv.argv.update];
  } else {
    file_to_update = argv.argv.update;
  }
}
if (argv.argv.v) {
  debug_level = parseInt(argv.argv.v, 10);
}



if (argv.argv.inspect) {
  inspect_test = argv.argv.inspect;
}

function inspect(obj) {
  console.log(
    require("util").inspect(obj, {depth:null, colors: true})
  );
}

function setup(code) {
  var tokens = tokenizer.parse(code, 0);
  tokens = tokenizer.rangenize (tokens);
  try {
    var ast = parser(tokens, debug_level);
  } catch(e) {
    return e;
  }

  return ast;
}

var src_path = __dirname + "/src/",
  ast_path = __dirname + "/ast/",
  pjoin = require("path").join,
  fs = require("fs");

function test_file(file) {
  test("test file:" + file, function (t) {
    if (inspect_test && inspect_test != file) {
      return t.end();
    }

    var file_text = fs.readFileSync(pjoin(src_path, file), {
      encoding: 'utf-8'
    });

    var ast = setup(file_text);

    // inspect_test is for debugging purposes only, so exit.
    if (inspect_test) {
      inspect(ast);
      process.exit();
    }

    // TODO check against test/ast/<file>.json
    var ast_file = pjoin(ast_path, file) + ".json";

    if (file_to_update.indexOf(file) !== -1 || argv.argv.update_all) {
      console.error("ast file updated:", file);
      // update AST file
      fs.writeFileSync(ast_file, JSON.stringify(ast, null, 2));
    }

    var ast_to_test = require(ast_file);

    t.deepEqual(ast, ast_to_test, ast_file);
    t.end();
  });
}


require("fs")
.readdirSync(src_path)
.forEach(test_file);
