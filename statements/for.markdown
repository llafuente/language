## for

### Syntax

```syntax
for-statement
for-classic function-body for-else?
for-in function-body for-else?
for-in-slice function-body for-else?
for-till function-body for-else?
for-to function-body for-else?
for-iterable function-body for-else?
for-ever function-body for-else?

for-classic
'for' (var-declaration|expression ';')? expression ';' expression

for-in
'for' (var_identifier ',')? var_identifier 'in' var_identifier

for-in-slice
for-in '[' literal? ':' literal? ']'

for-till
'for' var_identifier 'till' (literal|expression)
'for' var-declaration 'till' (literal|expression)

for-to
'for' var_identifier 'to' (literal|expression)
'for' var-declaration 'to' (literal|expression)

for-iterable
'for' var_identifier

for-ever
'for'

for-else
'else' function-body

```

### for-classic


```plee

for var i = 0; i < 10; ++i {
    // do your staff
}

unvar j;
for j = 0; j < 10; ++j {
  // do your staff
}

```

### for-in

for-in won't clone the iterable.

To see iterator behavior when remove or push,
see [array@iterators](#array-iterators) or
[object@iterators](#object-iterators)

Iterator :

* If current value is removed (splice) the next value will have the same key and next value. if end is reached just break.
* If a value before the current is removed the next value will have the same key and next value.
* If a value after the current is removed won't appear in the loop.

```plee
unvar key, value;

for key, value in iterable {
  log key, value;
} else {
  // executed if condition fails the first time
}

for value in iterable {
  log value;
} else {
  // executed if condition fails the first time
}
```


### for-in-slice

for-in-slice wont clone the iterable part. The iterator will behave if something is removed.

Iterator behavior:

* If current value is removed (splice) the next value will have the same key and next value.
* If a value before the current is removed the next value will have the same key and next value.
* If a value after the current is removed won't appear in the loop.
* It will iterate (max - min) times regardless removals or reach iterable.length

```plee
for key value in iterable[3:5] {

} else {
    // executed if condition fails the first time
}

for key value in iterable[3:5] {

} else {
  // executed if condition fails the first time
}

```


### for-till (shortcut)

**STUDY** how we handle negative iterations 15 till 10 --> --i ??

```plee
for 10 till 15 {

}

for 15 till 9 {

} else {
  // will be executed!
}
```

Compiler will translate for-till with the folowing rules:
> for i till 10 -> for ; i < 10; ++i

> for var i till 10 -> for var i=0; i < 10; ++i

> for i=1 till 10 -> for i=1; i < 10; ++i

> for var i=1 till 10 -> for var i=1; i < 10; ++i


### for-to  (shortcut)

```plee
for variable|number to number {

} [else {
    // executed if condition fails the first time
}]
```

Compiler will translate for-to with the folowing rules:
> for i to 10 -> for ; i <= 10; ++i

> for var i to 10 -> for var i = 0; i <= 10; ++i

> for i=1 to 10 -> for i=1; i <= 10; ++i

> for var i=1 to 10 -> for var i=1; i <= 10; ++i


### for-iterable (shortcut)

for-iterable don't clone the iterable.

Cannot be nested with the same iterable variable-name. You can alias a variable and nest both for-iterables.

```plee
for iterable {

    // will be aliased, can be used outside the loop!
    assert $0 != iterable.$0;

    // will be aliased, can be used outside the loop!
    assert $1 != iterable.$1;

} [else {
    // executed if condition no length
}]
```

Compiler will translate for-iterable with for-in.


### for-ever
```plee
for {
  //do something!
}
```
