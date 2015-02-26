#!/bin/sh

node math.js

# -0s readable
clang -g -O0 -S -emit-llvm -std=c11 math.c -o ../src/dmath.ll
clang -O0 -S -emit-llvm -std=c11 math.c -o ../src/math.ll

# openlibm
HOME=`pwd`
INCLUDE_PATHS="-I${HOME}/openlibm/src -I${HOME}/openlibm -I${HOME}/openlibm/include -I${HOME}/openlibm/ld80 -I${HOME}/openlibm/amd64"
clang -S -emit-llvm $(INCLUDE_PATHS) -fno-builtin -std=c99 -Wall -O0 -DASSEMBLER -D__BSD_VISIBLE -Wno-implicit-function-declaration -fPIC openlibm.c -o openlibm.ll
