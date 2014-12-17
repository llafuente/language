## switch (case, break, fallthrough)

"Switch" statements provide multi-way execution.
An expression or type specifier is compared to the "cases" inside the "switch" to determine which branch to execute.

`switch` is very special in plee in comparison with other languages.

Most common languages choose to break by default, and it's resonable, they provide `fallthrough` as error prone replacement of `break`

Plee goes a bit beyond while provide `fallthrough` also provide `break` but the default behavior is continue testing the next cases. So you can reuse code easily. Also default will be the last to test, regardless the position. In fact is recommended to be the first.


There are two types of switch: expression switch and comparison switch.

### comparison switch

Compare all case against one value.


This example illustrate the usage of comparison switch

```plee
var test = "ok";

switch(test) {
    default: return "i will be the last";

    case "ok": // test == "ok"
        echo "ok is found!";

        // continue testing by default
    case "nok": // test == "nok"
        echo "nok is found!";

        break; // to stop
    case "ok","nice": // test == "ok" || test == "nice"
        echo "ok or nice is found!";

        break;
}
```

output will be:

```
ok is found!
ok or nice is found!
```

You may expect "nok is found!" to be part of the output. But that's not the `case` and you didn't read the intro...

Fall-through in a switch is a common error for programmers that forget to `break`,
to avoid this undesired behavior even if the switch is falling-though case comparison must be meet.
If is desired you must specify it with the reserved word: `fallthrough`.


```plee
var test = "ok";

switch(test) {
    default: return "i will be the last";

    case "ok": // test == "ok"
        echo "ok is found!";

        fallthrough; // don't mind continue testing, enter in the next
    case "nok": // test == "nok"
        echo "nok is found!";
        break;

    case "ok","nice": // test == "ok" || test == "nice"
        echo "ok or nice is found!";

        break;
}
```

```
ok is found!
nok is found!
```

### expression switch

```plee
switch {
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
