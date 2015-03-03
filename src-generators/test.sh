#!/bin/sh

sh generate.sh

llvm-link -S -o math-test-linked.ll ../src/math.ll test.ll
LD_PRELOAD=openlibm/libopenlibm.so lli math-test-linked.ll

# output should be 2.00000 :)
