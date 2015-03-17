## Error handling

Error handling do not use Exceptions but it use most of it's
terminology.

What is an error:

* `failure`: something don't do it's work properly. The best
example is arithmetic overflow.
* `error`: abnormal execution state. Invalid values / asserts.
* `warning`: Not an error, but will be soon :)
* `notice`: Mostly used to let you know something could be dangerous,
most of the notices are compile-time.


### exception type

`exception` it's a struct

```plee
enum exception_levels {
  failure,
  error,
  warning,
  notice
};

struct exception {
  var exception_levels level;
  var string message;
  var i64 code;
  var box userdata;
};
```

### exception throw

```
throw failure("message", 100/*code*/, user_data);
throw error("message", 100/*code*/, user_data);
throw notice("message", 100/*code*/, user_data);
throw warning("message", 100/*code*/, user_data);
```

### raise

`raise` is a convenient way to throw an exception if a variable is not null.

```
var exp = null;
raise exp; // do not throw
exp = {"error": "my message"}
raise exp; // but this will
```

### manage an exception

`exceptions` are managed by functions that you can setup at function call.

Exceptions manager are functions with a compatible header:

* Arguments: exception
* Returns: ui8

Returns code behavior.

* 0 (false) exit program with given code
* 1 (true) continue program execution.
The function will return null and continue.
* 2 don't caught "re-throw"
* 3 retry

```
function manage_error(exception err) : ui8 {
  log err.type;
  log err.message;

  return false;
}

function div x, y :i64 {
  return x / y;
}

log div(0, 0) @manage_error;

// stdout: runtime-error
// stdout: division by 0

```

### error stack

throw/raise exceptions are good for single exceptions and specific use cases.
For a more general tailor made solution that you can customize use the error
stack functions.


> push_error()

> has_error()

> pop_error()

> error_message()

> error_no()

> error_list()
