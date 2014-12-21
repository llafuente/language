##block

It's the same as struct but memory continuous.

The advantage in performance has a counter part of fixed global size.
`new` and `resize` need to know all sizes.

Syntax

```syntax
block-declaration
'block' var_identifier block-body;

block-body
'{' (var_declaration|fn_declaration)+ '}'
```

Example
```plee

// declaration
block blk {
  var array ptr_a;
  var array ptr_b;
};

// initialization
var x = new blk[10, 10];
var blk y(10, 10); // shortcut

// can be resized
resize x[15, 10]; // this will allocate, copy and free the old memory.

// error you could expect
resize x.ptr_a[15]; // compilation error
// block property cannot be resized, because it's memoty continuos
// try to resize the entire block

resize x.ptr_a[0]; // compilation error
delete x.ptr_a[15]; // compilation error
// block property cannot freed, you must free the entire block
```
