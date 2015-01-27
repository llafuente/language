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

* AST generator ~& Preprocesor

  Transform the tokenizer output into full AST.

* AST expansion

  Reduce AST to it's minimal form. Undo the shortcuts found in the language.

* Postprocesor

  User defined rules.

* Generate Target code from AST

  This is the key to be `language target`. Also

  Output: text files?

And then... compile/execute.


### Compiler implementation

**Study** choose!

* Transcompile to C

  fast, portable, rather straight. Some features are not supported (defer/lambda)
  need to hack a lot the language

* c bytecode

  slow, portable, easy REPL

* LLVM

  very fast, difficult, nice linking to other languages like c/c++

* JIT LLVM

  rather fast, could support more introspection types,
  more dynamic typing, easy REPL

* AOT-JIT.

  Use a JIT engine as Ahead of time compilation.

### compile-time execution.

Some features of the language need compile-time execution,
like `test` or `bench`.


### libraries

* [pcre](http://www.pcre.org/)

  Perl Compatible Regular Expressions

* [libuv](http://www.pcre.org/)

  Asynchronous IO, NET, DNS & threads tools.

* [llvm](http://llvm.org/)

  Low Level Virtual Machine.

  Compiler, AOC and JIT.

### compilers based on LLVM

* [clay](https://bitbucket.org/kssreeram/clay)
* [kaleidoscope](http://llvm.org/docs/tutorial/LangImpl1.html)
* [rust](https://github.com/rust-lang/rust)
* [roadsend-php-raven](https://github.com/weyrick/roadsend-php-raven)
* [unladen-swallow (phyton)](https://code.google.com/p/unladen-swallow/wiki/RelevantPapers)

* [Mapping-High-Level-Constructs-to-LLVM-IR](http://llvm.lyngvig.org/Articles/Mapping-High-Level-Constructs-to-LLVM-IR)


### general purpose vm

* [parrot](http://www.parrot.org) [JIT info](http://trac.parrot.org/parrot/wiki/JITRewrite)
