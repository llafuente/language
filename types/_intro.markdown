### Variables & types.

#### Keypoints

* [Type introspection](http://en.wikipedia.org/wiki/Type_introspection)

* Required keyword (var, const, unvar) for readability.

* [Type inference](http://en.wikipedia.org/wiki/Type_inference)

* Types lowercased.

* Auto scope. Compiler will choose between function or block scope.

#### Syntax

```syntax
var-declaration
'export' ('const'|'var'|'unvar'|'static') (var-declarator)+;

var-declarator
type? var-identifier ('=' (expression|literal))? (',' var-declarator)*
type var-identifier '(' argument_list ')' (',' var-declarator)*
```

* `const` for constants
* `var` for variables implicit initialized to default values
* `unvar` for un-initialized variables

examples:

```plee
var a = 0; // i64 (default compiler option)
var b = 0.0; // float (default compiler option)

var d = [1, 2, 3]; // array of i64, size=length=3
var e = a; // same type as a

var ui64 e; // also: i64
log e; // stdout: 0
```

#### Type inference.

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
  * function arguments



  ```plee
  fn sum ui8 x, ui8 y : ui8 {
      return x + y;
  }
  ```


#### implicit type conversion

A type can only grow in precision on left hand side.

```plee
var x = 0; // ui64
var y = 0.1; // float
var z = x + y; // float
```

But will not grow in right hand side.

```plee-err
var x = 0; // ui64
var y = 0.1; // float
x = x + y; // float
```

#### explicit type

```plee
var i64 x;
var string str;
```

#### explicit type conversion

`to_*` functions

```plee
var ui64 x = to_ui64(0.0);
```

#### invalid explicit conversions

| from | to | description |
|---|---|---|
| array | string | compiler will complain an offer a solution: use join |
| function | * | functions cannot be casted |
| string | function | compiler will complain an offer a solution: use call operator |
| object | array | not allowed **TODO** study |
| object | block | compiler will complain an offer a solution: use copy operator |
| block | object | compiler will complain an offer a solution: use call operator |
| block | * | not allowed |
| struct | block | compiler will complain an offer a solution: use copy operator |

<a name="var-idenfiers"></a>
#### Variable identifier/name rules

* Cannot start with a number
* Cannot contains: `$`, `.`, `(`, `)`, `[`, `]`, `{`, `}`, `"`, `'`, `@`
* Cannot be a reserved word
* Any UTF-8 valid character

#### Primitives

A primitive is data in the most simple way. It just map memory and don't
have extra logic.

* **bool**

  There are only two Boolean values, `true` and `false`.

  But there some aliases:

  * `true`: `on` & `yes`

  * `false`: `of` & `no`

  Those aliases give more expressiveness to the language.

* **number**

  Mutable-multipuporse number. Increase it's size as needed / overflow happens.

  Will be i64 until floating point is needed and change it's type to f64.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* **i8, i16, i32, i64 (int), ui8, ui16, ui32, ui64 (uint)**

  Integers and unsigned integers of different sizes.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* **f32 (float) & f64**

  Primitive value corresponding to a single/double-precision 32/64-bit binary format IEEE 754 value.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* **function**

  Function as type. Unlike other languages arguments doesn't matter.

  *Properties:*
  * length: number of arguments
  * arguments: list of arguments

* **string**

  Primitive value that is a finite ordered sequence of zero or more 16-bit unsigned integer

  *Properties:*
  * iterable
  * shared-ptr

* **regexp**

  Perl Compatible Regular Expressions

* **struct**

  Constant structured data.

  *Properties:*
  * iterable
  * thread-block
  * shared-ptr

* **block**

  It's the same as struct but memory continuous.

  When you allocate a block you must specify every length in the block.

  *Properties:*
  * iterable
  * thread-block
  * shared-ptr

#### Data aggregation & complex types.

Complex types always have a subtype, that can be a primitive or a box.

* **box**

  Wrap a variable with it's type.

  Now box can be used in an array/object, and store heterogeneous data.

  [box in details](#box)

* **array**

  List of things, this is continuous memory and should have a defined type, cannot contains different things (unless pointers are stored).

  *Properties:*
  * iterable
  * thread-block
  * shared-ptr

  [array in details](#array)

* **object**

  Mutable structured data. You could add/remove members.

  *Properties*
  * iterable
  * thread-block
  * shared-ptr

  [object in details](#object)



<!--
* **bin[X]**

  binary data of given number of bytes.

* **stream:type**

  Wrapper for a given subtype that allow processing in chunks.
-->

* **null** & **nil**

  `null` is prefered as `nil` is introduce it just for laziness.

<!--
* **fnblock**

  Block of code. it could be considered as a function-body.
-->

#### Type properties

**iterable**
> Has some special methods like: each, filter, reduce...

> Can be directly used inside a `for-in` loop

**thread-block**
> A thread can block the usage for the rest of the threads.

> When a thread want to use it, first must wait the lock.

**shared-ptr**
> Reference-counted shared pointer.

> when a variable references counter add 1

> when a variable is deleted counter subtract 1

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
