#include <stdio.h>
#include <stdlib.h>

int sum(int a, int b) {
  return a + b;
}

int call(a, b) {
  int(*callback)(int, int) = &sum;

  return (*callback)(a, b);
}


int main() {
  int c = call(1, 2);

  printf("%d", c);

  return c;
}
