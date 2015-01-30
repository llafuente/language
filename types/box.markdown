<a name="box"></a>
## box

Wrap a variable with it's type.

a box has a very few operations to ensure type safety and correctness.

### boxing

box creation.

```plee
var x = ["a", 1];
// a will be in a box
// 1 will be in a box
// x type is box[]
```

A module cannot be boxed.

**TODO** function boxing is possible, but call a function without the proper arguments...

### unboxing

Casting box to something usable.


```plee

var string x0 = x[0]; // type here is mandatory.
var i64 x1 = x[1]; // type here is mandatory.

if (typeof x == "string") {
  string _x0 = x[0];
}

```
