# plee language

Things that the compiler must do.

* Continuous integration. Nowadays is mandatory. This also add some responsibility in the language that need to support a basic-extendable testing system.

* Code coverage. Extracting the information from ci generate a report of the dangers in the code.

* Documentation. Basic and extendable. Most important, don't need much information from doc-blocks, should implicity extract information from the code, that will give users extra information about what the are doing 'in theory'.

* Benchmarks. Once again, basic and extendable.


Things that you should now before the shocking news.

* No classes. The concept of classes is not necessary in plee, you will see why, soon enough.

* Function scope rather than block scope.

* Robust memory management, focus on no leaks a proper error display for easy debugging.

* Braces are mandatory everywhere but you can avoid using parenthesis :)

* Everything is a reference for speed. You can clone everything easily (I assure you)
