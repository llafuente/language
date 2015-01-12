module.exports = {
  read_multiline_comment: read_multiline_comment,
  read_singleline_comment: read_singleline_comment
};

function read_multiline_comment() {
  if (!accept("/*")) {
    return error("expected multiline comment");
  }

  // look ahead for the closing
  var comment = ast_new("comment", state.current - 1, state.current + 1);
  comment.multiline = true;
  comment.text = eat();

  return expect("*/", comment, "can't find end of the comment");
}

function read_singleline_comment() {
  if (!accept("//")) {
    return error("expected singleline comment");
  }
  var comment = ast_new("comment", state.current, state.current + 2);
  comment.multiline = false;
  comment.text = eat(true);

  return comment;
}
