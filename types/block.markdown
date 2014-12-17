##block

It's the same as struct but memory continuous.

The advantage in performance has a counter part of fixed size. A single pointer cannot be resized after the first reserve.

```plee
block identifier [, pointer_name] {
  // variables
  // functions
};
```

Example
```plee
block blk ptr1, ptr2 { // specify the order, if leave it blank, declaration order will be asumed
  "ptr1": p1,
  "ptr1": p2,
};

var x = new blk[10, 10];
// can be resized as a group
resize x[15, 10]; // this will allocate, copy and free the old memory.

resize x.ptr1[15]; // compilation error
resize x.ptr1[0]; // compilation error
delete x.ptr1[15]; // compilation error
```
