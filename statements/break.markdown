## break


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
