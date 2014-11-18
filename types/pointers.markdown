## Pointers

There many types of pointers.

| name    | target   | can move? | own memory | dereferenced | safe |
|---------|----------|-----------|------------|--------------|------|
| `ptr`   | single   |    no     |     no     |     yes      |  yes |
| `array` | multiple |    no     |     yes    |     no       |  yes |
| `pitr`  | multiple |    yes    |     no     |     yes      |  yes |
| `rawp`  | multiple |    yes    |     no     |     no       |  no  |


### `ptr`

Points to a single memory address, is dereferenced because there
is no operation that can be perform on the pointer apart from assign to a memory.

```
var a = 1; // ui8
var b = 5; // ui8

var pa = &a; // pointer to ui8
var pb = &b; // pointer to ui8


// and now, what means dereferenced.
a = a + pb;
log a; // stdout: 6


pa = pb; // assign value
log a; // stdout: 5

pa = &pb; // now pa and pb points to a

log (&pa === &pb) === a;

```

### `array`


Yeah an array is considered a pointer!


examples:
```
var a = [1,2,3];
var b = new ui8[3];

b copy a; // copy a onto b
assert a[0] == b[0] "a and b aren't the same!";


var c = &a; // reference

delete a; // even if a own the memory also c

log c[0]; // 1

```

### `pitr`

Pointer(memory) iterator.

Properties
* `length`:**ui64**

  readonly.

* `start`:**rawp**

  readonly.

* `end`:**rawp**

  readonly.

* `current`:**rawp**

  readonly.

  current is dereferenced by the compiler.

* `next`:**any** or ``

  readonly.

* `prev`:**any** or ``

  readonly.


Operator
* operator++

  same as next();

* operator--

  same as prev();

* operator+ amount:ui64

  same as next(amount)

* operator+= amount:ui64

  same as next(amount)

* operator- amount:ui64

  same as next(amount)

* operator-= amount:ui64

  same as prev(amount)


Members
* `reset`

  back to start

* `next`(**amount**:ui64 = 1)

  go to next and return false if the end reached or no action is performed.

* `prev`(**amount**:ui64 = 1)

  go to previous and return false if the beginning reached or no action is performed.


Examples
```
var l = new array[10];
l.fill(10);

var itr = l.iterator();

while (itr.next()) {
    log itr.current; // stdout (10 times): 10
}

assert &itr.current == &itr.last "end reached";

delete itr; // do not delete l memory

```



### `rawp`

Raw C-like pointer, for maximum performance.
It's not safe to use because has no bounds check.

Use it with caution.


Compiler notes:

* `var x:rawp = new ui8[1];` raise a compilation error
