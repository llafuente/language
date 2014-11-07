## for

### Classic
```
for [init;]condition; after_loop {

} [else {
    // executed if condition fails the first time
}]

```


### for in

```
for [key, ] value in iterable {

} [else {
    // executed if condition fails the first time
}]
```

### for till

```
for variable|number till number {

} [else {
    // executed if condition fails the first time
}]
```

### for to

```
for variable|number to number {

} [else {
    // executed if condition fails the first time
}]
```

### short for

```
for iterable {
    $iterable // value: is automatically declared
    $$iterable // key: is automatically declared
    // cannot be nested!
} [else {
    // executed if condition fails the first time
}]
```