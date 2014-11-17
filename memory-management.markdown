## Memory management

### new

Allocate memory.
Memory will be deleted at the end of the block if the variable that own that memory is destroyed.

```
{
    var x = new ui8[10];
}
// x doesn't exists, and the memory is freed

{
    var y;
    {
        var x = defer new ui8[10];
        y = x;
    }
    // x doesn't exists, but the memory ownership is transfered to y
}
// now y is deleted, and memory freed
```

examples:

```
var ptr_str_10 = new string[10]; // array with 10 strings
var ptr_i_10 = new number[10]; // array with 10 numbers
var ptr_i_10x10 = new number[10][10]; // allocate a 10x10 numeric matrix

var str = new string(10); // string with 10 size, 0 length

var stru_test = new struct_test; // allocate a struct
var blk_test = new block_test(10, 5); // allocate a block with first ptr 10 and second 5
var blk_test_5 = new block_test(10, 5)[5]; // allocate a list of 5
```

### resize

Reallocate memory block.

```
var x = new string(10); // string with 10 size, 0 length
x = "say hello";
log x; // stdout: say hello

x = resize string(20); // string with 20 size, 0 length
log x; // stdout: say hello

```

Resize can be used as soft delete when used with 0.
When allocating some structures, like strings it allocate not only the space
for the "string itself" also some numbers, pointers. `resize string(0)` will
free the pointer while leaving the string to be accesible.

### delete

Free memory.


```
delete x;
```

### copy

Copy will create a new pointer, allocate the same amount of memory, and copy the memory in it.

```

var arr = [];
arr[10] = 100; // arr is resized to 10
arr.splice(2); // arr length = 2

var narr = copy arr;
log narr.length; // stdout: 2
log narr.size; // stdout: 10
log arr.size; // stdout: 10

```

If length is provided to copy, will allocate and copy

```

var arr = [];
arr[10] = 100; // arr is resized to 10
arr.splice(2); // arr length = 2

var narr = copy arr[7];
log narr.length; // stdout: 2
log narr.size; // stdout: 7
log arr.size; // stdout: 10

```

### clone

Will allocate and copy the minimum structure needed to replicate the same structure.

```

var arr = [];
arr[10] = 100; // arr is resized to 10
arr.splice(2); // arr length = 2

var narr = clone arr;
log narr.length; // stdout: 2
log narr.size; // stdout: 2
log arr.size; // stdout: 10

```



### avoid memory leaks

Most of the time, leaks comes when allocating arrays. Array is implement like shared
pointer so when anybody reference it, it will automatically be deleted.