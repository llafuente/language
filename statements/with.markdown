<a name="with"></a>
## with

Allocate all members of a struct/block in given/current scope.

If parser found a member not used, the stack allocation is removed, keep only what it's used.

This will lead to some performance gain and code clarity, but could also hide
some concurrency bugs...

Why improve performance?
To access a struct member compiler must do some pointer math, allocating directly
the member, the math is gone and it could access directly the member.
But at the end of the block it should

**TODO** maybe with statement is not the best way to call it, maybe `cache` and
provide a "standard with" without allocating. or `withalloc`, `withstack`, `stack with`, `cache with`...

*Notice*: with-block is preferred over with-current-block.

### syntax

```syntax
with
with-current-block
with-block

with-block
'with' member-expression block-statement EOS

with-current-block
'with' member-expression EOS
```

continuation of [struct example](#struct-example)

```plee
var v2 instance; // default constructor 0,0
instance.add(5, 6);
log instance.x; // stdout: 5
log instance.y; // stdout: 6

// you can aboid using "instance" in a block
with instance {
  log x; // stdout: 5
  log y; // stdout: 6
}

or you can just avoid using "instance" in current scope.
with instance;

```

With statement is rather dangerous in other languages.
With statement is like declaring all properties as variables so collisions may
happen and error will raise for clarity and security.


```plee-err
var v2 instance;
var x;

with instance; // error: x is already declared.
log x;
```


** compiler-notes **

if "with" has no target block is hoisted to the top.
Even if it could lead to a performance regression.
