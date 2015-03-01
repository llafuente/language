# plee language

What are you going to find here...
Plee language documentation and compiler implementation notes.

## Breaf introduction

Things that the compiler *will do* for you.

* Run tests (with code coverage) and benchmarks.

* Documentation generation.

* Export module interface in a clean file.
Something like header file in c/cpp.

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

* No uppercases. Everything is lowercased and *case sensitive*.
*False* is not `false`. *False* don't exists.

* Every type has a `null` value.

* Lazy typed (mix between dynamically typed and strong typed)

* Comments are part of the language, cannot be everywhere,
only at statement level.

* **Experimental** *pass-by-reference* everything. You can clone everything easily.

## Philosophy behind the language

* Error prone. Programming language es hard enough to introduce
"undefined behaviours".

* Easy to learn (aprochable) and clean syntax.

* Easy to code & be lazy.

* Readability & version control friendly.

* Powerfull extensive core.

* No hierarchy (Object Oriented programming).
Forget interfaces, abstract classes, protected methods, extends... Just plain and simple objects.

* Be nice target for other languages. There is much code out there,
playing nice with other languages it's important to us.


## Nomeclature

Experimental.

Not sure of the real usage, implemntation, possiblity... just an idea that
could be cool, but don't know exactly how to make it true, in a resonable time
and error prone. (help is welcome :)

Propossal.

Something that can change a lot while implementation occurs, and
most of those changes will fill the doc and not he other way.

Study

After some more study will "upgrade" to Propossal or Experimental.
