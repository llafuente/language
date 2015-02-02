<a name="box"></a>
## box

Wrap a variable with it's type (aka [Variant](http://en.wikipedia.org/wiki/Variant_type))

A box has a very few operations to ensure type safety and correctness while allow
to bypass type system and move logic to runtime.

### boxing

box creation.

```plee
var x = ["a", 1];
// a will be in a box
// 1 will be in a box
log typeof x; // stdout: box[]
```

**TODO** function boxing is possible, but call a function without the proper arguments?
**TODO** box a module ?

### unboxing

Casting box to something usable.


```plee

var string x0 = x[0]; // type here is mandatory.
var i64 x1 = x[1]; // type here is mandatory.

// recommended to check before.
if (typeof x == "string") {
  string _x0 = x[0];
}

```
