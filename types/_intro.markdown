### Types.

* Variable declaration require the keyword **var**.
Some languages allow declaration of variables prefixed its type,
that could be messy, and not easy to read.
For readability plee enforce the use **var** or **const**
* Lazy typed: plee is a *strong type* language, the compiler will identify
your types from the code you write or complain when something is missing.
* All types in the language lowercased.

#### Type inference.

* Initialization

  ```plee
  var a = 0; // i64
  var b = 0.0; // float
  var c = [1, 2, ""]; // compile-error, 3rd parameter is incompatible with the other
  var d = [1, 2, 3]; // array of i64, size=3
  var e = a; // also: i64
  ```

* Operators

  Resolve the type based on operation over the variable.

  ```plee
  var x = 0, y = 0; //i64
  var z = x + y;
  ```

* function arguments

  ```plee
  fn sum ui8 x, ui8 y : ui8 {
      return x + y;
  }
  ```


#### implicit type conversion

A type can only grow in precision.

```plee
var x = 0; // ui64
var y = 0.1; // float
var z = x + y; // float
```

#### explicit type

```plee
var i64 x;
var string str;
```

#### explicit type conversion

* Using type operators, parenthesis is required most of the times...

```plee
ui64 x = (ui64 0.0);
```

* `to_*` functions

```plee
ui64 x = to_ui64(0.0);

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


#### Variable identifier/name rules

* Cannot start with a number
* Cannot contains: `$`, `.`, `(`, `)`, `[`, `]`, `{`, `}`, `"`, `'`, `@`
* Cannot be a reserved word
* Any UTF-8 valid character

#### Primitives

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

* **string**

  Primitive value that is a finite ordered sequence of zero or more 16-bit unsigned integer

  *Properties:*
  * iterable
  * shared-ptr

#### Data aggregation, complex types.

* **array**

  List of things, this is continuous memory and should have a defined type, cannot contains different things (unless pointers are stored).

  *Properties:*
  * iterable
  * thread-block
  * shared-ptr

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

* **object**

  Mutable structured data. You could add/remove members.

  *Properties*
  * iterable
  * thread-block
  * shared-ptr

* **p1, p2, p3, p4**

  Pointer of different sizes (bytes).

  There are two types of pointer.

  * Pointer to iterate, those that use memory already allocated.
  * Pointer to mange memory, those that allocate memory

  *Members:*
  * .start
  * .end
  * .length

  *Properties:*
  * alloc / new
  * dealloc / delete
  * realloc / resize
  * copy

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
