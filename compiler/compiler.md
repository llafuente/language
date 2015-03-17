## compiler

Plee objective it's not only to be language, rather than be
a language target for others.

The compiler infraestructure is in layers to allow other languages to
enter in the middle of any layer using simple JSON/TEXT file. Or just
use one layer like preprocessor.

Compiler layers:

* Preprocesor

  input: text (file)

  output: text + JSON (metadata)

  Read files and expand the code.

  Generate a JSON file with the given expansion to allow tokenizer to
  match the real line/column in the original file.

* Tokenizer

  input: text (file) + JSON (optional)

  output: JSON (Tokens)

  Tokenize given file applying some basic language rules.

* AST generator & Postprocesor

  input: JSON (Tokens)

  output: JSON (AST)

  Transform the tokenizer output into full AST. Only produce
syntax errors.

* Minimal AST (remove AST expansions)

  input: JSON (AST)

  output: JSON (MAST)

  Reduce AST to it's minimal form (function calls & pointer arithmetic)

  Undo the shortcuts/lazy forms found in the language.

  STUDY: Could be part of a default postprocessor...

* "Compile" (AST to LLVM IR)

  input: JSON (MAST)

  output: llvm ir, executable or execute program.

  From given Minimal AST generate LLVM IR.

  Passes:

  * Type inference
  * Templates

  Then will use `llvm-link` to generate a LLVM bc file

  `ar` will include anything necesary in the bc

  `llc` will compile to target arch





### compiler command line (propossal)

Usage:

```
plee [actions] file

actions:
  -e              execute
  -safe           enable safe mode
  -t              run tests
  -c              compile (default if no action sent)
  -p              parse and display AST

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




### Core libraries

* [pcre](http://www.pcre.org/)

  Perl Compatible Regular Expressions

* [openlibm](https://github.com/JuliaLang/openlibm)

* [libuv](http://www.pcre.org/)

  Asynchronous IO, NET, DNS & threads tools.

* [zlib](http://www.zlib.net/)

* [icu c](http://site.icu-project.org/)

### Long term core libraries

* [http-parser](https://github.com/joyent/http-parser)

* [glfw](http://www.glfw.org/)

  window, opengl, & input

* [asmlib](http://www.agner.org/optimize/)
  & [nt2](https://github.com/MetaScale/nt2)

  SIMD

* [openssl](https://www.openssl.org/)

* [iconv](http://www.gnu.org/savannah-checkouts/gnu/libiconv/)


### compilers based on LLVM (for reference)

* [clay](https://bitbucket.org/kssreeram/clay)
* [kaleidoscope](http://llvm.org/docs/tutorial/LangImpl1.html)
* [rust](https://github.com/rust-lang/rust)
* [roadsend-php-raven](https://github.com/weyrick/roadsend-php-raven)
* [unladen-swallow (phyton)](https://code.google.com/p/unladen-swallow/wiki/RelevantPapers)

* [Mapping-High-Level-Constructs-to-LLVM-IR](http://llvm.lyngvig.org/Articles/Mapping-High-Level-Constructs-to-LLVM-IR)

