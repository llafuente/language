# plee language

What are you going to find here...
Plee language documentation and compiler implementation notes.

## Breaf introduction

Things that the compiler *will do* for you.

* Testing - continuous integration (CI) and code coverage
at compile time.

* Documentation. Plee has type inference so we need a way to export
that information, we build a basic documentation.

* Export module interface in a clean file.
Something like header file in c.

* Benchmarks.

* Code expansion and beautifier. Plee is full of shortcuts that
generate code, code expansion display the full code that will be
executed.

* Powerfull type introspection.

Things that you should now before the *shocking news*.

* No classes hierarchy. plee propose modules as replacement.
Also, do not expect `this` as reserved word...

* Auto scope. A variable use `function scope` or `block scope` automatically.

* Robust memory management, focus on no leaks a proper error display
for easy debugging.

* Curly braces are mandatory *everywhere* but you can avoid using parenthesis :)

* *pass-by-reference* everything to improve performance. You can clone
everything easily.

* No uppercases. Everything is lowercased and *case sensitive*.
*False* is not *false*.

* Every type has a `null` value.

* Lazy typed (mix between dynamically typed and strong typed)

* Comments are part of the language, cannot be everywhere,
only at statement level.


## Philosophy behind the language

* Error prone. If something is powerful but introduce errors,
need to be reconsidered at least.

* Easy to learn. You will see many reserved words,
mostly because clarify things.

* Easy to code & be lazy.

* Readability & version control friendly.

* Powerfull extensive core.

* No hierarchy (Object Oriented programming).
Forget interfaces, abstract classes, protected methods, extends... Just plain and simple objects.

* Be nice target for other languages. There is much code out there,
playing nice with other languages it's important to us.s
