## switch (case, break, fallthrough)

"Switch" statements provide multi-way execution.
An expression or type specifier is compared to the "cases" inside
the "switch" to determine which branch to execute.

Modern languages choose to break by default, and it's resonable,
they provide `fallthrough` as error prone replacement of non-`break`-ing.

In plee both is mandatory to en a case with one of the following.

* `break`, exit switch
* `fallthrough` or `next`, enter in the next case without testing
* `continue`, continue testing

`default` case must be the last, and do not need to `break`, `fallthrough` or `continue`.

There are three types of switch:
* comparison switch.
* expression switch.
* match-regexp switch.

### Syntax

```syntax
switch-statement
**TODO**
```

### comparison switch

Compare all case against one value.


This example illustrate the usage of comparison switch

```plee
fn switch_test(string test) {
  log "switch = ", test;

  switch test {
    case "ok": // test == "ok"
      log "case ok";
      continue;

    case "nok": // test == "nok"
      log "case nok";
      break;

    case "ok", "nice": // test == "ok" || test == "nice"
      log "case ok, nice";
      break;

    default:
      log "case default";
  }  
}

switch_test("ok");
switch_test("nok");
switch_test("nice");
switch_test("unknown");

```

output will be:

```stdout
switch = ok
case ok
case ok, nice
switch = nok
case nok
switch = nice
case ok, nice
switch = unknown
case default
```

### expression switch (switch true)

If value is not sent true is used instead.

```plee
switch { // test against true
    default: return "i will be the last";

    case test == "ok": // test == "ok"
        echo "ok is found!";

        // fall thought, but test each case
    case test == "nok": // test == "nok"
        echo "nok is found!";
        break; // exit

    case test == "ok" || test == "nice": // test == "ok" || test == "nice"
        echo "ok or nice is found!";

        break; // exit
}
```

### match-regexp switch

Thre are two variants: values against many regexp, or one regexp against multiple values.

To support regexp the type must have `regexp_test` function asociation.

```plee
switch v {
  case /a-z/g:
    log "lowercase";
    break;

  case /A-Z/g:
    log "uppercase";
    break;
}
```

```plee
switch (/0-9/g) {
  case a:
    log "a is a number";
  break;

  case b:
    log "b is a number";
  break;
}
```
