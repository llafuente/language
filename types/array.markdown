## array

Note: Arrays are always dense.
Note: Assign a pointer to something in the array it's only possible if fixed_size = true

### Initialization

```
array [ui64:length] [bool:fixed_size]
```

* length: initial length
* fixed_size: cannot be resized

```
var ar1 = [];
var ar2 = new number[5];
var ar3 = clone other_array;
var ar4 = [x, y, z]; // x y & z must have the same type.


ar1[3] = 0; // compiler not know the implicit type
ar1.toJSON(); // [null, null, null, 0]
```

The compiler will decide the type of the array with a simple rule: Type of the first insertion.

* Will raise a warning if no implicit conversion is made, when possible information loss. for example: ui64 -> ui32

### Instances properties

* `length`

  readonly. Number of elements.

* `size`

  readonly. Reserved memory.

* `last`

  Last element in the array, no more array[array.length -1]

* [**index**:**ui64**]

  Access to given index.

### Transformations

* `toString`

  Return the JSON representation.

* `toNumber`

  Return the length.

  [**STUDY**] This could lead to problems but could avoid check against `array.length`

* `toObject`

  Return a new Object will keys as Ids

 // change id-property and returned as Object

.for: -> raise runtime error
.switch: -> raise runtime error
.is: // memory position check -> check length. if the same, loop every item and do `this[i] is that[i]`

* `concat` (**other**:**array**)

  Returns a new array comprised of the array on which it is called joined with the array(s) and/or value(s) provided as arguments.

  Must have at least one argument, use `clone` instead.

* `append`

  Returns current array joined with the array(s) and/or value(s) provided as arguments.

* `join` (**separator**:**string**)

  Return a string resulting of join all elements with given separator.

`last_index_of`(**search_element**:void, **from_index**:**ui64** = length)

  Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex (length by default)

* `index_of`(**search_element**: void, **from_index**:ui64 = 0)

  Returns the first index at which a given element can be found in the array, or -1 if it is not present.

* `has_any`(**searchArray**: array)

  Returns if any of the values in searchArray is contained in the array.

* `reverse`()
* `sort`()
* `splice`(**index**:ui64, **howMany**:ui64, **elements**:array ...)

  Changes the content of an array, adding new elements while removing old elements

* `shift`()
  Removes the first element from an array and returns that element. This method changes the length of the array

* `slice`(**begin**:ui64, **end**:ui64 = length)
  Returns a shallow copy of a portion of an array into a new array object

* `pop`()

  Removes the last element from an array and returns that element

* `push`(**elements**:array ...)

  Adds one or more elements to the end of an array and returns the new length of the array

* `unshift`(**elements**:array ...)

  Adds one or more elements to the beginning of an array and returns the new length of the array.

* `fill`(**value**:any ...)

  Fill the array (all size reserved) with the given value.



### loping

For evey function listed here if the function is anonymously declared, the compiler will transform them into a blocks for performance.

* `every` (**callback**: function)

  Tests whether all elements in the array pass the test implemented by the provided function.

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array. And must return a boolean.

* `filter` (**calback**: function)

  creates a new array (with the original length) with all elements that pass the test implemented by the provided function.

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array. And must return a boolean.

* `for_each`  (**calback**: function)
* `each` (**calback**: function)

  Executes a provided function once per array element

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array.

* `map`(**calback**: function)

  creates a new array with the results of calling a provided function on every element in this array.

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array. And must return the same value that the array contains.

* `mapme`(**calback**: function)

  Same as map but without array creation.

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array. And must return the same value that the array contains.

* `reduce`(**calback**: function)

  Applies a function against an accumulator and each value of the array (from left-to-right) has to reduce it to a single value.

  The callback will recieve 4 parameters: **previousValue**:void, **currentValue**:void, **index**:ui64, **array**:array. Returned value is defined by the callback itself.

* `reduceRight`(**calback**: function)

  Applies a function against an accumulator and each value of the array (from right-to-left) has to reduce it to a single value

  The callback will recieve 4 parameters: **previousValue**:void, **currentValue**:void, **index**:ui64, **array**:array. Returned value is defined by the callback itself.

* `some`(**calback**: function)

  Tests whether some element in the array passes the test implemented by the provided function

  The callback will recieve 3 parameters: **element**:void, **index**:ui64, **array**:array. And must return a boolean.


### Notes

* if type is defined, when enter a switch gives a compile error.
