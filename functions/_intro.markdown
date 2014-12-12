# Functions

Main philosophy behind:

* [Function overloading](http://en.wikipedia.org/wiki/Function_overloading)
* [Anonymous function](http://en.wikipedia.org/wiki/Anonymous_function)
* [Variadic function](https://en.wikipedia.org/wiki/Variadic_function)
* Everything is sent by reference, hence *Multiple Return Values* is not needed-supported.
* There is no `this` concept. `this` introduce many memory management problems so it's removed.
* Argument types are optional (sometimes)
* Return type is optional (sometimes). If no return statement is found, `null` will be returned.
* `fn` is an alias `function`, for lazy people.
* Parenthesis are not required, braces are.

## Functions identifier/name rules

* Cannot start with a number
* Cannot start with a $
* Any UTF-8 valid character

Can I use `+` as function name... The answer is: *Yes*, we can.

## Function declaration

> **fn**|**function** *identifier* [,*arguments*]\* [: *return_type*] {}

```
fn giveme x {
    return x;
}
log giveme(0); // stdout: 0
```



Compiler will try expand to its full form (with types and return), or complain if something is missing or unknown.

Compiler will also generate multiple versions of the same function if every type is compatible.

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

// will generate another function with ui8 as inputs and output.
function sum(ui8 x, ui8 y) -> ui8 {
  return x + y;
}
```

Compiler don't generate functions if precision would be lost.




## function calls

There are two ways to call a function: Classic and ~Prototypes/Objects like (first argument as class-like).

```
log sum(5, 6);
// stdout 11

log 5.sum(6);
// stdout 11
```

That allow compiler to use tail-call-recursion.


The first argument can be used as a classy-method-prototype.

Compiler will translate those *lazy forms* to the full.

## Argument default

Common syntax.

```
fn sum ui8 a, ui8 b = 1 {

}
```

## Argument assertion (shorthand)

Assertion is a common use to check arguments invalid ranges/value.

You could use any check comparison to create an assertion

```
// default: 1
// assert if negative
// assert if is null
fn sum ui8 a, ui8 b = 1 < 0 == null {

}
```

## Argument call expansion

Sometime functions could receive a lot of parameters, with many optional/default values. In those cases reading or even writing the call could be painful.

For that you can specify what arguments are you passing.


```
fn sum ui8 a, ui8 b {

}


// and you can define the same function, with different argument names.
fn sum ui8 c, ui8 b {

}

sum(5 as b, 6 as a);
sum(5, 6); // compiler-error, argument expansion is required found two compatible functions: ...
```

## Variadic function

Variadic functions allow you to receive any number of arguments of the same type.

```

// this function recieve many ui8
fn sumall ui8... {
    var sum = 0;

    arguments.each({ sum+=$0;})

    return sum;
}

// this is not allowed
fn glue string start, string to_join..., string end {

}

```

**TODO** Study support for multiple Variadic

## Operator functions

Operator function can be used as a shorthand with two purposes:

* Modify the first argument
* Return a new Argument

Operator functions doesn't require `.` (dot).

Operator list (**TODO** study to add more but this should be
enough, and do not introduce so much errors )

* +
* -
* *
* /
* =

```
var vec2 = require("v2"); // mod type is v2
var va = new vec2(1, 1);
var v_ra = new vec2(1, 1);
var v_rb = new vec2(1, 1);

fn +(x:v2, y:v2) {
    x.x += y.x;
    x.y += y.y;
}

fn +(x:v2, y:v2) -> v2 {
    x.x += y.x + 10;
    x.y += y.y;

    return /*clone */ x;
}
// call first function (no return)
va + va; // v will be modified now (2,2)

// call second function (with return)
v_ra = v_ra + v_rb; // v will be modified now (12,2)

```

## Arguments by value

`clone` operator is used before an argument to specify that you want to clone it.

```
function mod_all(clone x, y) {
    x = 1;
    y = 1;
}
var x = 0;
var y = 0;
mod_all(x, y);

log x; // stdout: 0
log y; // stdout: 1
```

## `function` as arguments

A function is divided into header and body.
A callback function could have a default header that will be used is at call-expression
is not used.



```
// declaration
function each ar:array, code:function($0, string $1)) {
    var i = 0,
        max = ar.lenth;

    for (i = 0; i < max; ++i) {
        code(ar[i], i);
    }

}

// execution

var arr = [1, 2, 3, 4];

// avoid header on call, default header will be used.
arr.each({
    var value = $0;
    var key = $1;

    log key, "-", value;
});
// stdout: 1-1
// stdout: 2-2
// stdout: 3-3
// stdout: 4-4

```

Compile will expand the call

```
arr.each(fn ($0, string $1) {
  var value = $0;
  var key = $1;

  log key, "-", value;
});
```

## Name collision/resolution

Because the first argument will have a pseudo-method, functions with the same name
cannot have the same arguments. To avoid collision we introduce a "do not export"


## functions in modules.

Just as a brief introduction, functions in modules has special keyword to specify
their behavior.

* `export fn` allow a function to be used outside the module
* `export fn new` constructor of the module
* `export fn delete` destructor of the module

## documentation

Compiler can generate documentation based on comments preceding a functions, also can get types.

The following two examples are identical
```
/**
* @param ui8 x
* @param ui8 y
*/
fn x, y {

}
```

```
fn ui8 x, ui8 y {

}
```


## #run

Compile time function running
