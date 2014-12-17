## Implementation (compiler)

For compiler builders only.

### Abstract Syntax Tree (AST) expansion

Many of the lazy forms introduced in plee are in fact expansions of the current
AST of the program.

For example: `for-to`

```
for var i to 20 {
  log i;
}
```

This is not meant to be implemented in a low level rather than expanding the
plee code to behave as `for-classic` so in the end will be compiled as:

```
for var i=0; i < 20; ++i {
  log i;
}
```

**Why?** mainly two reasons:

* Flexibility
* Small subset to implement.

So any **shortcut** you could find in plee need to be expanded.

Another good example is implicit header function.

```
fn callme fn baby(ui8, ui8) {
  return baby(1, 5);
}

// sum 1 and 5
callme({
  return x + y;
});
```

It's in fact:

```
callme(fn (ui8, ui8) {
  return x + y;
});
```

BTW: This is a recommendation



### functions

Try expand to its full form (with *types* and *return null* if needed).
Complain if something is missing or unknown.

Compiler will also generate multiple versions of the same function
if every type is compatible and *no precision would be lost*.

```
fn sum x,  y {
  return x + y;
}
// will be initialy expanded to:
function sum(number x, number y) -> number {
  return x + y;
}
var ui8 x = 5, y = 7;
log sum(5, 7);

// will generate another function with ui8 as inputs and output to optimize run-time execution.
function sum(ui8 x, ui8 y) -> ui8 {
  return x + y;
}
```

Even if a function is not used, must be included because user can `call` functions by name.
