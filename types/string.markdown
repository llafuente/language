## string

`string` store UTF-8 characters (maybe unicode).

### instance properties

* *ui64* size = 0 [readonly]

  bytes allocated, remember that UTF-8 is multibyte.

* *ui64* used = 0 [readonly]

  bytes currently in use.

* *ui64* length = 0 [readonly]

  Number of characters

### operators

* `[]` access to a single character first byte.
* `+` concatenate two strings
* `>` & `<` compare two strings
* `=` overwrite lhs and resize if needed

### instance methods

* **substr** (*string* str, *ui64* start, *ui64* length = infinity)

  The substr method takes three arguments, and returns str modified, result of
  starting from position start and running for length code units
  (or through the end of the string). If start is negative,
  it is treated as (str.length + start).

* **substring** (*string* str, *ui64* start, *ui64* end)

* **_concat** (*string* str, *string* str2)

  `+` alias.

* **concat** (*string* str, *string* str2)

  Return str modified, result of concatenate str and str2.

* **resize** (*string* str, *ui64* size)

  Reallocate memory.

* charAt
* charCodeAt
* codePointAt
* contains
* concat
* indexOf
* lastIndexOf
* length
* localeCompare
* match
* replace
* search
* slice
* split|explode
* substr
* substring
* toLocaleLowerCase
* toLocaleUpperCase
* toLowerCase
* toUpperCase
* trim
* trimLeft
* trimRight

* lcfirst
* ucfirst

* chunk_split

  Split a string into smaller chunks

  `string chunk_split ( string $body [, int $chunklen = 76 [, string $end = "\r\n" ]] )`

* [nl2br](http://php.net/manual/en/function.nl2br.php)

  Calculates the crc32 polynomial of a string

One-way string hashing

* [ord](http://php.net/manual/en/function.ord.php)
* parse_http_get

#### crypto related

* [crypt](http://php.net/manual/en/function.crypt.php)
* [sha1](http://php.net/manual/en/function.sha1.php)
* [md5](http://php.net/manual/en/function.md5.php)
* [crc32](http://php.net/manual/en/function.crc32.php)


### string properties (under study)

* *ui64* pool_size = 1m [mutable]

  Determine the minimum memory reserved anytime for string operations.

* *ui64* max_size = 2m [mutable]

  From this point memory will be released if destruction happens, and meet certain criteria.

* *ui32* deallocations [readonly]

  Counter

* *ui32* .allocations [readonly]

  Counter

* *f32* .fragmentation [readonly]

  Fragmentation factor.


### string allocation function (under study)

* .defrag **TODO** study more

  Sort all memory strings in a new place.

**TODO** Study more.

support memory management profiles/allocators?
* continuous pool
* on demand

* ord, make sense ? will be utf-16
* base64 where?
* number_format where?
* currency_format where?
