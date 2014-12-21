<a name="break"></a>
## break


### syntax

```syntax
break-statement
'break' (literal){0,1} ';'
```

### break inside loops

When `break` is reached, the nearest loop is immediately terminated and program continue with the next statement to the loop.

```plee
for var i .. 10 {
    break;

    log i;
}
// no stdout
```

### break inside switch

Jump to the next statement with given label


```plee
for var i .. 10 {
    break;

    log i;
}
// no stdout
```

### break with number

You can specify other than the nearest loop/switch given the break the number of jumps.

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

### break with label

Jump to the next statement with given label.

```plee
var found = false;

// ...

break id-label;

id-label: if (found) {
    //
}
```


### break iterator (shortcut)

```plee
for far_itr in ar {
    for near_itr in ar {
    break far_itr;
    // will be aliased to break number;
    // no need to count :)
}
```

This is because the compiler will label the `for` for you.
