## switch (case, break, fallthrough)

"Switch" statements provide multi-way execution.
An expression or type specifier is compared to the "cases" inside the "switch" to determine which branch to execute.

`default` case will be the last to be executed regardless the position in code.

There are two types of switch: expression switch and comparison switch.

### comparison switch

Compare all case against one value.


This example illustrate the usage of comparison switch and `reswitch`

```
var test = "ok";

switch(test) {
    default: return "i will be the last";

    case "ok": // test == "ok"
        echo "ok is found!";

        // default fall thought
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
ok or nice is found!
```

You may expect "nok is found!" to be part of the output. But that's not the `case` :)

Fall-through in a switch is a common error for programmers that forget to `break`,
to avoid this undesired behavior even if the switch is falling-though case comparison must be meet.
If is desired you must specify it with: `fallthrough`


```
var test = "ok";

switch(test) {
    default: return "i will be the last";

    case "ok": // test == "ok"
        echo "ok is found!";

        fallthrough:
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

```
switch {
    default: return "i will be the last";

    case test == "ok": // test == "ok"
        echo "ok is found!";

        // fall thought
    case test == "nok": // test == "nok"
        echo "nok is found!";
        break;

    case test == "ok" || test == "nice": // test == "ok" || test == "nice"
        echo "ok or nice is found!";

        break;
}
```


### switch AST

```json
SwitchStatement <: Statement {
    "type": "switch-statement";
    "discriminant": Expression | null;
    "cases": [ SwitchCase ];
    "lexical": boolean;
}
SwitchCase <: Node {
    "type": "SwitchCase";
    "test": Expression | null;
    "body": BlockStatement;
    "next": SwitchStatement | null;
    "default": SwitchStatement | null;
}
```