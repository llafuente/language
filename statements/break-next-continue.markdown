<a name="break"></a>
## break, next, continue


### syntax

```syntax
break-statement
'break' (literal | number | var-identifier)? ';'

continue-statement
'continue' (literal | number | var-identifier)? ';'

next-statement
'next' (literal | number | var-identifier)? ';'
```

### Inside loops

* `break` the nearest loop is immediately terminated and program continue with the next statement to the loop.

* `continue` jump to the first available statement:
  * post increment statement (for)
  * enter condition (for, while)
  * iteration body (do-while)

* `next` jump to the iteration body.

```plee
for var i .. 10 {
    break;

    log i;
}
// no stdout
```

### Inside switch

* `break` branch to the end of the switch statement

* `continue` branch to the next case condition: "continue testing".

* `next` branch to the body of the next case. (`fallthrough` alias)


### with number as "argument"

You can specify other than the nearest loop/switch given the statement the number of "jumps up".

```plee
for var i .. 10 {
    for var j .. 10 {
        break 2; // will break for-i
        log j;
    }
    log i;
}
// no stdout
```

### with label as "argument"

Take as reference the labeled statement, and follow the same rules.

```plee
var found = false;

// ...

break id-label;

id-label: if (found) {
    //
}
```


### iterator as argument (shortcut)

`for-iterator` is in fact a label statement by itself.

```plee
for var far_itr in ar {
    for var near_itr in ar {
        break far_itr;
        // will be aliased to break number;
        // no need to count :)
    }
}
```

This is because the compiler will label the `for` for you.

