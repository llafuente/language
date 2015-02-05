<a name="struct-type"></a>
<a name="union-type"></a>
<a name="extends-type"></a>
## struct & union

Structs are complex data type declaration
that defines a physically grouped list of variables and
functions to be placed under one name in a block of memory.

Unions are different layouts of the same block of memory. Only one
should be used at a given time. The size will be the minimum required
to store any layout (so the biggest of all).

Functions declared inside a struct aren't in the memory block, it's just a
convenient way to group functions that act over a struct.
Those functions have direct access to the variables declared in struct if
no collision occur, and using `struct_name.property` otherwise.

Array variables can be allocated, resized but not deleted.
Their memory is owned by the struct, and memory will be
freed when the struct is deleted.
If you need to free their memory use `resize foo.bar[0]`.

### Syntax

```syntax
struct-declaration
('compact')? 'struct' var-identifier ('extends' var-identifier)? block-body

union-declaration
'union' var-identifier block-body

block-body
'{' ('merge'? var-declaration ';'|fn-declaration)+ '}'
```

<a name="struct-example"></a>
```plee
struct v2 {
  var number x = 0;
  var number y = 0;

  fn add _x, _y {
    // notice that v2.x point to x member and not a global variable.
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
assert v2.layout == [4,4]; // negative numbers means padding!
```

### extends

Simple struct inheritance.
Notice: A struct can be downcasted if nobody in the inheritance chain is `compact`.


### compact

Compact will shrink the memory footprint of the struct to the
minimum.

* Sorting properties (reducing paddings)
* merging bools into bitmask (maybe)

**Pros**

* low memory footprint
* usable with extends/union to pack many small structs.

**Cons**

* Could break save/load of binary data. if something change.
* The struct cannot be downcasted.

`compact` is usefull to know how to re-arrange your struct to be memory efficient
use `log <struct-name>` to see the result.


```plee
// start with a vector2
struct v2 {
  var ui8 x;
  var ui8 y;
};
// now declare two vectors3, one compact
compact struct v3c extends v2 {
  var ui8 z;
};
struct v3 extends v2 {
  var ui8 z;
};

// init ordered
var v3c vec3_c(1, 2, 3);

// init by name
var v3 vec3(x: 1, y: 2, z: 3);

// downcast v3
var v2 vec2 = (vec2) v3; // this is valid

```

```plee-err
// v3c cannot be downcasted, because is compact
v2 vec2_err = (vec2) v3c;
```

### parser

* `#set lazy_struct_var 1`

  optional `var` inside struct, more like c

### implementation notes

Functions inside the struct must be hoisted outside.
Then prepend a new argument of the struct type (by ref?)
with the struct name.
Because functions can be called as classy and functional
this remove complexity to the compiler once more and move
it to parser.
