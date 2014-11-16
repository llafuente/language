## Objects

Abstract data type composed of a collection of (key, value) pairs.

Keys are always a unique string, number cannot be assigned without casting.

Values are pointers and can be repeated.

Objects are declared using JSON-like format.
Last comma is required (atm) for version control system cleaning.

var xxx = {
  "hello": "world",
  "world": hello(), // function
  "world": variable, // variable, dont forget the last comma!
};

### methods
* `#has`(**key**:**string**) : **boolean**

  Return if given key is defined. 

* `#keys`() : **array**

  Returned keys are always sorted. 

* `#get`(**key**:**string**, **safe**:**boolean** = false) : **pointer**

  Get value, if `safe=false` will raise a run-time-error

* `#set`(**key**:**string**, **value**:**pointer**) : **boolean**

  Set/overwrite given key with given value. 

* `#delete`(**key**:**string**) : **pointer**

  Remove given key and return pointer or null.

* `#setter`(**sttr**: **function** = null) : **function**

  Set a setter function that will be called before each set. 

* `#getter`(**gttr**: **function** = null) : **function**

  Set a getter function that will be called before each get.


## test if key exist (?)

Object has a special method ``#has` but it recommended to use the `?` operator.

```
if xxx.hello? { // expanded to xxx.#has("hello")
  // do something
}

if xxx.hello? == 10 { // expanded to xxx.#has("hello") && xxx.hello == 10
  // do something
}
```

## safe asignament

`?` operator can be used in assignament expressions. Compiler will expand your code to make sure no runtime-error.

```
? xxx.first.second.third = "just a string";

// expanded...
if (!xxx.#has("first")) error "undefined xxx.first";
if ("object" === typeof xxx.#get("first")) error "invalid type of xxx.first";

if (!xxx.#get("first").#has("second")) error "undefined xxx.first";
if ("object" === typeof xxx.#get("first").#get("second")) error "invalid type of xxx.first.second";

//...
xxx.#get("first").#get("second").#get("third")[0] = "just a string";
```

Because key in objects are always string, safe assignaments will initialize arrays if a number is found.

```
? xxx.first.second.third[0] = "just a string";

// expanded...
if (!xxx.#has("first")) error "undefined xxx.first";
if ("object" === typeof xxx.#get("first")) error "invalid type of xxx.first";

if (!xxx.#get("first").#has("second")) error "undefined xxx.first";
if ("object" === typeof xxx.#get("first").#get("second")) error "invalid type of xxx.first.second";

//...
xxx.#get("first").#get("second").#get("third")[0] = "just a string";
```


