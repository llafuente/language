### types

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

* variable declaration without type and initialization

  variable will get the type that the initialization return.

* variable declaration without type.

  Search any operation until narrow type to one.

  * assignament (lhs)

  Will get the resulting type of rhs.

  *Note:* "unboxing" require a type on lhs so it will raise a compile-error.

  * function call parameter

  Will get the type of the function argument if defined

  * return statement

  Will get the type of the return type of the function if defined

  * expression (narrow type)

  Compiler will search for a list of compatible types for an operation and
  annotate them, for future checks.

  operator+ example have a valid input of number/array/string


* function arguments
There are two cases.

  * without a type

  Use the same logic as *variable declaration without type*

  * template a type (number, function, struct)

  Use the same logic as *variable declaration without type* but
  type must be compatible with the template

If there is not enough information inside the function,
compiler will generate multiple compatible function depending on
function calls.

* function return

  Search all return statements

  * all same type: use that type
  * some are incompatible: use box and compiler should warning to
  the user to fill box as return type.


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

But won't grow in left hand side.

```plee-err
var x = 0; // ui64
var y = 0.1; // float
x = x + y; // float
```

#### invalid explicit conversions

Some conversion are meant to be used as a direct function call.

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



#### special type functions

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

### `__types`

`__types` contains all type information from your entire program,
modules included same model used in AST but using structs.
