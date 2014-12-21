## Pointers

**TODO** this need review and a real comparison with c-pointers.

There many types of pointers.

| name      | target   | can move? | own memory | dereferenced | safe |
|-----------|----------|-----------|------------|--------------|------|
| `ref`     | single   |    no     |     no     |     yes      |  yes |
| `itr`     | range    |    yes    |     no     |     yes      |  yes |
| `ptr`     | multiple |    yes    |     yes    |     no       |  no  |


### `ref`

Points to a single memory address, is dereferenced because there
is no operation that can be perform on the pointer apart from assign to other memory address.

```plee
var ui8 a = 1;
var ui8 b = 2;
var ui64 b_addr = @b; // hold b address

// @ means address
var ref pa = @a; // reference to a
var ref pb = b_addr; // reference to b


// ref is always dereferenced for easy to use.
a = a + pb;
log a; // stdout: 3


pa = pb; // assign value
log a; // stdout: 2

pa = pb; // now pa and pb point to b

// has the same value?
log (pa == pb); // stdout: true
// has the same addres? no. Points to the same address.
log (@pa == @pb); // stdout: false
```


For safety reasons you can't access the `ref` address.

**STUDY** use '===' to compare `ref` addresses.


References do not own memory, but some structures like
array will transfer memory ownage to `ref`. let's see an example.

```plee
var arr = [1,2,3];
var ref c = @arr; // reference arr

delete arr;

log c[0]; // 1

log arr[0]?; // null

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



```plee
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
