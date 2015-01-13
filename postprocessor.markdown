### Postprocesor.

Mainly to debug and instrument your code. Allow you to hook AST after being parsed.


* `#post` ast-type block

  ```
  // log every object before returning
  #post "return-statement" {
    var fn = get_nearest_function($0);
    if (fn.return_type == "object") {
      before($0, "log " + $0.id + ";");
    }
  }
  ```

Available functions

* is_defined(object ast, string variable_name)
* get_nearest_scope(object ast)
* get_nearest_function(object ast)
* before(object ast, object insert)
* before(object ast, string code)
* after(object ast, object insert)
* after(object ast, string code)
