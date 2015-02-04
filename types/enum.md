<a name="enum-type"></a>
## enum

```syntax
enum-declaration
'export'? 'expand'? "enum" var-identifier "{" ["," var-identifier (":" integer)? ]+ "}"  ";"
```

expand leaks enum identifiers to current scope,
and if it's exported to the module interface.

enum are in fact a convenient way to manage a finite number of
int values.


```plee

enum dirs {north, west, south, east};

int i = dirs.north;

expand enum DIRS {NORTH, WEST, SOUTH, EAST};

int j = NORTH;

```
