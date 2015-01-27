## struct & union

Structs are complex data type declaration
that defines a physically grouped list of variables and
functions to be placed under one name in a block of memory.

Unions are different layouts of the same block of memory. Only one
should be used at a given time. the size will be the minimum required
to store any layout (biggest of all)

Functions have direct access to those variables in the group by their name if no collision occur, and using `struct_name.property` otherwise

Pointer variables can be reserved, resized but not deleted.
Their memory is owned by the struct, and memory will be
freed when the struct is deleted.
If you need to free a pointer memory inside a struct,
use `resize xx.xx[0]`.

### Syntax

```syntax
struct-declaration
('compact')? 'struct' var-identifier (',' var-identifier)? block-body

union-declaration
'struct' var-identifier block-body

block-body
'{' (var-declaration ';'|fn-declaration)+ '}'
```

<a name="struct-example"></a>
```plee
struct v2 {
  var number x = 0;
  var number y = 0;

  fn add _x, _y {
    // notice that v2.x point to x member and not the global variable.
    v2.x += _x;
    // but v2 can be avoided if no name collision
    y += _y;

    return v2;
  }
};

fn add v2 v, _x, _y: v2 {
    v.x -= _x;
    v.y -= _y;

    return v;
}

var v2 instance;
instance.add(5, 6);
log instance.x; // stdout: 5
log instance.y; // stdout: 6

instance.subtract(5, 6);
log instance.x; // stdout: 0
log instance.y; // stdout: 0
```

see [with](#with) statement for access shortcuts.

### index/property access

A struct can be access by index (like arrays) or named properties.

```plee
assert v2[0] == v2.x;
assert v2[1] == v2.y;
```

The struct itself have some extra properties

```plee
assert v2.length == 2;
assert v2.properties == ["x", "y"];
assert v2.types == ["number", "number"];
assert v2.size == 8; // bytes
```

### extends

Simple struct inherance.

### compact

Compact will shrink the memory footprint of the struct to the
minimum.

* Sorting properties (reducing paddings)
* merging bools into bitmask.

Why `compact` is not by default? It increase performance...

Because break save/load binary data compatibility, adding a new property at the end could break your code.

`compact` is just to show you how to re-arrange your struct. use
`log` how your struct is in memory.

In contrast it's useful with `extends`, because it will rearrange all
properties, but, remember that


```plee
struct v2 { var ui8 x; var ui8 y; };
compact struct v3c extends { var ui8 z; };
struct v3 extends { var ui8 z; };

// init ordered
v3c vecc3(1,2, 3);

// init by name
v3 vec3(x: 1, y: 2, z: 3);

v2 vec2 = (vec2) v3; // this is valid

```

```plee-err
// v3c cannot be downcasted, because is compact
v2 vec2_err = (vec2) v3c;
```

### parser

* `#set lazy_struct_var 1`

  optional `var` inside struct, more like c

### implementation notes

Functions inside the struct must be hoisted outside the struct and
prepend a new argument of the struct type with the struct name.
Because functions can be called as classy and functional
this remove complexity to the compiler once more and move
it to parser.
