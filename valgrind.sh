#!/bin/sh

cd /tmp/
wget https://github.com/svn2github/valgrind/archive/master.tar.gz -o valgrind.tar.gz
tar -xf valgrind.tar.gz
cd valgrind*

cd valgrind
./autogen.sh
./configure
make
make install
