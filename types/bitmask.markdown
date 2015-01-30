## bitmask

bitmask is a structure that pack booleans in the minimal space to
avoid cache misses. the bitmask can be merged inside a struct or used
separately.

Minimal space, means the minimum amount of memory necessary to
represent all booleans. 1-8 will be ui8, 9-16 ui16...

By default bitmask is allocated and initialized to 0.

```syntax
bitmask-declaration
'export'? 'expand'? "bitmask" var-identifier "{" bitmask-prop-list "}"  ";"

bitmask-prop-list
bitmask-prop ("," bitmask-prop)*

bitmask-prop
(group ":")? var-identifier ["=" boolean-literal]
```


```plee
bitmask week {
    is_monday = true,
    is_thursday,
    is_wenesday,
    is_tuesday,
    is_friday,
    is_saturday,
    is_sunday
};

var week v;
log v; // stdout: bm{is_monday = true}
week.is_tuesday = true;
log v; // stdout = bm{is_monday = true, is_tuesday = true}
```

bitmask also comes with a convenient way to define flags just by accessing it's members.
Also provides a method to define groups, only one bit property can be used.

```plee
bitmask file_flags {
  1: read = 0x0000,
  1: write =	0x0001,
  1: read_write = 0x0002,

  binary = 0x0004,	/* must fit in char, reserved by dos */
  text = 0x0008,	/* must fit in char, reserved by dos */
  no_inherit = 0x0080,	/* DOS-specific */
  create = 0x0100,	/* second byte, away from DOS bits */
  fail_if_exists = 0x0200,
  no_ctty = 0x0400,
  truncate = 0x0800,
  append = 0x1000,
  non_block = 0x2000,  
};

var rwb = file_flags.read_write.binary;
var rwac = file_flags.read_write.append.create;
```

```plee-err
var rw = file_flags.read.write;
// compile-err: bitmask initialization error: read, write are in the same group.
```
