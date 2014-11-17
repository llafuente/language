### Types

Types are case sensitive. All types in the language and functions are lowercased.

#### Primitives

* **bool**

  There are only two Boolean values, `true` and `false`.

* **number**

  Mutable-multipuporse number. Increase it's size as needed / overflow happens.

  Will be i64 until floating point is needed and change it's type to f64.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* **i8, i16, i32, i64(int), ui8, ui16, ui32, ui64**

  Integers and unsigned integers of different sizes.

  Note: If any calculation produces and error `nan` (`not a number`) will be returned.

* **f32(float) & f64**

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

* **bin[X]**

  binary data of given number of bytes.

* **stream:type**

  Wrapper for a given subtype that allow processing in chunks.

* **null**

#### Type properties

**iterable**
> has some special methods like: each, filter, reduce...
> Can be directly used inside a `for-in` loop

**thread-block**
> A thread can block the usage for the rest of the threads.
> When a thread want to use it, first must wait the lock.

**shared-ptr**
> Reference-counted shared pointer.
> when a variable references counter add 1
> when a variable is deleted counter subtract 1