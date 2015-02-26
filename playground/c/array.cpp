#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdint.h>


// @ http://www.xs-labs.com/en/blog/2013/08/06/optimising-memset/

#define MEM_FREE_ADDR 0
#define MEM_RESIZE_ADDR 1

/*

test for array continuos memory using [] at the end of the
struct.

*/

#define ARRAY_T long int
#define ARRAY_T_SIZE 8
#define ARRAY_T_PRINTF "ld"

typedef struct  {
  size_t length; // used
  size_t capacity; // max number of elements
  ARRAY_T values[];
} array;

__attribute__((noinline))
void array_debug(array* str) {
  printf("array_debug @%p, length[%zu/%zu]\n", str, str->length, str->capacity);

  ARRAY_T *p = str->values;
  size_t size = str->length;

  printf("\nvalues-in-array\n");
  p = str->values;
  for (int n = 0; n < size; ++n) {
    printf("| %" ARRAY_T_PRINTF "  ", *p);
    ++p;
  }

  size = str->capacity;
  printf("\nvalues-in-memory\n");
  p = str->values;
  for (int n = 0; n < size; ++n) {
    printf("| %" ARRAY_T_PRINTF "  ", *p);
    ++p;
  }
  printf("\n");
}

array* array_new(size_t len) {
//  reserve_malloc:;
  array* s = (array*) malloc(sizeof(array) + len * ARRAY_T_SIZE);

//  reserve_set_length:;
  s->length = 0;

//  reserve_set_capacity:;
  s->capacity = len;

//  reserve_return:;
  return s;
}

void array_delete(array* str) {
  free(str);
  str = MEM_FREE_ADDR; // when free set to a know address
}

void array_resize(array** str, size_t len);

void array_copy(array** out_ptr, array* src) {
  printf("array_copy %p - %p\n", *out_ptr, src);
  array* out = *out_ptr;

  size_t src_len = src->length;

  if (src_len > out->capacity) {
    array_resize(out_ptr, src_len);
    printf("array_resized %p\n", *out_ptr);
    out = *out_ptr;
  }

  memcpy(out->values, src->values, src_len * ARRAY_T_SIZE);
  out->length = src_len;
  //out->values[src_len] = '\0';
}

void array_resize(array** arr_ptr, size_t len) {
  printf("array_resize %p - %lu\n", *arr_ptr, len);

  array* out = array_new(len);

  array_copy(&out, *arr_ptr);

  free(*arr_ptr);
  //arr_ptr = MEM_RESIZE_ADDR; // when free set to a know address

  *arr_ptr = out;
}

void array_push(array** arr_ptr, ARRAY_T value) {
  array* arr = *arr_ptr;
  if (arr->length == arr->capacity) {
    // resize
    array_resize(arr_ptr, arr->length + 1);
    arr = *arr_ptr;
  }

  arr->values[arr->length] = value;
  ++arr->length;
}

ARRAY_T* array_pop(array* arr) {
  if (arr->length > 0) {
    --arr->length;
    return &arr->values[arr->length];
  }

  return 0;
}

int main(int argc, const char * argv[]) {

  array* s = array_new(2);
  printf("start array %p\n", s);

  assert(s->length == 0);
  assert(s->capacity == 2);
  array_push(&s, 1);
  array_push(&s, 2);

  assert(s->length == 2);
  assert(s->capacity == 2);

  array_push(&s, 3);
  array_push(&s, 4);
  array_push(&s, 5);

  array_debug(s);

  printf("pop %" ARRAY_T_PRINTF "\n\n", *array_pop(s));

  array_debug(s);

  array_delete(s);

  return 0;
}
