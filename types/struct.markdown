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
'{' (var-declaration ';'|fn-declaration)+ '}'
```

```plee
struct v2 {
  var number x = 0;
  var number y = 0;

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

### index/property access

A struct can be access by index (like arrays) or named properties.

```plee
assert v2[0] == v2.x;
assert v2[1] == v2.y;
```

I'm a lazy programmer and dont like to type var inside structs...
Use `#set lazy_struct_var 1` in your start program.


**compiler-notes**

Functions inside the struct must be hoisted outside the struct. After prepend
a new argument of the struct type with the struct name.
Because functions can be called as classy and functional this remove complexity
to the compiler once more and move it to parser.
