### Variables

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

`c-style` conversion

```plee
var x = (ui8) 0;
```


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

  Arrays are dense-memory continuous data of one kind.

  [array in details](#array-type)


* `object`

  Dynamic key-value structure data of one kind.

  [object in details](#object-type)

* `box`

  Wrap a variable with it's type (aka Variant)

  Now box can be used in an array/object to store heterogeneous data.

  [box in details](#box-type)

#### Type template

  Type template allow to narrow type inference to a compatible types.

  * `function`, `fn`

  Match to a function (anonymous or not) any number of arguments or
  return type.

  * `number`

  Match to a numeric types. Default: `f32`

  * `any`

  Can be anything, it's the same as not specify the type.

#### Type definition


#### Type Wrapping

  A wrapper add, overwrite and disallow operators given a specific type.
  Also if a function is defined using both the wapper<type> and type,
  wapper<type> will have higher priority and will be used.

  * `ptr`, `ref`, `itr`

  Require a sub-type (that will be templated).
  There are all the same, pointer to a type, but functionality
  is very different.

  [pointers in detail](#pointers-type)

  * `array`

  Arrays are dense-memory continuous data of one kind

  * `object`

  Dynamic key-value structure data of one kind.





#### variables in modules.

Just as a brief introduction, variable in modules has special keyword
to specify their behavior.

* `export var` allow a variable to be accessed outside the module
and modified
* `export const` allow a variable to be accessed outside the module


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
