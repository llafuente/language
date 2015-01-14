module.exports = {
  read_block: read_block,
  read_source_elements: read_source_elements
};


function read_block() {
  var block = ast_new("block", state.current, null);

  debug(1, "▌read_block");

  if (!accept("{")) {
    return error("expected open block: '{'");
  }

  read_source_elements(block, true /*TODO false*/);

  if (!accept("}")) {
    return error("expected open block: '{'");
  }

  //set_ast_end_range(block, state.current);
  debug(1, "▌read_block");
  return ast_end(block);
}

// set body
function read_source_elements(ast, could_be_empty) {
  var list = [],
  eos = false; // end of scope
  while (!is_eob()) {
    log("read_source_elements");

    var statement = one_of([
      read_multiline_comment,
      read_singleline_comment,
      read_var_declaration,
      read_function_declaration,
      // Block, has min priority
      read_block
      ], "statement expected", true);

      // expect comment
      if (!is_error(statement)) {
        list.push(statement);
        continue;
      }

      // now statements that need semicolon at the end!
      statement = one_of([
        read_expression
        // TODO if
        // TODO for
        // TODO while
        // TODO switch
        // TODO return
        // TODO function
        // TODO labeled statement
        ], "statement expected", true);

        if (!is_error(statement) && accept(";")) {
          list.push(statement);
          continue;
        }

        // expect function declaration

        return error("unexpected statement");
      }

      if (!could_be_empty && !list.length) {
        return error("body cannot be empty");
      }

      ast.body = list.length ? list : null;

      return null;
    }
