### Preprocesor.

Preprocesor actions is prefix with `#` and must be at the start of the line.

* `#include` uri

  *note*: Relative to current file.

  Add the file contents into the current position.

  This can be used *to extend* modules, or spread configuration files across your project.

* `#replace` regexp replacement|block

  Execute given regexp once per line.

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

* `#define` identifier value|block

  object-like macro. Replace variable literals.

* `#define` fn_identifier([, arguments]) value|block

  function-like macro. Replace call expressions.

* `#undef` identifier|fn_identifier



  define replacement for literals and functions calls.

Compiler definitions

  Any environment variable will be available.

  * PLATFORM
    linux-32, linux-64, win-32, win-64

  * DISTRO
    debian-X.X.X, ubuntu-X.X.X, centos-X.X.X, win-(xp|7|8)

  * KERNEL (kernel semver)
    X.X.X

* `#ifdef` identifier block [else block]
* `#ifndef` identifier block [else block]

* `#if` test block [else block]

  ```
  #if ENV == "dev" {
    #include "dev-config.plee"
  } else {
    #include "production-config.plee"
  }
  ```
* `#error` string

  Raise a preprocesor error

  ```
  #if PLATFORM == "mac-32" {
    #error "mac is not supported"
  }
  ```

  * `#rule-add` identifier function-declaration

  inject code directly into the parser.

  This require knowledge of the parser itself, use it with caution.

  ```
  #rule-add read_source_elements function read_if_statement() {
    var ast = ast_new("xxx");

    // über mad science!

    return ast_end(ast);
  }
  ```
