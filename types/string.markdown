## string

`string` store UTF-8 characters (maybe unicode).

Study support memory management profiles/allocators
- continuous pool
- on demand

### instance properties

* ui64 size = 0 [readonly]

  bytes allocated, remember that utf-8 is multibyte.

* ui64 used = 0 [readonly]

  byte in use.

* ui64 length = 0 [readonly]

  Number of characters


### instance methods

* [] access to a single character

* substr
* substring
* concat
* resize


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


#### study
* ord, make sense ? will be utf-16
* base64 where?
* number_format where?
* currency_format where?


### string properties:

* ui64 pool_size = 1m [mutable]

  Determine the minimum memory reserved anytime for string operations.

* ui64 max_size = 2m [mutable]

  From this point memory will be released if destruction happens, and meet certain criteria.

* ui32 deallocations [readonly]

  Counter

* ui32 .allocations [readonly]

  Counter

* f32 .fragmentation [readonly] [TODO-study]

  Fragmentation factor.


Functions:

* .defrag [TODO-study]

  Sort all memory strings in a new place.

Instances properties

* ui32 length

  readonly length

* pX .p

  readonly pointer to the beginning of the string.

  !!!TODO what type of pointer can be used for multibyte utf-8/unicode

* [index]