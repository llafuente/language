

int add(int a, int b) {
  return a + b;
}

int substract(int a, int b) {
  return a - b;
}


int multiply(int a, int b) {
  return a * b;
}

int divide(int a, int b) {
  return a / b;
}

int mod(int a, int b) {
  return a % b;
}

bool logical_or(int a, int b) {
    return a || b;
}

bool logical_and(int a, int b) {
    return a && b;
}

int bitwise_or(int a, int b) {
    return a | b;
}

int bitwise_xor(int a, int b) {
    return a ^ b;
}

int bitwise_and(int a, int b) {
    return a & b;
}

void relational(int a, int b) {
    bool b;

    b = a < b;
    b = a <= b;
    b = a > b;
    b = a >= b;
}

void shift(int a, int b) {
    int c;

    c = a << 1;
    c = b >> 1;
}

void unary(int a, int b) {
    a++;
    b--;
}
