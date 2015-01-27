#include <string.h>
#include <stdio.h>
#include <stdlib.h>

/**
clang -S -emit-llvm function-overload.cpp

It appears that function overloading is not
supported in LLVM IR, rename functions it's the only way
*/


int sum(int a, int b) {
  return a + b;
}

size_t sum(size_t a, size_t b) {
  return a + b;
}


int main(int argc, const char * argv[]) {

  int a = 3;
  int b = 6;
  int c = sum(a, b);

  printf("%d\n", c);

  size_t x = 3;
  size_t y = 6;
  size_t z = sum(x, y);

  printf("%zu\n", z);

  return 0;
}
