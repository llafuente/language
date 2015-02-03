#include <string.h>
#include <stdio.h>
#include <stdlib.h>

/*

test continuos memory using [] at the end of the
struct.

str can be used as char* for strncpy so could be
a resonable way to do it.

*/
enum charset {
  ascii,
  utf8,
  utf16
};

typedef struct  {
  size_t length;
  size_t size;
  char str[];
} string;

string* reserve(size_t len) {
  printf("1\n");

string_malloc:;
  string* s = (string*) malloc(sizeof(string) + len * sizeof(char));
  //string* s;
  //void* v = (string*) malloc(sizeof(string) + len * sizeof(char));
  //void* v = (string*) calloc(1, sizeof(string) + len * sizeof(char));
  //s = v;
set_length:;
  s->length = 0;
set_size:;
  s->size = len;
set_first:;
  s->str[0] = 'a';
set_second:;
  s->str[1] = '\0';

  return s;
}


int main(int argc, const char * argv[]) {

  printf("--> ??\n");
  string* s = reserve(15);
  printf("--> %s\n", s->str);

  //strncpy(s->str, "hola", 0);
  memcpy(s->str, "hola", 5);

  printf("%s\n", s->str);

  free(s);

  return 0;
}
