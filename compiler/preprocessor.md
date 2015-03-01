### Preprocessor.

Preprocessor actions is prefix with `#` and must be at the start of the line.

Preprocessor rules are only available at module context in contrast with
c preprocessor

That means anything defined inside a module cannot be used by the
importer, but it can be use in the module imported modules.

Example:

a.plee
```plee
#define XXX true
import b;
log YYY; // compiler-error: undefined variable

b.plee
```plee
#define YYY true
log XXX; // true
```

An obvious work-around is to #include a macro file (it's part of the
[modules good practices](#modules))

#### `#include` **uri**

**uri** Relative path from current file or absolute.

Add given file contents into the current position.

This can be used *to extend* modules, or spread configuration files across your project.

Do not use it to include real code. Use [modules](#modules) instead.

#### `#replace` **regexp** **replacement|block**

Execute given `regexp` to any file once, from now on,that's not include current file.

Useful to replace inside strings or literals.

```
#replace /John/g "Hi \\0"
log "say John"; // stdout: say Hi John

// For multiline you can use block syntax
#replace /John/g {
What are you doing!";
log "John reply";
}
```

#### `#define` & `#undef`

```syntax
define-preprocessor
define-object-like
define-function-like

define-object-like
"#define" var-identifier (value|block)

define-function-like
"#define" fn-identifier "(" ["," *arguments*]? ")" (value|block)

undef-preprocessor
"#undef" var-identifier
```

* object-like macro.

  Replace variable literals.

* function-like macro.

  Replace call expressions.
  Cannot be undef.

Default compiler definitions.

Any environment variable will be available.

* PLATFORM
  linux-32, linux-64, win-32, win-64

* DISTRO
  debian-X.X.X, ubuntu-X.X.X, centos-X.X.X, win-(xp|7|8)

* KERNEL (kernel semver)
  X.X.X

#### `#ifdef` & `#ifndef`

Check if a idenfifier is defined or not.

```syntax
ifdef-preprocessor
"#ifdef" identifier block-statement "else" ifdef-preprocessor
"#ifndef" identifier block-statement "else" ifdef-preprocessor
```

```plee
#ifdef PLATFORM {
  log "out platform is known: ", PLATFORM;
}
```


#### `#if`

```syntax
if-preprocessor
"#if" assignament-expression block-statement "else" if-preprocessor
```

```plee
#if ENV == "dev" {
  #include "dev-config.plee"
} else #if {
  #include "production-config.plee"
}
```

#### `#error` string

Raise a Preprocessor error, will stop compilation.

```
#if PLATFORM == "mac-32" {
  #error "mac is not supported"
}
```

#### `#meta` text

Add `metadata` as text in the next AST statement.

This metadata can be used in the postprocessor.

```plee
#meta post-process
fn xx {
  return 0;
}
```
