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
var-identifier ["=" boolean-literal]
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
