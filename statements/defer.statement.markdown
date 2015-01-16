### defer

A defer statement defers the execution of a function until the surrounding function returns.

```syntax
"defer" call-expr
"defer" delete-statement
"defer" log-statement
"defer" assert-statement
"defer" block
```

**STUDY** defer executes if throw/raise ? (for `defer delete` seams resonable)

#### defer call-expr

Execute function when the surrounding function returns but the deferred call's arguments are evaluated immediately.

#### defer delete

free memory when the surrounding function returns or throw/raise.

```
fn x {
  var x = new ui8[10];
  defer delete x;

  x[0] = 100;
  defer log x;
  log x;
}

x();
```

```stdout
[100]
null
```

#### defer log

`defer log` will log the returned value if no arguments are sent.

```plee
fn x {
  var x = "a string!";
  defer log x;
  defer log;
  return 10;
}
x()
```

```stdout
a string!
10
```

#### defer assert

`defer log` will assert retuned value different of null if no arguments are sent.

```plee
fn x {
  defer assert;
  return null;
}
x()
```

```stdout
assert returned value must not be null.
```
