## enum

```syntax
enum-declaration
'export'? 'expand'? "enum" var-identifier "{" ["," var-identifier (":" integer)? ]+ "}"  ";"
```

expand leaks enum identifier to current scope, and if it's exported to the module interface.


```plee

enum dirs {north, west, south, east};

int i = dirs.north;

expand enum DIRS {NORTH, WEST, SOUTH, EAST};

int j = NORTH;

```
