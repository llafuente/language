<a name="block-type"></a>
## block

It's the same as struct but memory continuous.

To be memory continuous, sizes of all arrays must
be defined at once, and can only be allocated in the heap.


Syntax

```syntax
block-declaration
'block' var-identifier ["," var-identifier]+ block-body;

block-body
'{' (var-declaration|fn-declaration)+ '}'
```


```plee

// declaration
block blk a, b {
  var ui8[a] a_list;
  var ui8[b] b_list;
};

// initialization
var x = new blk(10, 10);

// can be resized
resize x(15, 10); // note: this will allocate, copy and free the old memory.

```

```plee-err
resize x.ptr_a[0]; // compilation error
delete x.ptr_a[15]; // compilation error
// compile-err: block property cannot freed, you must free the entire block
```

note: do not need to store the size/length in the array.
both a_list and b_list will be arrays and will have
`.length` and `.size`.


### Implementation

example:
```plee
// declaration
block ab_blk a, b {
  var ui8[a] a_list;
  var ui8[b] b_list;
};
```
* a_list will be a raw pointer to a-array
* b_list will be a raw pointer to b-array

both arrays will be at the end of the structure.

Memory map:

| a*    | b*    | a-array  | b-array  |
|:-----:|:-----:|:--------:|:--------:|
|a-array|b-array| contents | contents |

[POC](https://github.com/llafuente/language/blob/master/playground/contiguos-memeory.c)


### interlace (proposal)

Because the implementation is so difficult i just leave the note.

Interlaced array memory.

Example (plee/c-ish)

```
// declaration
block ab_blk a, b {
  var ui8[a] a_list;
  var ui8[b] b_list;
};

var ab_blk = new ab_blk(2, 2);
ab_blk.a_list[0] = 1;
ab_blk.a_list[1] = 2;
ab_blk.b_list[0] = 3;
ab_blk.b_list[1] = 4;
var ptr p = @ab_blk.a_list;
for i8 i = 0 .. 4 {
    log *p; //c-ish
    ++p;
}
```

this will log:
* 1 (ab_blk.a_list[0])
* 3 (ab_blk.b_list[0])
* 2 (ab_blk.a_list[1])
* 4 (ab_blk.b_list[1])
