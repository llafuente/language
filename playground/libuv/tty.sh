#!/bin/sh -x

# gcc tty.c /usr/local/lib/libuv.a -o tty -lrt -pthread
clang tty.c /usr/local/lib/libuv.a -o tty -lrt -pthread
