## Objects

Abstract data type composed of a collection of (key, value) pairs.

Keys are always a unique string.
Numbers cannot be assigned without casting. Because `!` operator need to be sure of what type are involved ([see below](#!operator)).

Values are pointers and can be repeated.

Objects are declared using JSON-like format.
Last comma is required (atm) for version control system cleaning.

```syntax
object-declaration
'{' (object-property-declaration)* '}'

object-property-declaration
string-literal ':' (literal|expression) ','
var_identifier ':' (literal|expression) ','
```

```
var d;
var xxx = {
  "a": "world",
  "b": hello(), // function
  "c": variable, // variable, dont forget the last comma!
  d: hello(), // variable as key :)
};
```

### methods
* `$has` **object** obj, **string** key : **bool**

  Return if given key is defined.

* `$keys` **object** obj : **array**

  Returned keys are always sorted.

* `$get` **object** obj, **string** key, **bool** safe = false) : **any**

  Get value, if `safe=false` will raise a run-time-error

* `$set` **object** obj, **string** key, **ptr** value) : **bool**

  Set/overwrite given key with given value.

  if the key stats with `$` a runtime error is raised.

* `$delete` **object** obj, **string** key : **any**

  Remove given key and return pointer or null.

* `$setter` **object** obj, *fn* **sttr** = null : **function**

  Set a setter function that will be called before each set.

  if null is provided will remove the previous setter.

* `$getter` **object** obj, *fn* **gttr** = null : **function**

  Set a getter function that will be called before each get.

  if null is provided will remove the previous getter.


## `?` exits operator (nested `$has` shortcut)

Object has a special method `$has` but it recommended to use the `?` operator for readability purposes.

```
if xxx.say.hello? {
  // do something
}

if xxx.hello? == 10 { // expanded to xxx.$has("hello") && xxx.hello == 10
  // do something
}
```

Compiler will expand this operator using $has

> xxx.say.hello?

```
xxx.$has("say") ? (xxx.say.$has("hello") ? xxx.say.hello : null)  : null
```

**TODO** review, this operator is maybe safe at the begining.

## `?` safe asignament

`?` operator can be used in assignment expressions.
Compiler will expand your code and give you a reasonable collection of runtime-errors.

> xxx.first.second.third? = "just a string";

```
if (!xxx.$has("first")) error "xxx has no index 'first'";
if ("object" === typeof xxx.$get("first")) error "invalid type of xxx.first";

if (!xxx.$get("first").$has("second")) error "undefined xxx.first";
if ("object" === typeof xxx.$get("first").$get("second")) error "invalid type of xxx.first.second";

//...
xxx.$get("first").$get("second").$get("third")[0] = "just a string";
```

Because key in objects are always string, safe assignaments will initialize arrays if a number is found.

```
? xxx.first.second.third[0] = "just a string";

// expanded...
if (!xxx.$has("first")) error "undefined xxx.first";
if ("object" === typeof xxx.$get("first")) error "invalid type of xxx.first";

if (!xxx.$get("first").$has("second")) error "undefined xxx.first";
if ("object" === typeof xxx.$get("first").$get("second")) error "invalid type of xxx.first.second";

//...
xxx.$get("first").$get("second").$get("third")[0] = "just a string";
```

<a name="!operator"></a>
## `!` force asignament

A more inteligent compiler should now how to assign complex things based just on knowing the first one.

```
var obj = {};

obj.say.hello! = "hola";

log typeof obj.say;
// stdout: object
log typeof obj.say.hello;
// stdout: string

var obj2 = {};
obj2.list[3]! = 55;

log obj2.toJSON();
// stdout: {"list": [null, null, null, 55]}

```
