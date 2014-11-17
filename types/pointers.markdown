## Pointers

Or rather smart pointers.

There are four types of pointers: p1, p2, p3, p4.
The only difference how much it jumps when `++` or `--` is applied.

### members

* `size`:ui64

  memory allocated

* `start`:pointer

  low-level-pointer to the start

* `current`:pointer

  low-level-pointer to the current

* `references`:**ui64**

### operators

* `[ui64]`

  Provides indexed access to the managed array

* `++` & `--` & `+` & `-`

  Increment/Decrement current position given X bytes.

  If overflow occurs will raise a runtime-error.




Examples

```

var x = new ui8[10]; // array
var y:p1 = new ui8[10]; // pointer

x[0] = 10;
y[0] = 10;
y[1] = 11;

log x; // stdout: 10

// get value
log y; // stdout: 10
log y[0]; // stdout: 10
// get memory address, need casting
log y[0] as p1; // stdout: 0xXXXX

++y;
log y; // stdout: 11

var z = y[0]; // z will be ui8, as reference
z = 12;
log y; // stdout: 12

delete z; // compilation error: "z do not own memory"

```