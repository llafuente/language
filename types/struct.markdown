## struct

Complex data type declaration that defines a physically grouped list
of variables and functions to be placed under one name in a block of memory.

Functions have direct access to those variables in the group by their name.

Pointer variables can be reserved, resized but not deleted. The memory is
owned by the struct, and memory will be freed when the struct is deleted.
If you need to free a pointer memory inside a struct, use resize with 0 length.
If the memory do not own the struct, tell the compiler using `ext`.

`struct` can be considered as a basic Object Oriented programming paradigm.


### Syntax

```syntax
struct-statement
'struct' var_identifier block-body

block-body
'{' (var_declaration|fn_declaration)+ '}'
```

```plee
struct v2 {
  var number x = 0;
  var y = 0; // implicit type -> number
  ext rawp y; // implicit type -> number

  fn add _x, _y {
    // notice that v2.x point to x member and not the global variable.
    v2.x += _x;
    v2._y += _y;
  }
};

var v2 instance;
instance.add(5, 6);
log instance.x; // stdout: 5
log instance.y; // stdout: 6
```

I'm a lazy programmer and dont like to type var inside structs...
Use `#set lazy_struct_var 1` in your start program.


**compiler-notes**

Functions inside the struct must be hoisted outside the struct. After prepend
a new argument of the struct type with the struct name.
Because functions can be called as classy and functional this remove complexity
to the compiler once more and move it to parser.
