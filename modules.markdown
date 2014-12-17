## Modules

Modules in plee are the way to mimic classes without following any related paradigm.

### Module name/identifier

* cannot start with a number.
* cannot contains spaces.
* cannot contains uppercases.
* Cannot start with a $
* Any UTF-8 valid character (TODO **study** could be better to just allow ASCII)


### Syntax

**Module file**

Module declaration (first statement!)

> **module** *identifier*;

Export a `variable`

> export var secret = "x";

Export a `constant`

> export const other_secret = "y";

Export a `function`

> export fn get_secret() {}

**Your program**

Module import

> **import** [, *what_to_import*] *module-name*[@*semver*] [**as** *mod_a*];

Declaration example:
```
// file: cia.plee
// module must be the first non-comment statement
module cia;

var hidden = "secret";

export fn get_secret {
  return hidden;
}

```

Module usage:
```
// encapsulated, this is the preferred way
import cia@latest as mod_a;
log mod_a.get_secret(); // stdout: secret

// leaked to current scope, not preferred but accepted
import cia;
log get_secret(); // stdout: secret

// partial import encapsulated
import get_secret cia@1.0.0 as mod_b;
log mod_b.get_secret(); // stdout: secret

// partial import leaked to current scope
import get_secret cia@0.0.1;
log mod_b.get_secret(); // stdout: secret

```


### instance-able module (class-like)

As was said, classes are not needed, because modules can be instanced.
*modules* are a good, plain, simple and also painless to think in classes.


Definition:

```
module mymod;

var hidden = "";

export fn new(str) {
    hidden = str;
}

export fn get_secret {
  return hidden;
}

```

Usage:

```
import mymod as mod;

mod.get_secret(); // compile-error: module need to be instanced

var m = new mod("no more secrets");
log m.get_secret(); // stdout: no more secrets

```

### Special functions

#### `fn new`

  module constructor.

#### `fn delete`

  module destructor.

### Implementation

**TODO** when backend is defined, we need to review this.

* Modules name will be used as *namespace* to avoid collisions.
* Modules will be implemented using `structs` with `functions`.
* if module has *new* or *delete* functions, must be instanced.
* if a function does not access to any variable at module-program level,
it could be called outside regardless the module has *new* or *delete*.
* when instanced, *new* function is called if exists and instance the struct.
* when deleted, *delete* function is called if exists and destroy the struct.



## Embedded modules

There are some modules that are embebed into the application.
like `call`... call function is in fact a module imported in every file.
