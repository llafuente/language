int main() {
    int a = 1, b = 2;
    auto func = [&] () { return a + b; };
    int i = func(); // now call the function
}
