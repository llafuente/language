## compiler

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
