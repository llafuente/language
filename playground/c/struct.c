#include <stdlib.h>

typedef struct {
  int a;
  int b;
} mstruct;

void instance() {
  mstruct i;

a_eq:  i.a = 1;
b_eq:  i.b = 2;
}

void pointer() {
  mstruct* i = (mstruct*) malloc(sizeof(mstruct));

a_ptr_eq:  i->a = 1;
b_ptr_eq:  i->b = 2;
}


typedef struct {
  char *p;
  char c;
  long x;
} st_offset_01;


void instance_offset() {
  st_offset_01 i;

  p_eq:  i.p = 0;
  c_eq:  i.c = 'a';
  x_eq:  i.c = 157;
}


typedef struct __attribute__((packed)) {
  int a;
  char c;
} st_packed;


void instance_st_packed() {
  st_packed i;
}
