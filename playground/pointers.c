#include <stdlib.h>

char * c;

int main() {
_malloc:
  c = (char*) malloc(10);

raw_pointer_assignament:
  *c = 'Z';
index_assignament:
  c[1] = 'W';
_return:
  return 0;
}

//clang -O0 -emit-llvm -mllvm -debug-pass=Structure -S -c -o /dev/stdout
