## array

* Arrays are always dense.

* Arrays always contains a common type

* Assign a pointer to something in the array it's only possible
if fixed size.

```syntax
array-literal
"[" array-item-list "]"

array-item-list
assignament-expression ("," assignament-expression)
```

### Declaration & Initialization

* dynamic arrays use 'var' declaration.
* static arrays use 'static' declaration.

dynamic stack array

> var *type*[*size*] var-identifier = [*values*]

static stack array

> static *type*[*size*] var-identifier = [*values*]

dynamic heap array

> var var-identifier = *new* *type*[*size*]

> var *type*[*size*] var-identifier = *new* [*values*]

static heap array
> static var-identifier = *new* *type*[*size*]

> static *type*[*size*] var-identifier = *new* [*values*]

Some examples will give you some insights.

```plee
// array initializations examples

// dynamic arrays
var stack_dynamic = []; // empty size=0
var stack_dynamic2 = [1, 2]; // array size=2 type is number[]
var ui8[15] stack_dynamic3 = [1, 2]; // length=2, size=15

var heap_static = new ui8[10]; // array size=10
defer delete heap_dynamic; // defer delete so we don't forget

// static arrays
static ui8[10] stack_static; // size=10
static heap_static = new ui8[10]; // 10 numbers
defer delete heap_static; // defer delete so we don't forget

// multi-dimensional arrays
var mul_dyn_ar = [[1], [1]];
// **STUDY** this is ugly
var mul_st_ar = ui8[2][2]; // 2x2


// clone an array
var dyn_ar = clone dyn_ar2;

// index access
log dyn_ar[0]; // stdout 1

var dyn_ar_sl = [1, 2, 3];
// static slice, reference same memory
var st_slice = dyn_ar_sl[0:2];
// dynamic slice, clone the memory
var dyn_slice = dyn_ar_sl.slice(0, 2);

assert (st_slice.length != dyn_ar_sl.length) || (dyn_slice.length != dyn_ar_sl.length);

st_slice[0] = 1;
dyn_slice[0] = 2;

assert st_slice[0] == dyn_slice[0];

```

### multi-dimensional implementation (compiler-notes)

`multi-dimensional` arrays are a different type, that is not directly
exposed to user.

To be performance, must be memory continous, parser cannot solve this problem if the array is not fixed-size, so need to be solved as compile-runtime.

**Study** this lead to some problems.
All array functions must has an offset/length, to work on continuous memory. for example:

```plee
var ar = ui8[5][6];
ar[1].indexOf(0);

// will be compiled to
ar.indexOf(0, 6, 12);
```


### Array instance properties

* `length`

  readonly. Number of elements.

* `size`

  readonly. Reserved memory (bytes)

* `last` (shortcut)

  Last element in the array, no more array[array.length -1]

* \[**index**:**ui64**] (shortcut)

  Access to given index

* `index` (ui64 pos, ...)

  Get the value in the given pos.
  If the array is multi-dimensional

### transformations/transcoding

* `to_string`

  Return the JSON representation.

* `to_number`

  Return the length.

  **STUDY** This could lead to problems but could avoid check against `array.length` for lazy people...

* `to_object`

  Return a new `object` with indexes as keys (casted to string),
  values as values.

<!--
 // change id-property and returned as Object

.for: -> raise runtime error
.switch: -> raise runtime error
.is: // memory position check -> check length. if the same, loop every item and do `this[i] is that[i]`
-->

### array functions

**STUDY** i have to add *any* as type, because `index_of` neede it.
But is this possible in our type-system?
Also sort... could lead to some problems...
Even with type inference, some types could need something special...

* `concat` (*array* ar, ...)

  Returns a new array comprised of the array on which it is called joined with the array(s) and/or value(s) provided as arguments.

  Must have at least one argument, use `clone` instead.

* `append`

  Returns current array joined with the array(s) and/or value(s) provided as arguments.

* `join` (*string* separator)

  Return a string resulting of join all elements with given separator.

* `last_index_of`(*any* search_element, *ui64* from_index = length)

  Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex (length by default)

* `index_of`(*any* search_element, *ui64* from_index = 0)

  Returns the first index at which a given element can be found in the array, or -1 if it is not present.

* `has_any`(*array* search_array)

  Returns if any of the values in searchArray is contained in the array.

  alias: `contains`

* `reverse` ()

  Reverse array.

* `sort` (*fn* func)

  sort your array.

  func must return a ui64.

  * negative means lesser
  * 0 equal
  * position means greater

* `splice` (**ui64** index, **ui64** how_many, **array** elements, ...)

  Changes the content of an array, adding new elements while removing old elements

* `remove` (**any** element, **ui64** how_many, **array** elements ...)

  Changes the content of an array, adding new elements while removing old elements

* `shift` ()

  Removes the first element from an array and returns that element. This method changes the length of the array

* `slice` (**ui64** begin, **ui64** end = length)
  Returns a shallow copy of a portion of an array into a new array object

* `pop` ()

  Removes the last element from an array and returns that element

* `push` (**any** element, ...)

  Adds one or more elements to the end of an array and returns the new length of the array

* `insert` (**any** element, **ui64** index)

  Insert an element into the given position.

* `unshift` (**any** element, ...)

  Adds one or more elements to the beginning of an array and returns the new length of the array.

* `fill` (**any** value)

  Fill the array (all size reserved) with the given value.



### looping

For evey function listed here if the function is anonymously declared, the compiler will transform them into a blocks for performance.

* `every` **array** arr, **fn** callback(**any** element,
**ui64** index, **array** arr) : boolean

  Tests whether all elements in the array pass the test implemented by the provided function.


* `filter` **array** arr, **fn** test(**any** element,
**ui64** index, **array** arr)) : array

  Modify *arr* removing all elements don't pass the test
  implemented by the provided *test* function.

* `for_each` **array** arr, **fn** callback(**any** element,
**ui64** index, **array** arr)

  Executes a provided function once per array element

  alias: **each**

* `map` **array** arr, **fn** callback(**any** element,
**ui64** index, **array** arr)

  Modify *arr* with the results of calling a provided function
  on every element in this array.

  The callback must return the same value that the array contains.

* `reduce` **array** arr, **fn** accumulator(**any** previous_el,
**any** current_el, **ui64** index, **array** arr) : **any**

  Applies a function against an *accumulator* and each value of
  the array (from left-to-right) has to reduce it to a single value.

  Returned value is defined by the callback itself.

* `reduce_right` **array** arr, **fn** accumulator(
**any** previous_el, **any** current_el, **ui64** index,
**array** arr) : **any**

  Applies a function against an *accumulator* and each value of
  the array (from right-to-left) has to reduce it to a single value.

  Returned value is defined by the callback itself.

* `some`  **array** arr, **fn** callback(**any** element,
**ui64** index, **array** arr)

  Tests whether some element in the array passes the test implemented by the provided function

<a name="array-iterators"></a>
### iterators

`for-itr` need an iterator that behave. These are their rules:

* When remove an object, all iterators need to be notified.
And if the element is the current element of someone, the next will have the same ID (do not increment)

```
var a = [1, 2, 3];
var itr1 = a.iterator();
var itr2 = a.iterator();
itr1.next();
itr2.next();

// remove current object
itr2.remove();

// this is not an alias of
// a.splice, has the extra logic to keep iterator sane
// splice NOT!

log itr1; // stdout: 2
log itr2; // stdout: 2

itr1.next();
itr2.next();

log itr1; // stdout: 3
log itr2; // stdout: 3
```

* splice/push

### Notes

* if type is defined, when enter a switch gives a compile error.
