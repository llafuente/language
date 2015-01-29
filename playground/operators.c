
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

// for atomic operations
// #include <stdatomic.h>

//#define TYPE atomic_int
#define TYPE int

// always inline!
inline TYPE add(TYPE a, TYPE b) __attribute__((always_inline));


TYPE add(TYPE a, TYPE b) {
  return a + b;
}

TYPE substract(TYPE a, TYPE b) {
  return a - b;
}


TYPE multiply(TYPE a, TYPE b) {
  return a * b;
}

TYPE divide(TYPE a, TYPE b) {
  return a / b;
}

TYPE mod(TYPE a, TYPE b) {
  return a % b;
}

bool logical_or(TYPE a, TYPE b) {
    return a || b;
}

bool logical_and(TYPE a, TYPE b) {
    return a && b;
}

TYPE bitwise_or(TYPE a, TYPE b) {
    return a | b;
}

TYPE bitwise_xor(TYPE a, TYPE b) {
    return a ^ b;
}

TYPE bitwise_and(TYPE a, TYPE b) {
    return a & b;
}

bool relational_gt(TYPE a, TYPE b) {
    return a > b;
}

bool relational_lt(TYPE a, TYPE b) {
  return a < b;
}

bool relational_egt(TYPE a, TYPE b) {
  return a >= b;
}

bool relational_elt(TYPE a, TYPE b) {
  return a <= b;
}

TYPE shift_left(TYPE a, TYPE b) {
    return a << 1;
}

TYPE shift_right(TYPE a, TYPE b) {
    return b >> 1;
}

TYPE unary_increment(TYPE a, TYPE b) {
    return a++;
}

TYPE unary_decrement(TYPE a, TYPE b) {
  return a--;
}

void function_call_int(int a);
void function_call_ptr(char* a);
void function_call_ref(int* a);

void function_call() {
  int a = 1;

  function_call_int(a);

  char* b = 0;

  function_call_ptr(b);

  int c = 2;

  function_call_ref(&c);


}
