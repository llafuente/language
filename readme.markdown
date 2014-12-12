# plee language

Things that the compiler *must do*.

* Continuous integration. Nowadays is mandatory. This also add some
responsibility in the language that need to support a basic-extendable
testing system.

* Code coverage. Extracting the information from ci generate a report of
the dangers in the code.

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


Philosophy

* Error prone. If something is powerful but introduce errors,
need to be reconsidered at least.

* We don't worry much about so many reserved words, because clarify things.

* Easy to code, easy to be lazy, readability & version control friendly.
