## Functions

### Philosophy

* [Function overloading](http://en.wikipedia.org/wiki/Function_overloading)

* [Anonymous function](http://en.wikipedia.org/wiki/Anonymous_function)

* [Variadic function](https://en.wikipedia.org/wiki/Variadic_function)

* Everything is sent by reference

* There is no `this` concept/keyword.

  `this` introduce many memory management problems.

* *Type inference*: Argument types are optional (sometimes)

* *Type inference*: Return type is optional (sometimes).
If no return statement is found, `null` will be returned.

* if *Type inference* found two compatible types, compiler will
generate as many functions as needed to optimize execution time.

* `fn` is an alias `function`, for lazy people.

* Parenthesis are not required, curly braces are.


**study**

* *Multiple Return Values*. Need support for tuples or
no-typed arrays...

### Functions identifier/name rules (*fn_identifier*)

* Must not be a [number](#number).
* Cannot start with a `$`
* Any UTF-8 valid character
* cannot start with any [left-to-right operator](#operators)
* cannot end with any [right-to-left operator](#operators)

Can I use `a+b` or `a-b` as function name... The answer is: *Yes*, we can. Even snowman!

### Syntax

```syntax
function-declaration
function-header [':' type] [alias [',' fn_identifier]+] function-body

function-header
function-header-full
function-header-lazy

function-header-full
('inline'|'no_inline')? ('fn'|'function') '(' fn-identifier arguments-list? ')'

function-header-lazy
('inline'|'no_inline')? ('fn'|'function') fn-identifier arguments-list?

arguments-list
argument (',' arguments-list)*

argument
[type] var_identifier ('=' literal)? (('!='|'<'|'>'|'=>'|'<=') literal)*
function-header-full

function-body
'{' (statement|function-declaration)+ '}'

function-call
fn_identifier '(' parameter-list* ')'
var_identifier '.' fn_identifier '(' parameter-list* ')'

parameter-list
parameter (',' parameter-list)*

parameter
literal ':' (literal|expression)
(literal|expression) 'as' literal
(literal|expression)
```

Notice that function-body cannot be empty, there is no
`empty-statement`.

### Declaration

```plee
fn giveme x {
    return x;
}

log giveme(0); // stdout: 0
```

Declaration implicit declare the type. There is no need to `typedef` like in c.

Types are automatically exported in modules if required.

### function call

* Classic function call

  ```plee
  log sum(5, 6);
  // stdout 11
  ```

* Objects Oriented / Prototypal

  ```plee
  log 5.sum(6);
  // stdout 11
  ```

**note** If chaning if possible, use the second one, because
allow compiler to use `tail-call-recursion` that optimize
runtime execution.

To use any of the notation you don't need to write extra code.

Compiler will expand to the functional form, adding '5' as first
argument.

### default arguments

```plee
fn sum ui8 a, ui8 b = 1 {

}
```

You can use other arguments properties as default values.

```plee
fn array arr, ui64 limit = arr.length {

}
```

## Argument assertion (shortcut)

Assertion is a common use to check arguments invalid ranges/value.

You could use any check comparison to create an assertion.
*notice*: compiler allow *strange* checks like '> 5' and '< 6' that
simply don't allow any number, so becareful.

```plee
// default: 1
// assert if negative
// assert if is null
fn sum ui8 a, ui8 b = 1 < 0 == null {

}
```

### Parameter names call

Name each parameter to match argument names of a function.

Solve two common problems.

* Functions with a lot of parameters, many time with many
optional/default values.

* Function overloading with the same types is allowed with diferent
arguments identifiers

* Clearly indicate the purpose of each argument you pass to the
function.

```plee
fn sum ui8 a, ui8 b {

}

// and you can define the same function, with different argument names.
fn sum ui8 c, ui8 b {

}

sum(5 as b, 6 as a);
sum(c: 5, b: 6);
sum(5, 6); // compiler-error
// Argument expansion is required found two compatible functions: ...
sum(5, b: 6); // this is allowed
```

### Variadic function

Variadic functions allow you to receive any number of arguments of the same type.

```plee
// this function recieve many ui8
fn sumall ui8, ... {
    var sum = 0;

    arguments.each({ sum+=$0;})

    return sum;
}

// this is not allowed (atm)
fn glue string start, string to_join..., string end {

}

```

**TODO** Study support for multiple Variadic
**TODO** Study support spread operator, but notation of
one must differ to avoid confusion

### Operator functions

**TODO** too vage, need to be more tighten.
this could lead to some problems. operator function declaration
need to be standard, and checked by the compile, define those rules.
**null** as return value?!

Operator function can be used as a shortcut with two purposes:

* Modify the first argument
* Return a new Argument

Operator functions doesn't require `.` (dot).

Operator list

* +
* -
* *
* /
* =

**STUDY** add more operators? but this should be
enough, and do not introduce so much errors

```plee
var vec2 = require("v2"); // mod type is v2
var va = new vec2(1, 1);
var v_ra = new vec2(1, 1);
var v_rb = new vec2(1, 1);

fn + v2 x, v2 y : null {
    x.x += y.x;
    x.y += y.y;
}

fn + v2 x, v2 y : v2 {
    x.x += y.x + 10;
    x.y += y.y;

    return /*clone */ x;
}
// call first function (no return)
va + va; // v will be modified now (2,2)

// call second function (with return)
v_ra = v_ra + v_rb; // v will be modified now (12,2)

```

### Arguments by value

`clone` operator is used before an argument to specify that
you want to clone it.

```plee
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

### `function` as arguments

A function is divided into header and body.
A callback function could have a default header
that will be used is at call-expression is not used.



```plee
// declaration
function each array ar, inline fn code($0, string $1)) {
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

```plee
arr.each(fn ($0, string $1) {
  var value = $0;
  var key = $1;

  log key, "-", value;
});
```

## Name collision/resolution

Because the first argument will have a pseudo-method, functions with the same name
cannot have the same arguments. To avoid collision we introduce a "do not export"


### functions in modules.

Just as a brief introduction, functions in modules has special keyword to specify
their behavior.

* `export fn` allow a function to be used outside the module
* `export fn new` constructor of the module
* `export fn delete` destructor of the module

### documentation

Compiler can generate documentation based on comments preceding a functions, also can get types.

The following two examples are identical

```plee
/**
* @param ui8 x
* @param ui8 y
*/
fn x, y {

}
```

```plee
fn ui8 x, ui8 y {

}
```


### #run

Compile time function running
