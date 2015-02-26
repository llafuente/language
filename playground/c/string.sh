#!/bin/sh

reset

echo
echo "--- LLVM IR --"
echo
#1>&2
clang -S -emit-llvm -O0 -std=c++11 -Wgcc-compat -Wall -v string.cpp &> /dev/null || exit 1
echo
echo "--- COMPILE --"
echo
clang string.cpp -o string -std=c++11  || exit 1

#less string.ll

echo ""
echo "exec "

valgrind --track-origins=yes --leak-check=full -v ./string
echo ""
echo "----"
echo ""
./string
