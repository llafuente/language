#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdint.h>


// @ http://www.xs-labs.com/en/blog/2013/08/06/optimising-memset/

#define MEM_FREE_ADDR 0
#define MEM_RESIZE_ADDR 1

/*

test continuos memory using [] at the end of the
struct.

str can be used as char* for strncpy so could be
a resonable way to do it.

this is plain c in a cpp compiler to use: Overloading Functions by type

*/
typedef enum {
  ascii,
  utf8,
  utf16
} charset_t;

typedef struct  {
  size_t length;
  size_t size;
  charset_t charset;
  char str[];
} string;

void string_debug(string* str) {
  printf("string_debug @%p, length[%zu] size[%zu]\n", str, str->length, str->size);

  char *p = str->str;
  size_t size = str->size;
  printf("\nhexadecimal\n");
  for (int n = 0; n < size; ++n) {
    printf("| %2.2x ", (*p) & 0xff);
    ++p;
  }
  printf("\nchar by char\n");
  p = str->str;
  for (int n = 0; n < size; ++n) {
    printf("| %c  ", *p ? *p : ' ');
    ++p;
  }
  printf("\nprintf\n");
  printf("%s\n", str->str);
}

#define EMPTY_STRING string_new(4)

string* string_new(size_t len) {
  size_t size = len + 1; // null terminated!

reserve_malloc:;
  string* s = (string*) malloc(sizeof(string) + size * sizeof(char));

reserve_set_length:;
  s->length = 0;

reserve_set_size:;
  s->size = size;

reserve_set_char_null:;
  s->str[0] = '\0';

reserve_return:;
  return s;
}

void string_delete(string* str) {
  free(str);
  str = MEM_FREE_ADDR; // when free set to a know address
}

string* string_resize(string* str, size_t len);

void string_copy(string* out, string* src) {
  printf("string_copy %p - %p\n", out, src);

  size_t src_len = src->length;

  if (src_len > out->size) {
    out = string_resize(out, src_len);
    printf("string_resized %p\n", out);
  }

  memcpy(out->str, src->str, src_len);
  out->length = src_len;
  //out->str[src_len] = '\0';
}

string* string_resize(string* str, size_t len) {
  printf("string_resize %p - %lu\n", str, len);

  string* out = string_new(len);

  string_copy(out, str);

  free(str);
  //str = MEM_RESIZE_ADDR; // when free set to a know address

  return out;
}


string* str_repeat(string* input, size_t mult) {
  string *result; /* Resulting string */
  size_t	result_len; /* Length of the resulting string */
  /* Don't waste our time if it's empty */
  /* ... or if the multiplier is zero */
  if (input->length == 0 || mult == 0) {
    return string_new(0);
  }

  /* Initialize the result string */
  result_len = input->length * mult;
  result = string_new(result_len);
  /* Heavy optimization for situations where input string is 1 byte long */
  if (input->length == 1) {
    memset(result->str, *(input->str), mult);
  } else {
    char *s, *e, *ee;
    //TODO review: ptrdiff_t l=0;
    size_t l=0;
    memcpy(result->str, input->str, input->length);
    s = result->str;
    e = result->str + input->length;
    ee = result->str + result_len;
    while (e<ee) {
      l = (e-s) < (ee-e) ? (e-s) : (ee-e);
      memmove(e, s, l);
      e += l;
    }
  }
  result->str[result_len] = '\0';
  return result;
}



void string_copy(string** out, char* src) {
  printf("string_copy %p - chars* %p\n", *out, src);
  size_t len = strlen(src);
  if (len > (*out)->size) {
    // don't resize, avoid copy!
    //*out = string_resize(*out, len);

    string_delete(*out);
    *out = string_new(len);
    printf("string_resized %p\n", *out);
  }
  (*out)->length = len;
  strcpy((*out)->str, src);
}


static char hexconvtab[] = "0123456789abcdef";
string* string_bin2hex(const string* old) {
  string *result = string_new(old->length * 2);
  size_t i, j;
  char* str = result->str;
  for (i = j = 0; i < old->length; i++) {
    *(str + j) = hexconvtab[old->str[i] >> 4];
    ++j;
    *(str + j) = hexconvtab[old->str[i] & 15];
    ++j;
  }
  result->str[j] = '\0';
  return result;
}

/**
* bindec, 2
* octdec, 8
* hexdec, 16
*/
double string_from_base(string *str, int base) {
  size_t num = 0;
  double fnum = 0;
  size_t i;
  int mode = 0;
  char c, *s = str->str;
  size_t cutoff;
  int cutlim;

  cutoff = INT64_MAX / base;
  cutlim = INT64_MAX % base;
  for (i = str->length; i > 0; i--) {
    c = *s++;
    printf("%zu %c\n", i, c);
    /* might not work for EBCDIC */
    if (c >= '0' && c <= '9') {
      c -= '0';
    } else if (c >= 'A' && c <= 'Z') {
      c -= 'A' - 10;
    } else if (c >= 'a' && c <= 'z') {
      c -= 'a' - 10;
    } else {
      continue;
    }
    printf("%d\n", c);

    if (c >= base) {
      continue;
    }

    switch (mode) {
      case 0: /* Integer */
      if (num < cutoff || (num == cutoff && c <= cutlim)) {
        num = num * base + c;
        break;
      } else {
        fnum = (double)num;
        mode = 1;
      }
      /* fall-through */
      case 1: /* Float */
      fnum = fnum * base + c;
    }
  }

  if (mode == 1) {
    return fnum;
  }

  return num;
}

/*
* Convert a long to a string containing a base(2-36) representation of
* the number.
* decbin, 2
* decoct, 8
* dechex, 16
*/
string* string_from_number(size_t value, int base) {
  static char digits[] = "0123456789abcdefghijklmnopqrstuvwxyz";
  string* result;
  char *ptr;
  char *end;
  char buf[(sizeof(double) << 3) + 1]; // max for binary

  end = ptr = buf + sizeof(buf) - 1;
  *ptr = '\0';
  // reverse buffer filling data, ptr will be char* containing data
  do {
    *--ptr = digits[value % base];
    value /= base;
  } while (ptr > buf && value);
  //?? *end = '\0';
  // size
  result = string_new(end - ptr);
  string_copy(&result, ptr);
  //result->length = end - ptr;
  return result;
}

int main(int argc, const char * argv[]) {

  string* s = string_new(2);
  printf("start string %p\n", s);
  assert(s->length == 0);
  assert(s->size == 3);
  assert(s->str[0] == '\0');

  string_copy(&s, "hello world!");

  assert(s->length == 12);
  assert(s->size == 13);

  printf("%s\n", s->str);

  printf("end string %p\n", s);
  string_debug(s);

  string_copy(&s, "hello my friend i'm even larger!!");
  string_debug(s);

  string_copy(&s, "niño ☃");
  string_debug(s);

  printf("\n\n-- str_repeat\n\n");

  string* srepeat = str_repeat(s, 2);
  string_debug(srepeat);

  printf("\n\n-- string_bin2hex\n\n");

  string_copy(&s, "123");
  string* hex = string_bin2hex(s);
  string_debug(hex);


  printf("\n\n-- string_from_base\n\n");

  string_copy(&s, "101");
  double d = string_from_base(s, 2);
  printf("string_from_base result: %f", d);

  printf("\n\n-- string_from_number\n\n");

  string* binstr = string_from_number(5, 2);
  string_debug(binstr);

  printf("\n\n-- delete all\n\n");

  string_delete(binstr);
  string_delete(hex);
  string_delete(s);
  string_delete(srepeat);

  return 0;
}
