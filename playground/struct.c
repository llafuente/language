#include <stdlib.h>

typedef struct {
  int a;
  int b;
} mstruct;

void instance() {
  mstruct i;

  i.a = 1;
  i.b = 2;
}

void pointer() {
  mstruct* i = (mstruct*) malloc(sizeof(mstruct));
  i->a = 1;
  i->b = 2;
}
