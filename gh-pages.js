var fs = require("fs"),
  path = require('path'),
  marked = require('marked'),
  mktemp = require('mktemp'),
  tmp = mktemp.createDirSync('XXXXX.tmp');

console.log("tmp-dir", tmp);

var files = {

    "readme.markdown": "index.html",

    "types/_intro.markdown": "types.html",
    "types/string.markdown": "string.html",
    "types/numerics.markdown": "numerics.html",
    "types/array.markdown": "array.html",
    "types/iterable.markdown": "iterable.html",
    "types/observers.markdown": "observers.html",

    "functions/_intro.markdown": "functions.html",
    "functions/listeners.markdown": "functions-listeners.html",

    "statements/for.markdown": "for-statement.html",
    "statements/if.markdown": "if-statement.html",
    "statements/swap.markdown": "swap-statement.html",
    "statements/switch.markdown": "switch-statement.html",

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

    source += fs.readFileSync(path.join(__dirname, source_file), "utf-8");

});

marked(source, function(err, content) {
  content = tpl.replace("%body%", content);

  console.log(err);

  fs.writeFileSync(path.join(tmp, "index.html"), content);
});

