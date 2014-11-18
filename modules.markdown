## Modules

Modules in plee are the way to mimic classes without following any related paradigm.


Example
```

//module 'xxxx' as new; // instanciable module
module 'xxxx'; // by reference

var hidden = "secret";

fn get_secret {
  return hidden;
}

```

Usage:
```

import 'xxxx';

log get_secret(); // stdout: secret

```



### import module by reference

```
import 'file-src'; // import all functions
import [, function] from 'file-src'; // import selected ones

// module from the repository ?

import 'module-name';
import [, function] from 'module-name';

// you could have different module versions, you may want a specific function from one

import 'module-name'@0.0.0;
import [, function] from 'module-name'@0.0.0;
```

### import module and instance it.

```
var mod = import 'file-src';
new mod;
```

### Special functions

#### new function

  could be considered as constructor.

#### delete function

  could be considered as destructor.

### Compiler implementation notes.

Modules will be implemented using `structs`.

#### reference-able module transformation

* Add a unique namespace to the whole file to avoid variable leacking to global scope.
* Transform any access to those functions to use that unique namespace.

#### instance-able module transformation

* Global variables transformation:
  * append an internal token to make them inaccesible.
  * Add them to the module struct.
* Function declarations transformation.
  * prepend as first argument a raw-pointer to the module struct.
  * Prepend the struct variable pointer to any ocurrence of the global variables.
  
#### new module
* new the struct
* call new function if exists.

#### delete module
* call delete function if exists.
* delete the struct
