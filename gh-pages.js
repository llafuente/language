var fs = require("fs"),
  marked = require('marked');

var readme = fs.readFileSync("readme.markdown", "utf-8");
marked(readme, function(err, content) {
  console.log(err);
  console.log(content);
});

