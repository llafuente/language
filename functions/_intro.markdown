# Functions

Main philosophy behind:

* [Function overloading](http://en.wikipedia.org/wiki/Function_overloading) allowed
* [Anonymous function](http://en.wikipedia.org/wiki/Anonymous_function) allowed
* Everything is sent by reference.


## Functions identifier/name rules

* Cannot start with a number
* Cannot start with a $
* Any UTF-8 valid character

Can I use `+` as function name... The answer is: *Yes*, we can.

## Function declaration

```
// shortest example
fn sum(x, y) {
    return x + y;
}
```

* Argument type are optional (sometimes)
* Return is optional (sometimes)
* fn and function are alias


Compiler will try expand to its full form, or complain if something is missing.

```
function sum(x:Number, y:Number) -> Number {
    return x + y;
}
```


## Call

Plee has two ways of calling functions. Classic and ~Prototypes/Objects like.

```
log sum(5, 6);
// stdout 11

log 5.sum(6);
// stdout 11

// even lazier, no parenthesis
log 5 .sum 6;
// stdout 11

```

The first argument can be used as a classy-method-prototype.

Compiler will translate those *lazy forms* to the full.

## Operator functions

Operator function can be used as a shorthand with two purposes:

* Modify the first argument
* Return a new Argument

```
var vec2 = require("v2"); // mod type is v2
var va = new vec2(1, 1);
var v_ra = new vec2(1, 1);
var v_rb = new vec2(1, 1);

function +(x:v2, y:v2) {
    x.x += y.x;
    x.y += y.y;
}

function +(x:v2, y:v2) -> v2 {
    x.x += y.x + 10;
    x.y += y.y;

    return /*clone */ x;
}
// first call
va + va; // v will be modified now (2,2)

// second call
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

## `function` arguments details

Function as argument could lead to variety forms of "hacking the language", because a function
is no more than a block of code.







```
// declaration
function each(ar:array, code:function) {
    var i = 0,
        max = ar.lenth;

    for (i = 0; i < max; ++i) {
        code(ar[i], i);
    }

}

// execution

var arr = [1, 2, 3, 4];

arr.each {
    var value = $0;
    var key = $1;

    log key, value;
};
// stdout: 11
// stdout: 22
// stdout: 33
// stdout: 44

```

## Name collision/resolution

Because the first argument will have a pseudo-method, functions with the same name
cannot have the same arguments. To avoid collision we introduce a "do not export"


## #run

Compile time function running