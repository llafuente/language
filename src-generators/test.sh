#!/bin/sh

sh generate.sh

llvm-link -S -o math-test-linked.ll ../src/math.ll math-test.ll
lli math-test-linked.ll
# output should be 2.00000 :)
