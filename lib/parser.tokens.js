module.exports = {
  operators: [],
  punctuation: [";", ",", "[", "]", "{", "}", "(", ")"],
  reserved_words: ["new", "var", "if", "for", "while"],
  is_reserved_word: is_reserved_word,
  is_operator: is_operator,
  is_puntuator: is_puntuator,
  is_var_identifier: is_var_identifier
};

function is_reserved_word(str) {
  var ret = reserved_words.indexOf(str) !== -1;

  debug(5, "is_reserved_word", ret);

  return ret;
}

function is_operator(str) {
  var ret = operators.indexOf(str) !== -1;

  debug(5, "is_operator", ret);

  return ret;
}

function is_puntuator(str) {
  str = str || state.ctt;
  ret = str && str.length === 1 && punctuation.indexOf(str) !== -1;

  debug(5, "is_operator", ret);

  return ret;
}

function is_var_identifier(str) {
  str = str || state.ctt;

  var op = is_operator(str);
  var rw = is_reserved_word(str);
  var punc = is_puntuator(str);
  var ret = !(op || rw || punc);

  debug(4, "is_var_identifier", inspect(str), ret);

  return ret;
}
