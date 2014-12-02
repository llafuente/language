## repeat


Repeat allow to `repeat` nearest loop again.

Example:

```

var i,
    once = false;
for i .. 3 {
    if (!once && i == 2) {
        once = true;
        repeat;
    }

    log i;
}
// stdout: 0
// stdout: 1
// stdout: 0
// stdout: 1
// stdout: 2

```