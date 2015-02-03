#!/bin/sh

sudo apt-get install libtool
sudo apt-get install automake1.9
sudo yum install -y libtool automake

cd /tmp
wget https://github.com/libuv/libuv/archive/v1.3.0.tar.gz -o libuv.tar.gz

tar xsfv libuv.tar.gz
cd libuv*

sh autogen.sh
./configure
make
make check
#make install
