## for

### for-classic
```
for [init;]condition; after_loop {

} [else {
    // executed if condition fails the first time
}]

```


### for-in

for-in wont clone the iterable. The iterator will behave if something is removed.

Iterator behaviour:

* If current value is removed (splice) the next value will have the same key and next value.
* If a value before the current is removed the next value will have the same key and next value.
* If a value after the current is removed won't appear in the loop.

```
for [key, ] value in iterable {

} [else {
    // executed if condition fails the first time
}]
```

### for-in-slice

for-in-slice wont clone the iterable part. The iterator will behave if something is removed.

Iterator behaviour:

* If current value is removed (splice) the next value will have the same key and next value.
* If a value before the current is removed the next value will have the same key and next value.
* If a value after the current is removed won't appear in the loop.
* It will iterate (max - min) times regardless removals or reach iterable.length

```
for [key, ] value in iterable[3,5] {

} [else {
    // executed if condition fails the first time
}]
```

### for-till (shrink)

```
for variable|number till number {

} [else {
    // executed if condition fails the first time
}]
```

Compiler will translate for-till with the folowing rules:
> for i till 10 -> for i=0; i < 10; ++i

> for i=1 till 10 -> for i=1; i < 10; ++i

### for-to  (shrink)

```
for variable|number to number {

} [else {
    // executed if condition fails the first time
}]
```

Compiler will translate for-to with the folowing rules:
> for i to 10 -> for i=0; i <= 10; ++i

> for i=1 to 10 -> for i=1; i <= 10; ++i

### for-iterable (shrink)

for-iterable don't clone the iterable.

Cannot be nested with the same iterable variable-name. You can alias a variable and nest both for-iterables.

```
for iterable {
    iterable.value // will be aliased, can be used outside the loop!
    iterable.key // will be aliased, can be used outside the loop!
    // 
} [else {
    // executed if condition fails the first time
}]
```

Compiler will translate for-iterable with for-in.
