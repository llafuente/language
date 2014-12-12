## string

`string` store UTF-8 characters.

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

* **substr** (*string* str, *ui64* start != nan, *ui64* length = infinity != nan)

  The substr method takes three arguments, and returns str modified, result of
  starting from position start and running for length code units
  (or through the end of the string). If start is negative,
  it is treated as (str.length + start).

* **substring** (*string* str, *ui64* start != nan < str.length, *ui64* end = str.length != nan < str.length)

  The substring method takes two arguments, start and end, and returns a substring
  of the result of converting this object to a String, starting from character position
  start and running to, but not including, character position end of the String
  (or through the end of the String is end is undefined). The result is a String value,
  not a String object
  
  If start is larger than end, they are swapped.

* **concat** (*string* str, *string* str2)

  Return str modified, result of concatenate str and str2.
  
  Aliased to `operator +`

* **resize** (*string* str, *ui64* size)

  Reallocate memory.

* **char_at** (*ui64* pos)

  Returns a String containing the character at position pos in the String resulting from
  converting this object to a String. If there is no character at that position, the result
  is the empty String. The result is a String value, not a String object.
  
  Shorthand of: `substring(str, pos, pos+1)`

* **char\_code_at** (*ui64* pos) : ui64

  Returns a Number (a nonnegative integer less than 2<sup>16</sup>) representing the code
  unit value of the character at position pos in the String resulting from converting this
  object to a String. If there is no character at that position, the result is `nan`.

* code\_point_at
* contains
* index_of
* last\_index_of
* length
* locale_compare
* match
* replace
* search
* slice
* split|explode
* substr
* substring
* to\_lower_locale
* to\_upper_locale
* lowercase
* uppercase

* **trim** (*string* str, *string* character_mask = " \t\n\r\0\x0B")

  Strip whitespace (or given characters) from the beginning and end of a string

* ltrim
* rtrim

* **lcfirst** ()

  Lowercase first leter

* **ucfirst**

  Uppercase first leter

* **chunk_split** (*string* body, *ui64* chunklen = 64, *string* end = "\r\n") : *array*

  Split a string into smaller chunks

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
