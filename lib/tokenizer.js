/*jshint -W030 */

module.exports = tokenizer;
module.exports.parse = parse;
module.exports.debug = debug;
module.exports.rangenize = rangenize;

function tokenizer(file, verbose) {
  var code = require("fs").readFileSync(file, "utf-8");
  return parse(code, verbose);
}

function parse(code, verbose) {

  // just a small subset
  // code = code.substr(0, 300);

  var i = 0,
  max = code.length,
  tokens = [],
  eof = ["\r\n", "\n"];

  operators = [
  "(", ")",
  "[", "]",
  "{", "}",
  ";",
  ":",
  ",",

  //".", this is very special because it's also the number-decimal sep.

  "new",
  "!", "~",
  /*"+","-"*/,"++","--", // remove minus/plus because it's very special
  "typeof", "delete", "resize",
  "?", "+=", "=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|="
  ];

  var multiline_comments_level = 0;
  var single_comments = false;
  var last_was_blank = false;
  var inside_string_dq = false;
  var stack = [];

  function pop_stack() {
    if (stack.length) {
      tokens.push(stack.join(""));
      stack = [];
    }

  }

  mainloop: for (i = 0; i < max; ++i) {
    // cache 10 chars, more than enough
    var next = code.substr(i, 10);
    var c = code[i];

    verbose && console.log(i, c);

    /* parse comments first, multiline has priority over singleline */

    if (next.indexOf("/*") === 0 && !single_comments) {
      if (multiline_comments_level === 0) {
        pop_stack();
        tokens.push("/*");
      } else {
        stack.push("/*");
      }

      ++i;
      ++multiline_comments_level;
      verbose && console.log(i, "start of multiline-comment", multiline_comments_level);
      continue;
    }

    if (next.indexOf("*/") === 0 && !single_comments) {
      if (multiline_comments_level === 1) {
        pop_stack();
        tokens.push("*/");
      } else {
        stack.push("*/");
      }

      ++i;
      --multiline_comments_level;
      verbose && console.log(i, "end of multiline-comment", multiline_comments_level);
      continue;
    }

    if (single_comments && c === "\n") {
      stack.push("\n");
      pop_stack();
      single_comments = false;

      verbose && console.log(i, "end of line-comment");
      continue;
    }
    if (multiline_comments_level === 0 && !single_comments && next.indexOf("//") === 0) {
      pop_stack();
      tokens.push("//");
      ++i;
      single_comments = true;
      verbose && console.log(i, "start of line-comment");
      continue;
    }

    if (multiline_comments_level || single_comments) {
      stack.push(code[i]);
      continue;
    }

    /* string handling */

    if (inside_string_dq && c === "\"") {
      /* count back the number of back-slashes */
      var count_bs = 0,
      jmax,
      j;

      jmax = j = stack.length - 1;

      while (stack[j] === "\\" && --j >= 0) {
      }

      verbose && console.log(i, "found", jmax - j);

      /* pair back-slashes - no escaped */
      if ((jmax - j) % 2 === 0) {
        verbose && console.log(i, "close = ", stack);
        pop_stack();
        tokens.push("\"");
        inside_string_dq = false;
      } else {
        verbose && console.log(i, "continue", stack);
        stack.push("\"");
      }

      continue;
    }

    /* we are in a string so just add it */
    if (inside_string_dq) {
      stack.push(c);
      continue;
    }

    if (c === "\"" && !inside_string_dq) {
      verbose && console.log(i, "open string");
      inside_string_dq = true;
      pop_stack();
      tokens.push("\"");
      continue;
    }


    /* purge whitespaces */

    if (
      c == "\t" ||
      c == "\v" ||
      c == "\f" ||
      c == " " ||
      c == "\u00A0" ||
      c == "\uFEFF" ||
      c == "\n"
      //c == Zs
    ) {
      if (!last_was_blank) {
        pop_stack();
      }

      stack.push(code[i]);
      last_was_blank = true;
      continue;
    }

    /* if no blank but the las was, pop */
    if (last_was_blank) {
      pop_stack(); // we want blanks
    }

    /* operators */
    var z = 0,
    zmax = operators.length;

    for (z = 0; z < zmax; ++z) {
      if (next.indexOf(operators[z]) === 0) {
        pop_stack();
        tokens.push(operators[z]);
        i += operators[z].length - 1;
        continue mainloop;
      }
    }

    // dot operator.
    if (c === ".") {
      // check the stack for a number
      console.log("stack has a number", stack);
      if (!stack.join("").match(/^[0-9]*$/)) {
        pop_stack();
        tokens.push(".");
      } else {
        stack.push(".");
      }

      continue;
    }

    if (c === "-" || c === "+") {
      if (last_was_blank) {
        pop_stack();
      }

      stack.push(c);
      continue;
    }

    stack.push(code[i]);
    last_was_blank = false;
  }

  return tokens;
}



function debug (tokens, verbose) {
  var colors = [
  [31, 39],
  [32, 39],
  //[33, 39],
  //[34, 39],
  //[35, 39],
  //[36, 39],
  //[37, 39],
  //[90, 39],
  ],
  color_id = 0;

  verbose && console.log(tokens);

  tokens = tokens.map(function(v) {
    // if blank, do not change color!
    if (v.match(/^(\s)*$/) !== null) {
      return v;
    }

    var txt = '\u001b[' + colors[color_id][0] + 'm' + v + '\u001b[' + colors[color_id][1] + 'm';

    ++color_id;
    if (color_id == colors.length) {
      color_id = 0;
    }

    return txt;

  });


  return tokens.join("");
}


function rangenize (tokens) {

  var i = 0,
  max = tokens.length,
  position = 1,
  line = 1,
  lines,
  char = 1,
  ranges = [];

  for (i = 0; i < max; ++i) {
    r = {
      pos: [[line, position], [0, 0]],
      chc: char,
      token: tokens[i]
    };

    ranges.push(r);

    char += tokens[i].length;

    lines = (tokens[i].match(/\n/g) || []).length;
    if (lines) {
      line += lines;
      // go backwards the string until "\n"
      j = tokens[i].length;
      while (tokens[i][--j] !== "\n") {
      }

      position = tokens[i].length - j;
    } else {
      position += tokens[i].length;
    }

    r.pos[1][0] = line;
    r.pos[1][1] = position;
  }

  return ranges;

}
