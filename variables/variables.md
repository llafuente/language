### Variables & types.

<a name="var-idenfiers"></a>
#### Variable identifier, allowed names

A variable identifier can contain any valid UTF-8.

* Cannot start with a number

* Cannot start or end with an operator.

* Cannot be a reserved word

* Cannot be a defined type. Function/struct/block/... names are a type.


#### Stylistic Conventions

This are the rule that we use to develop the core.

* snake case
* use of "-" inside a variable is possible
but use it if there is a good reason, like writing css staff


#### Syntax

```syntax
var-declaration
'export' ('const'|'var'|'unvar'|'static'|'global') (var-declarator)+;

var-declarator
type? var-identifier ('=' (expression|literal))? (',' var-declarator)*
type var-identifier '(' argument_list ')' (',' var-declarator)*
```

* `const` for constants
* `var` for variables implicit initialized to default values
* `unvar` for un-initialized variables
* `static` for variables that cannot be resized
* `global` declare a variable in global scope

examples:

```plee
var a = 0; // f32 (default compiler option)
var b = 0.0; // f32 (default compiler option)

var d = [1, 2, 3]; // array of f32, size=length=3
var e = a; // same type as a

var ui64 e; // also: i64
log e; // stdout: 0
```

#### paradigms

* [Type introspection](http://en.wikipedia.org/wiki/Type_introspection)

  All primitives and complex types has a very verbose output with
  `log` for easy debugging. You also have access in runtime
  to some properties of how the type is declared printing it's type.

* Required keyword at declaration for readability purposes and easy
search

* [Type inference](http://en.wikipedia.org/wiki/Type_inference)

* Types lowercased.

* Auto scope. Compiler will choose between function or block scope.


#### Type inference.

Logic behind type inference as follow:

* variables
  * declaration + initialization

    variable will get the type that the initialization return.

  * declaration

    variable will get the type of the first assignment found.

    This cannot be used to "unbox" from array/object.

  * parameter

    if the variable is a parameter of a function will get it's type.

  * narrow type by operation

    Sometimes a variable will be in some operations and that can narrow it's type
    the compiler will anotate until only one is valid.

    for examples `a + b;` wont give most...
    Because can be used for numbers/arrays/strings but that remove modules and object!

* arguments
  There are two cases.

  * arguments without a type

  * arguments with complex types.

    Comples types require a primitive to be a complete type that can
    be compiled. The compiler will fill the gap with the calling types


* return
  Return type of a function is the type of all return statements found.

  box won't be allowed to be a return type unless user defined it.




```plee
fn sum x, y {
    return x + y;
}

sum(1 as u8, 2 as u8);
// will generate a new function with a compatible signature.
// fn sum ui8 x, ui8 y: ui8 {...}

```plee-err
var ui8 x = sum(1 as ui8, 1 as ui32);
// it will comlaint about resolution loss in x
// fn sum ui8 x, ui32 y: ui32 {...}

var ui8 x = sum(1 as ui8, [1] as ui8[]);
// compile-error: incompatible type operation found for: ui8 + ui8[]
```


#### implicit type conversion

A type can only grow in precision on right hand side.

```plee
var x = 0; // ui64
var y = 0.1; // float
var z = x + y; // float
```

But will not grow in left hand side.

```plee-err
var x = 0; // ui64
var y = 0.1; // float
x = x + y; // float
```

#### explicit type declaration

```plee
var i64 x;
var string str;
var i64[] x;
```

#### explicit type conversion

`to_*` functions

```plee
var ui64 x = to_ui64(0.0);
```

`as` operator

```plee
var x = 0 as ui8;
```

#### invalid explicit conversions

Some convertion are meant to be used as a function rather
than usign `as` operator.

| from     |    to    | description |
|----------|----------|-------------|
| array    | string   | invalid cast: use join |
| function | *        | invalid cast: functions cannot be casted |
| string   | function | invalid cast: use call function |
| object   | array    | invalid cast: use object.values or object.keys |
| object   | block    | invalid cast: use copy operator |
| block    | object   | invalid cast: use to_object |
| block    | array    | invalid cast use to_array |
| block    | *        | invalid cast: |
| struct   | object   | invalid cast use to_object |
| struct   | array    | invalid cast use to_array |
| struct   | *        | invalid cast |


#### Primitives / Basic types

A primitive are the standard types (most simple) types.

* `bool`

  There are only two valid boolean values: `true` and `false`.

  There some aliases to give more expressiveness to the language:

  * `true`: `on` & `yes`

  * `false`: `of` & `no`

* `i8`, `i16`, `i32`, `i64`, `ui8`, `ui16`, `ui32`, `ui64`

  Integers and unsigned integers of different sizes.

* `f32` & `f64`

  Primitive value corresponding to a single/double-precision 32/64-bit binary format in IEEE 754 representation.

* `string`

  Primitive value that is a finite ordered sequence of zero character.

* `null`, `nil`

  `null` is prefered as `nil` is introduce it just for laziness.

* `regexp`

  Perl Compatible Regular Expressions

* `enum`

  Type consisting in a list of key words.

* `thread`

  Thread identifier

* `resource`

  I/O identifier.

  for example: `stdout`, `stderr`, `stdin`.

#### Data aggregation

* `struct`

  Aggregate multiple data under a static list of keys.

  [struct in details](#struct-type)

* `block`

  It's the same as struct but memory continuous.

  When you allocate a block you must specify every length in the block.

  [block in details](#block-type)

* `bitmask`

  Primitive to pack booleans

  [bitmask in details](#bitmask-type)


#### Types wrappers

Wrapper always gives extra functionality to a basic type
without modifying the type itself, mostly change memory
representation/aggrupation and operarations/operator behaviors.

* `array`

  Dense memory-continuos data.

  [array in details](#array-type)


* `object`

  Dynamic key-value structure of a single type.

  [object in details](#object-type)

* `box`

  Wrap a variable with it's type (aka Variant)

  Now box can be used in an array/object to store heterogeneous data.

  [box in details](#box-type)

#### Primitive templates

  Templates on Plee don't follow the C++ rules.

  In C++ a template must be used in both sides: declaration and use.

  Plee divide templates in two styles. Type templating and Type wrapping

  *Type templating*

  Use a common name to define many subtypes

  * `function`, `fn`

  Match to a function (anonymous or not)

  * `number`

  Match to a numeric types. Default: `f32`

  * `any`

  Can be anything, it's the same as not specify the type.

  *Type wrapping*

  * `ptr`, `ref`, `itr`

  Requiere a sub-type (that will be templated). You always have
  a pointer to X

  [pointers in detail](#pointers-type)

  * `array`

  Array are dense-memory continuous data of one kind

  * `object`


#### Type properties


**iterable**
> Has some special methods like: each, filter, reduce...

> Can be directly used inside a `for-in` loop

**thread-block** (experimental)
> A thread can block the usage for the rest of the threads.

> When a thread want to use it, first must wait the lock.

**shared-ptr**
> Reference-counted shared pointer.

> when a variable references counter add 1

> when a variable is deleted counter subtract 1

STUDY: this can be done with a type wrapper...
maybe do not force users to use it by default


#### functions in modules.

Just as a brief introduction, variable in modules has special keyword
to specify their behavior.

* `export var` allow a variable to be accessed outside the module
* There is no way to export a *readonly* variable.

#### special functions

* `regexp_test`

  Give you support to include your type inside a switch with a regular expression
  test.

* `to_string`

  transform your type into an string.

* `to_number`

  Transform your type into a number.

* `to_log`

  Used by log. Native types include the type name before calling `to_json`.

  If the function is not defined, log will use `to_string` instead.

* `to_json`

  Give you support to enconding: `json`

* `operator` "assignament operators"

  Allow to use your type on left side of the assignament operators.

  All this calls will be inlined if possible.


### Auto scope

Auto scope refers to where your variable is available.

block scope

```plee
{
    var x;
}
// now x is not available.
```

function scope

```plee
fn read-file {
  var current_line = 0;
  fn next_line {
    ++current_line; // the compiler see this and use function scope
  }

  while (!eof()) {
    next_line();
  }

  log current_line;
}
```

Variable names must be unique at function scope.
So this is not possible.

```plee-err
fn a {
  var i;
  fn b {
    var i;
  }
}
```


### __types

__types contains all type information from your entire program,
modules included.
