module.exports = {
  read_multiline_comment: read_multiline_comment,
  read_singleline_comment: read_singleline_comment
};

function read_multiline_comment() {
  var comment = ast_new("comment");

  if (!accept("/*")) {
    return error("expected multiline comment");
  }

  // look ahead for the closing
  comment.multiline = true;
  comment.text = eat();

  if (!accept("*/")) {
    return error("expected end of multiline comment: '*/'");
  }

  return ast_end(comment);
}

function read_singleline_comment() {
  var comment = ast_new("comment");

  if (!accept("//")) {
    return error("expected singleline comment");
  }

  comment.multiline = false;
  comment.text = eat(true);

  return ast_end(comment);
}
