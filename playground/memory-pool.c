#include <string.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  size_t used;
  size_t free;

  void* next;
  void* pool;
} pool_t;


typedef struct  {
  size_t size;
  char* chunk;
} chunk_t;

pool_t* pl_pages;
size_t pl_count = 0;

void alloc_page(size_t size) {
  size_t c = pl_count++;
  pl_pages = realloc(pl_pages, pl_count * sizeof(pool_t));

  pool_t* p;
  p = &pl_pages[c];
  p->pool = (void*) malloc(size);
  p->next = pl_pages[c].pool;
  p->free = size;
  p->used = 0;

  printf("page %lu used(%lu) free(%lu)\n", 0, p->used, p->free);
}

void debug_pages() {
  size_t i;

  for (i = 0; i < pl_count; ++i) {
    printf("page %lu used(%lu) free(%lu)\n", i, pl_pages[i].used, pl_pages[i].free);
  }

}

void* alloc (size_t size) {
  size_t i;

  for (i = 0; i < pl_count; ++i) {
    if (pl_pages[i].free > size) {

    }
  }

  return 0;
}


int main(int argc, const char * argv[]) {

  alloc_page(256);

  debug_pages();

  return 0;
}
