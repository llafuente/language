
#sudo apt-get install cmake
sudo yum install cmake
sudo yum install libffi-devel

# gcc 4.7 ubuntu
#sudo add-apt-repository ppa:ubuntu-toolchain-r/test
#sudo apt-get update
#sudo apt-get install gcc-4.7 g++-4.7
#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
#sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7
#sudo update-alternatives --config gcc
#sudo apt-get install libffi-dev


mkdir -p /tmp/llvm
cd /tmp/llvm
#git clone --depth 1 git@github.com:llvm-mirror/llvm.git .
wget http://llvm.org/releases/3.5.1/llvm-3.5.1.src.tar.xz
wget http://llvm.org/releases/3.5.1/cfe-3.5.1.src.tar.xz
wget http://llvm.org/releases/3.5.1/compiler-rt-3.5.1.src.tar.xz

#mkdir tools
#mkdir projects

tar -xf llvm-3.5.1.src.tar.xz -C .
cd llvm-*

tar -xf ../cfe-3.5.1.src.tar.xz -C tools
tar -xf ../compiler-rt-3.5.1.src.tar.xz -C projects
mv tools/cfe-3.5.1.src tools/clang
mv projects/compiler-rt-3.5.1.src projects/compiler-rt




sed -e "s:/docs/llvm:/share/doc/llvm-3.5.1:" -i Makefile.config.in

CC=gcc CXX=g++            \
./configure --prefix=/usr        \
--sysconfdir=/etc    \
--enable-libffi      \
--enable-optimized   \
--enable-shared      \
--disable-assertions &&
make


sudo make install
