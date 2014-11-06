### Types

Types are case sensitive. All types in the language and functions are lowercased.

#### Primitives

* bool

  There are only two Boolean values, `true` and `false`.

* number

  Mutable-multipuporse number. Increase it's size as needed / overflow happens.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* i8, i16, i32, i64, ui8, ui16, ui32, ui64

  Integers and Unsigned integers of different sizes.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* f32 f64

  Primitive value corresponding to a single/double-precision 32/64-bit binary format IEEE 754 value.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* function

  Function as type. Unlike other languages arguments doesn't matter.

* string

  Primitive value that is a finite ordered sequence of zero or more 16-bit unsigned integer

  * iterable

#### Data aggregation

* array

  List of things, this is continuous memory and should have a defined type, cannot contains different things (unless store you pointers).

  * iterable
  * thread-block
  * GC

* struct

  Constant structured data.

  * iterable
  * thread-block
  * GC

* block

  It's the same as struct but memory continuous.

  * iterable
  * thread-block
  * GC

* object

  Mutable structured data. You could add/remove properties.

* p1, p2, p3, p4

  Points to something, directly in memory with given byte size.

  * alloc
  * dealloc
  * realloc
  * copy

* stream

* bin

  binary data, just a pointer with size.

* null

Note: thread-block means, once a thread declared the use of this variable, if other thread ask about it, it has to wait.