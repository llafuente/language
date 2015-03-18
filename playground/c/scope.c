#include <stdlib.h>

int main() {
  {
    int i = 50;
    printf("%d\n", i);
  }
  int i = 100;
  printf("%d\n", i);


  return 0;
}

//clang -Os -O0 -emit-llvm -mllvm -debug-pass=Structure -S -c -o /dev/stdout
