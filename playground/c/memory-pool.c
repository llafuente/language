#include <string.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  size_t used;
  size_t free;
  size_t size;

  void* next;
  void* start;
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
  p->start = (void*) malloc(size);
  p->next = pl_pages[c].start;
  p->free = size;
  p->size = size;
  p->used = 0;

  printf("page %lu used(%lu) free(%lu)\n", 0, p->used, p->free);
}

void free_pool() {
  size_t i;
  
  for (i = 0; i < pl_count; ++i) {
    free(pl_pages[i].start);
    pl_pages[i].start = 0;
  }

  free(pl_pages);
}

void debug_pages() {
  size_t i;

  for (i = 0; i < pl_count; ++i) {
    printf("page %lu size(%lu) used(%lu) free(%lu)\n", i, pl_pages[i].size, pl_pages[i].used, pl_pages[i].free);
  }
}

void* alloc_block(size_t size) {
  size_t i;

  for (i = 0; i < pl_count; ++i) {
    if (pl_pages[i].free > size) {
      void* ret = pl_pages[i].next;
      pl_pages[i].next += size;
      pl_pages[i].used += size;
      pl_pages[i].free -= size;

      return ret;
    }
  }

  return 0;
}

int free_block(void** pos, size_t size) {
  size_t i;
  pool_t* p;

  for (i = 0; i < pl_count; ++i) {
    p = &pl_pages[i];
    printf("%lu - %lu - %lu\n", p->next, pos, p->start);
    if (p->next > *pos && p->start <= *pos) {
      void* ret = p->next;
      p->next += size;
      p->used -= size;

      // restart the page!
      if (!p->used) {
        p->free = p->size;
        p->next = p->start;
      }

      *pos = 0; // no dangling pointer
      return 1;
    }
  }

  return 0;
}


int main(int argc, const char * argv[]) {

  alloc_page(256);

  debug_pages();

  void* b = alloc_block(56);
  void* c = alloc_block(10);

  debug_pages();

  free_block(&b, 56);
  free_block(&c, 10);

  printf("%li\n", b);
  printf("%li\n", c);

  debug_pages();

  free_pool();
  return 0;
}
