<a name="enum-type"></a>
### enum

An enum type is a special data type that enables for a variable
to be a set of predefined constants.

```syntax
enum-declaration
'export'? 'expand'? "enum" var-identifier "{" ["," var-identifier (":" integer)? ]+ "}"  ";"
```

`expand` *leaks* enum constants to current scope (like `using`).

enum is in fact an integer, the proper way to handle it's type is
not to use a type at all, let the compiler to their work and find
the type for you.

** Experimental** Unlike C*, enum could grow if needed (more than
255 constants), so it's type could be any integer.


```plee
enum dirs {north, west, south, east};

var i = dirs.north;

expand enum DIRS {NORTH, WEST, SOUTH, EAST};

var j = NORTH;
```
