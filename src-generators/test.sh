#!/bin/sh

sh generate.sh

llvm-link -S -o math-test-linked.ll ../src/math.ll test.ll
LD_PRELOAD="openlibm/libopenlibm.so" lli math-test-linked.ll
#gcc -lpcre2-8 -llibopenlibm

# output should be 2.00000 :)

clang -S -emit-llvm -O0 pcre.c -o pcre.ll
LD_PRELOAD="openlibm/libopenlibm.so pcre2/.libs/libpcre2-8.so" lli pcre.ll
