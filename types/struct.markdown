## struct

Complex data type declaration that defines a physically grouped list
of variables and functions to be placed under one name in a block of memory.

Function have direct access to those variables in the group by their name.

Pointer variables can be reserved, resized but not deleted. The memory is
owned by the struct, and memory will be freed when the struct is deleted.
If you need to free a pointer memory inside a struct, use resize with 0 length.

Syntax

> **struct** *struct_identifier* {

> // Variable declaration

>  **var** [*type*] *var_identifier*[ = *initialization*]**;**

> // Function declaration

>  **fn** *fn_identifier* [*arguments*] {

>  }**;**

>};

Examples:
```
var x = 0;

struct v2 {
  var number x = 0;
  var y = 0; // implicit type -> number
  fn add _x, _y {
    // notice that v2.x point to x member and not the global variable.
    v2.x += _x;

    _y += _y;
  };
};
```
