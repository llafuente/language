# plee language

Things that the compiler must do.

* Continuous integration. Nowadays is mandatory. This also add some responsibility in the language that need to support a basic-extendable testing system.

* Code coverage. Extracting the information from ci generate a report of the dangers in the code.

* Documentation. Basic and extendable. Fill the gaps with information from compiler.

* Benchmarks. Once again, basic and extendable.


Things that you should now before the shocking news.

* No classes. The concept of classes is not necessary in plee, you will see why, soon enough.

* Function scope rather than block scope.

* Robust memory management, focus on no leaks a proper error display for easy debugging.

* Braces are mandatory everywhere but you can avoid using parenthesis :)

* Everything is a reference to improve performance. You can clone everything easily.

* No uppercases. Everything is lowercased and case sensitive. False is not false.

* Every type has a `null` value.
