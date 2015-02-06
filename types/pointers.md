<a name="pointers-type"></a>
### Pointers

**TODO** this need review and a real comparison with c-pointers.

There many types of pointers.

| name      | target   | can move? | own memory | dereferenced | safe |
|-----------|----------|-----------|------------|--------------|------|
| `ref`     | single   |    no     |     no     |     yes      |  yes |
| `itr`     | range    |    yes    |     no     |     yes      |  yes |
| `ptr`     | multiple |    yes    |     yes    |     no       |  no  |


#### `ref`

Points to a single memory address, is dereferenced because there
is no operation that can be perform on the pointer apart from assign to other memory address.

```plee
var ui8 a = 1;
var ui8 b = 2;

// @ means address
var ref pa = @a; // reference to a
var ref pb = @b; // reference to b


// ref is always dereferenced for easy to use.
a = a + pb;
log a; // stdout: 3

pa = pb; // remember dereferenced so assign value
log a; // stdout: 2

pa = @pb; // now pa and pb point to b

// has the same value?
log (pa == pb); // stdout: true

// now something tricky.
// @pa points to a address or pa addres
log (@pa == @pb); // stdout: true
// points to a addres.
// you can't have a ref to a ref for security
```


For safety reasons you can't access the `ref` address.

**STUDY** use '===' to compare `ref` addresses.


References do not own memory, but some structures like
array will transfer memory ownage to `ref`. let's see an example.

```plee
{
  var arr = [1,2,3];
  var ref c = @arr; // reference arr

  delete arr; // memory is not free, ownage is transfered

  log c[0]; // 1

  log arr[0]?; // null
} // now memory will be free

```

But it will also work on a single value.

```plee
{
  var arr = [1,2,3];
  var ref c = @arr[0]; // reference arr

  delete arr; // memory is not free, ownage is transfered

  log c; // 1

  log arr[0]?; // null
} // now memory will be free

```

**compiler notes**

* ref don't have pointer arithmetic

* ref must have a pointer to the memory owner it pointing to.

  ```plee
  var x = ui8[10];
  var ref xptr = x[5];
  delete x;
  ```

  xptr must have a pointer to x. If x is deleted like in the example.
  x memory must not be freed until xptr is deleted.

* ref is always dereferenced except on assinament expression
on left equal and address on right side.

#### `itr` (safe & unsafe)

Pointer iterator, it could be considered as "movable ref".

Safe pointer is slow, but 100% safe, use if where is points could
move.

Readonly properties.

* **ui64** `length` (safe & unsafe)

  number of steps.

  safe will be synchronized with owner.

  unsafe will be set at creation time.

* **ui64** `step_size` (safe & unsafe)

  Bytes per step

* **ref** `owner` (safe only)

* **ui64** `index` (safe & unsafe)

  current index

* **ptr** `current`

* **ref** `value`

  fake property that dereference current.

  current is dereferenced by the compiler.


Operator
* operator++

  alias of next(1);

* operator--

  alias of prev(1);

* operator+ amount:ui64

  alias of (clone itr).next(amount)

* operator+= amount:ui64

  alias of itr.next(amount)

* operator- amount:ui64

  alias of itr.next(amount)

* operator-= amount:ui64

  alias of (clone itr).prev(amount)


Members
* `reset`()

  back to start

* `next`(ui64 **amount** = 1)

  go to next and return false if the end reached or no action is performed.

* `prev`(ui64 **amount** = 1)

  go to previous and return false if the beginning reached or no action is performed.



```plee
var l = new array[10];
l.fill(10);

var itr = l.itr(); // or safe_itr

while (itr.next()) {
    log itr.current; // stdout (10 times): 10
}

assert @itr.current == @itr.last "end reached";

delete itr; // do not delete l memory

```

**compiler-notes**

* generate a warning if an array is modified while an unsafe
itr lives

* maybe step_size could be inside a macro, and dont need to
save it in the struct

* value is and alias of "dereference current", can cannot be
assigned to other memory.


#### `ptr`

Raw C-like pointer, for maximum performance.
It's not safe:
* has no bounds check
* do not have a pointer to memory owner to avoid free-ing.

As itr, pointer arithmetic take into consideration where are you
pointing.

```plee
var ui8_arr = new ui8[10];
var ptr x = @ui8_arr;
++x; // advance 1 byte;


var ui16_arr = new ui16[10];
var ptr y = @ui16_arr;
++y; // advance 2 byte;
```


Use it with caution.


Compiler notes:

* `var ptr x = new ui8[1];`

  should raise a compilation error. Even if possible, there is no
  variable that own the memory, a ptr canot be deleted
