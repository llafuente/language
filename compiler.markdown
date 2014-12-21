## compiler

### compiler command line

Usage:

```
plee [actions] file

actions:
  -e              execute
  -t              run tests
  -c              compile (default if no action sent)
  -p              parse

actions can be mixed
example: plee -e -c file.plee
execute and compile.

test arguments
-r path
--report path     path to save the report
-cv
--code-coverage

compile arguments

execute arguments

parse arguments
--cache          path to cache
--no-cache       disable cache

```

### Parser implementation.

There are many languages out there that can solve many problems.
Plee want to be target of many languages to do so. We need to build the
compiler in layers, even if it's not optional, parse time vs compile time
is so huge that parser, could be not optimal but feature rich.

Each step exports JSON that could feed the next step.

Steps:

* Tokenizer.

  Tokenize the code with the language rules (like `var a-b;` a-b is a variable not a, -, b)

* AST generator

  From the tokenizer output build the AST.

* Preprocesor

* AST expansion

  Search for plee shortcut and generate full code.

* Generate Target code from AST

  This is the key to be `language target`. Also

  Output: text files?

And then... compile.


### Compiler implementation

**Study** choose!

* Transcopile to C

  fast, portable, rather straight

* c bytecode

  slow, portable, easy REPL

* LLVM

  very fast, diffucult, nice linking to other languages like c/c++

* JIT LLVM

  rather fast, could support more introspection types,
  more dynamic typing, easy REPL

### compile-time execution.

Some features of the language need compile-time execution,
like `test` or `bench`.





