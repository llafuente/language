#include <string.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct  {
  size_t length;
  char *first;
  char *second;
} data;

data* reserve(size_t flen, size_t slen) {
  printf("1\n");

  size_t offset = sizeof(data);

  void* v = (data*) malloc(offset + (flen + slen) * sizeof(char));
  //string* s;
  //void* v = (string*) malloc(sizeof(string) + len * sizeof(char));
  //void* v = (string*) calloc(1, sizeof(string) + len * sizeof(char));
  //s = v;
  printf("2\n");
  data* s = (data*) v;
  printf("3\n");

  v = v + offset + 1;
  s->first = (v);
  v = v + flen * sizeof(char);
  s->second = (v);
  //s->second = v[offset + 1 + flen];

  s->length = 69;
  (s->first)[0] = 'x';
  (s->first)[1] = '\0';
  printf("4\n");
  (s->second)[0] = 'y';
  (s->second)[1] = '\0';
  printf("5\n");
  printf("src %d\n1st %d\n2nd %d\n\n", s, s->first, s->second);

  return s;
}


int main(int argc, const char * argv[]) {

  data* s = reserve(5, 7);
  printf("--> %s\n", s->first);
  printf("--> %s\n", s->second);
/*
  //strncpy(s->str, "hola", 0);
  memcpy(s->str, "hola", 5);

  printf("%s\n", s->str);
  */

  char* itr = (char*) s;

  size_t i;
  for(i=0 ; i < 15; i++) {
    printf("%d | %02x | %c\n",i, *itr, *itr);
    ++itr;
  }

  free(s);

  return 0;
}
