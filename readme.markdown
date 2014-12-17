# plee language

What are you going to find here...
Plee language documentation and compiler implementation notes.

## Compiler (breaf intro)

Things that the compiler *must do*.

* Testing and continuous integration (CI) and code coverage at compile time.

* Documentation. Basic and extendable. Fill the gaps with information
from compiler.

* Export module interface in a clean file.

* Benchmarks. Once again, basic and extendable.

* Code expansion, beautifier. Most of the shorthands in plee require compiler
to generate code, better the user to see full code.

Things that you should now before the *shocking news*.

* No classes hierarchy. plee propose modules as replacement.
Also, do not expect `this` as reserved word...

* Function scope rather than block scope.

* Robust memory management, focus on no leaks a proper error display
for easy debugging.

* Braces are mandatory everywhere but you can avoid using parenthesis :)

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

* Easy to learn. We don't worry much about so many reserved words, because clarify things.

* Easy to code & be lazy.

* Readability & version control friendly.

* Powerfull extensive core.

* No hierarchy (Object Oriented programming).
Forget interfaces, abstract classes, protected methods, extends... Just plain and simple objects.
