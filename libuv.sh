#!/bin/sh

cd /tmp
wget https://github.com/libuv/libuv/archive/v1.3.0.tar.gz

sh autogen.sh
./configure
make
make check
#make install
