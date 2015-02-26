#!/bin/sh

reset

echo
echo "--- LLVM IR --"
echo
#1>&2
clang -S -emit-llvm -O0 -std=c++11 -Wgcc-compat -Wall -v array.cpp &> /dev/null || exit 1
echo
echo "--- COMPILE --"
echo
clang array.cpp -o array -std=c++11  || exit 1

#less array.ll

echo ""
echo "exec "

valgrind --track-origins=yes --leak-check=full -v ./array
echo ""
echo "----"
echo ""
./array


opt array.ll --time-passes -inline -S -o array-inline.ll
