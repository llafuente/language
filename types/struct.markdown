## struct

Complex data type declaration that defines a physically grouped list of variables and functions to be placed under one name in a block of memory.

Function have direct access to those variables in the group by their name.

Pointer variables can be reserved, resized but not deleted. The memory is owned by the struct, and memory will be freed when the struct is deleted. If you need to free a pointer memory inside a struct, use resize with 0 length.

```
struct identifier {
  member: type = initialization;
  //...
  method = fn [self] [arguments] {
    // self must be first, and cannot be overriden like other languages
    // remember that this does not exist
  }; // this time, semiclon is mandatory (atm)
};
```

Examples:
```
struct v2 {
  x:number = 0;
  y = 0; // implicit type -> number
  add = fn _x, _y { // if nothing is retrurned
    x += _x;
    _y += _y;
  }
};
```
