## Modules

Modules in plee are the way to mimic classes without following any related paradigm.

### Module name/identifier

* cannot start with a number.
* cannot contains spaces.
* cannot contains uppercases.
* Cannot start with a $
* Any UTF-8 valid character (**STUDY** support only URL-valid character set)


### Syntax

```syntax
module-declaration
'module' module-vars-list ';'

module-vars-list
[',' module-var]+

module-var
'name' module-name-identifier
'version' string-literal
'tags' string-literal
'description' string-literal
'author' string-literal
'email' string-literal
```

Module declaration must be the first statement in a file, only
preceded by a comment.

### export functions and variables.

* `variable`

> export var secret = "x";

* `constant`

> export const other_secret = "y";

* `function`

> export fn get_secret() {}


### import a module

```syntax
import-statement
'import' import-list? module-name-identifier semver? ('as' var-identifier)?]+

semver
'@' literal

import-list
[',' (var-identifier|fn-identifier)]
```

### Example

Definition
```plee
// file: cia.plee
// module must be the first non-comment statement
module name cia,
    version 0.0.1,
    author "John Doe",
    email "johndoe@johndoe.com",
    tags "too, many, secrets";

var hidden = "secret";

export fn get_secret {
  return hidden;
}

export fn is_safe {
    return true;
}
```

Usage:
```plee
// encapsulated, this is the preferred way
import cia@latest as mod_cia;
log mod_cia.get_secret(); // stdout: secret
```

```plee
// leaked to current scope, not preferred but accepted for easy to use.
// can cause collisions, in that case you should use encapsulated.
import cia;
log get_secret(); // stdout: secret
```

```plee
// partial import encapsulated
import get_secret cia@1.0.0 as mod_b;
log mod_b.get_secret(); // stdout: secret

// some common errors...

log mod_b.is_safe(); // compile-error
// 'is_safe' is not imported at line X:Y

log mod_b.undefined_function(); // compile-error
// 'undefined_function' is not defined by 'cia' module
```

```plee
// partial import leaked to current scope
import get_secret cia@0.0.1;
log get_secret(); // stdout: secret

log is_safe();  // compile-error
// 'is_safe' is not imported at line X:Y
```


### instance-able module (class-like)

As was said, classes are not needed, because modules can be instanced.
*modules* are a good, plain, simple and also painless to think in classes.


Definition
```
module wally;

var haystack = "";

export fn new(clone str) {
    haystack = str;
}

export fn find {
  return haystack.index_of('wally');
}

```

Usage:

```
import wally;

wally.get_secret(); // compile-error
// 'wally' require to be instanced with new

var m = new wally("where is wally");
log m.find(); // stdout: 9

```

### Special functions

#### `fn new`

  module constructor.

#### `fn delete`

  module destructor.

#### `fn on_import`

  executed when module is first imported.

### Implementation

**TODO** when backend is defined, we need to review this.

* Modules name will be used as *namespace*-like to avoid collisions.
* All module-variables will be wrapped into a struct
* new/delete function will alloc/delloc the struct
* prepend the struct to all functions, declarations and calls.
* if new is not defined, the compiler will create a new function
and callit
* when instanced, *new* function is called if exists and instance the struct.
* when deleted, *delete* function is called if exists and destroy the struct.

**Study**
* if a function does not access to any variable at module-program level,
it could be called outside regardless the module has *new* or *delete*.

## Embedded modules

There are some modules that are embebed into the application.
like `call`... call function is in fact a module imported in every file.
