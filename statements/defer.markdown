### defer & panic

A `defer` statement postpone the execution of "something" until the surrounding function
returns or throw.

```syntax
"defer" call-expr
"defer" delete-statement
"defer" log-statement
"defer" assert-statement
"defer" block-statement
```

#### defer call-expr

Execute function when the surrounding function returns but the deferred call's arguments are evaluated immediately.

*Note*: to also defer the arguments evaluation you should wrap it in a block-statement.

```plee
defer x(a); // a is evaluated, x will be executed later
defer { x(a); }; // a and x will be evaluated/executed later
```

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



#### panic

Panic goes along return and raise/throw as modifier.

```plee
fn reserve target, amount  {
  // some defers calls!

  target = resize ui8[amount];
  defer log "reserved memory";

  if (x > 0) {
    return x; // this is ok
  }
  if (x == 0) {
    panic return x; // this is ok, but there is no reserved memory
  }
  // negative number? obviously resize will fail but it's an example :D
  panic throw "What have you done!";
}
```
