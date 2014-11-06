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
var ar2 = array(5 /*ui64 length*/)
var ar3 = clone other_array;
var ar4 = [x, y, z]; // x y & z must have the same type.


ar1[3] = 0;
ar1.toJSON(); // [null, null, null, 0]
```

The compiler will decide the type of the array with a simple rule: Type of the first insertion.

* Will raise a warning if no implicit conversion is made, when possible information loss. for example: ui64 -> ui32



### Instances properties

* .length // readonly
* .last // pointer to the last object, no more array[array.length -1]
* [index]

### Transformations
* toString

  Return the JSON representation.

* toNumber

  Return the length.

  [STUDY] This could lead to problems but avoid check against .length

* toObject

  Return a new Object will keys as Ids

 // change id-property and returned as Object

.for: -> raise runtime error
.switch: -> raise runtime error
.is: // memory position check -> check length. if the same, loop every item and do `this[i] is that[i]`

.concat // create a new array concatenathing this+that
.join // implode array calling toString of every item joined by given glue
.lastIndexOf

.indexOf
.contains

// loops
.every
.filter
.forEach|.each
.map
.reduce
.reduceRight
.reverse
.some
.sort
.splice

.shift
.slice
.pop
.push
.unshift


Notes

* if type is defined, when enter a switch gives a compile error.



### filter
### indexOf
### contains