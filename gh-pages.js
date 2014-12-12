var fs = require("fs"),
  path = require('path'),
  marked = require('marked'),
  mktemp = require('mktemp'),
  tmp = mktemp.createDirSync('XXXXX.tmp');

console.log("tmp-dir:", tmp + "/index.html");

var files = {
    "readme.markdown": "index.html",
    "hello-world-example.markdown": "hello-world.html",

    "operators.markdown": "operators.html",

    "types/_intro.markdown": "types.html",
    "types/string.markdown": "string.html",
    "types/numbers.markdown": "numbers.html",
    "types/pointers.markdown": "pointers.html",
    "types/array.markdown": "array.html",
    "types/struct.markdown": "array.html",
    "types/block.markdown": "array.html",
    "types/object.markdown": "array.html",
    "types/iterable.markdown": "iterable.html",
    "types/observers.markdown": "observers.html",

    "functions/_intro.markdown": "functions.html",
    "functions/listeners.markdown": "functions-listeners.html",

    "error-handling.markdown": "error-handling.html",

    "statements/if.markdown": "if-statement.html",
    "statements/switch.markdown": "switch-statement.html",
    "statements/for.markdown": "for-statement.html",
    "statements/while.markdown": "while-statement.html",
    "statements/swap.markdown": "swap-statement.html",
    "statements/break.markdown": "break-statement.html",
    "statements/repeat.markdown": "repeat-statement.html",

    "memory-management.markdown": "memory-management.html",
    "modules.markdown": "modules.html",

    "testing/testing.markdown": "testing.html",

};
/* multi-file
var tpl = fs.readFileSync("./tpl.html", "utf-8");
Object.keys(files).forEach(function(source_file) {

    var source = fs.readFileSync(path.join(__dirname, source_file), "utf-8");

    marked(source, function(err, content) {
      content = tpl.replace("%body%", content);

      console.log(err);

      fs.writeFileSync(path.join(tmp, files[source_file]), content);
    });
});
*/

/* single-file*/
var tpl = fs.readFileSync("./tpl.html", "utf-8"),
    source = "";

Object.keys(files).forEach(function(source_file) {

    source += fs.readFileSync(path.join(__dirname, source_file), "utf-8") + "\n\n\n";

});

marked(source, function(err, content) {
  content = tpl.replace("%body%", content);

  console.log(err);

  fs.writeFileSync(path.join(tmp, "index.html"), content);
});
