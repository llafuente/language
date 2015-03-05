#include <stdlib.h>

#define TYPE int
TYPE *c;

int main() {
int i = 50;
_malloc:
  c = (TYPE*) malloc(i);

raw_pointer_assignament:
  *c = 'Z';

index_assignament:
  c[99] = 'W';

  free(c);

_return:
  return 0;
}

//clang -Os -O0 -emit-llvm -mllvm -debug-pass=Structure -S -c -o /dev/stdout

/*
load
  {++position} = load {subtype}** {variable|++position}, align 8

store
  store {subtype}* {variable|++position}, {subtype}** {variable|++position}, align 8

move
  %8 = getelementptr inbounds {subtype}* %7, i64 {position}

allocate
  %3 = call noalias {subtype}* @malloc(i64 {size}) #2
  store {subtype}* %3, {subtype}** @{variable}, align 8

deallocate
  call void @free({subtype}* %9) #2

assign 0
  %5 = load {subtype}** @{variable}, align 8
  store {subtype} {store_value}, {subtype}* %5, align 1
  br label %6

assign 1
  %7 = load {subtype}** @{variable}, align 8
  %8 = getelementptr inbounds {subtype}* %7, i64 {position}
  store {subtype} {store_value}, {subtype}* %8, align 1
  br label %9


*/
