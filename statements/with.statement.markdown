<a name="with"></a>
## with


```syntax
with member-expression (';' | block-statement)
```

continuation of [struct example](#struct-example)

```plee
var v2 instance;
instance.add(5, 6);
log instance.x; // stdout: 5
log instance.y; // stdout: 6

// you can aboid using "instance" in a block
with instance {
  log x;
  log y;
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
