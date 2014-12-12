## Error handling

Manage exceptions is in plee is very peculiar. Like C, there is not real exceptions class to throw. You throw anything `not null`.

it's recomended to use `exception()` function to throw.

### exception

`exception` it's a reserved word so the compiler can track line and file.
But it should be considered as a function with the following header.

> **exception**(*string* type, *string* message, *ui64* code, *object* user_data) : *object* {
>
> var object to_throw = {
>   "type": type,
>   "message": message,
>   "code": code,
>   "user_data": user_data,
> };
>
>  return to_throw;
>
>}

```
var err = exception "invalid-auth", "pwd-failed", 501;
```

**TODO** review, exception needs to be a reserved word ?

### throw

throw a new exception up.

```
throw "invalid-auth", "pwd-failed", 501;
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

* First argument: object
* Returns: ui8

Returns code behavior.

* 0 (false) exit program with given code
* 1 (true) continue program execution.
The function will return null and continue.
* 2 don't caught "re-throw"
* 3 retry

```
function manage_error(object err) : ui8 {
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
