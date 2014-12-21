var fs = require("fs"),
  path = require('path'),
  marked = require('marked'),
  cheerio = require('cheerio'),
  $,
  mktemp = require('mktemp'),
  tmp = mktemp.createDirSync('XXXXX.tmp');

console.log(tmp + "/index.html");
console.log(tmp + "/code.txt");
console.log(tmp + "/syntax.txt");

var files = {
    "readme.markdown": "index.html",
    "hello-world-example.markdown": "hello-world.html",

    "compiler.markdown": "compiler.html",

    "entry-point.markdown": "compiler.html",

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

    "implementation.markdown": "implementation.html",

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

var renderer = new marked.Renderer();
var old_heading = renderer.heading;
var last_level = 0;
var headings = new Array(10);

renderer.heading = function (text, level) {
  headings[level] = headings[level] || 0;

  ++headings[level];

  var ret = [],
    i = 1,
    head = [],
    args = Array.prototype.slice.call(arguments);

  while (++i <= level) {
    head.push(headings[i]);
  }

  args[0] = head.join(".") + " " + args[0];

  if (last_level < level) {
    ret.push("<section>");
  } else {
    ret.push("</section>");
    ret.push("<section>");
  }

  if (last_level > level) {
    i = level;
    while (++i <= 10) {
      headings[i] = 0;
    }
  }

  last_level = level;

  ret.push(old_heading.apply(this, args));

  return ret.join("\n");
};
marked(source, { renderer: renderer }, function(err, content) {
  content = tpl.replace("%body%", content + "</section>");

  //console.log(content);
  //process.exit();

  err && console.log(err);

  fs.writeFileSync(path.join(tmp, "index.html"), content);

  [{
    selector: ".lang-plee",
    file: "code.txt",
    sep: "\n//---\n"
  },{
    selector: ".lang-syntax",
    file: "syntax.txt",
    sep: "\n\n\n"
  }].forEach(function(v) {
    // extract all code examples
    var $ = cheerio.load(content),
      code = [];
    $(v.selector).each(function(k, v) {
      code.push($(v).text());
    });

    fs.writeFileSync(path.join(tmp, v.file), code.join(v.sep));
  });

});
