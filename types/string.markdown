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
  
  Aliases: `slice`

* **substring** (*string* str, *ui64* start != nan < str.length, *ui64* end = str.length != nan < str.length)

  The substring method takes two arguments, start and end, and returns a substring
  of the result of converting this object to a String, starting from character position
  start and running to, but not including, character position end of the String
  (or through the end of the String is end is undefined). The result is a String value,
  not a String object
  
  If start is larger than end, they are swapped.

* **concat** (*string* str, *string* str2)

  Return str modified, result of concatenate str and str2.

* **concat** (clone *string* str, *string* str2)

  Return a new string, result of concatenate str and str2.

  Aliased to `operator +`

* **resize** (*string* str, *ui64* size)

  Reallocate memory.

* **char_at** (*string* str, *ui64* pos)

  Returns a String containing the character at position pos in the String resulting from
  converting this object to a String. If there is no character at that position, the result
  is the empty String. The result is a String value, not a String object.
  
  Shorthand of: `substring(str, pos, pos+1)`

* **char\_code_at** (*string* str, *ui64* pos) : ui64

  Returns a Number (a nonnegative integer less than 2<sup>16</sup>) representing the code
  unit value of the character at position pos in the String resulting from converting this
  object to a String. If there is no character at that position, the result is `nan`.

* **code\_point_at**
* **index_of**(*string* haystack, *string* needle, *ui64* offset = 0, *bool* case_insensitive = false) : *ui64*

  Find the position of the first occurrence of a substring in a string

* **contains** (*string* haystack, *string* needle, *bool* case_insensitive = false) : *bool*

  Find if *needle* can be found into *haystack*.

* **last\_index_of** (*string* haystack, *string* needle, *ui64* offset = 0, *bool* case_insensitive = false) : *bool*

  Find the position of the last occurrence of a substring in a string.
  
  *offset*: If specified, search will start this number of characters counted from the beginning of the string.
  If the value is negative, search will instead start from that many characters from the end of the string,
  searching backwards. 

* **replace** (*string* str, *string* search, *string* replace, *bool* case_insensitive = false, *ui64* count = null)
* **replace** (*string* str, *array* search, *string* replace, *bool* case_insensitive = false, *ui64* count = null)
* **replace** (*string* str, *array* search, *array* replace, *bool* case_insensitive = false, *ui64* count = null)

  Replace all occurrences of the search string with the replacement string
 
  *count* If passed, this will be set to the number of replacements performed. 

* **locale_compare**
* **match** (*string* str, *regexp* reg_exp, *ui64* start = 0, *ui64* end = str.lenght) : *bool*

* **ocurrences** (*string* haystack, *string* needle) : array

  Returns a list of indexes with the ocurrences of *needle* into *haystack*.
  
* **split** (*string* str, *string* delimiter, *ui64* limit = infinity) : *array*
* **split** (*string* str, *regexp* delimiter, *ui64* limit = infinity) : *array*
 
  Returns an array of strings, each of which is a substring of str formed by splitting
it on boundaries formed by the string delimiter. 

  If limit is set and positive, the returned array will contain a maximum of limit elements
  with the last element containing the rest of string.
  
  If the limit parameter is negative, all components except the last -limit are returned.

  alias: `explode`

* **lowercase**(*string* str, *bool* use_locale = true)

  Returns string with all alphabetic characters converted to lowercase.
  
  if *use_locale* is `true` use current locale options to lowercase. Otherwise locale "C" will be used.

* **uppercase**

  Returns string with all alphabetic characters converted to uppercase.
  
  if *use_locale* is `true` use current locale options to uppercase. Otherwise locale "C" will be used.

* **trim** (*string* str, *string* character_mask = " \t\n\r\0\x0B")

  Strip whitespace (or given characters) from the beginning and end of a string

* **ltrim** (*string* str)

  Strip whitespace (or given characters) from the beginning of a string

* **rtrim** (*string* str)

  Strip whitespace (or given characters) from the beginning and end-

* **lcfirst** (*string* str)

  Lowercase first leter

* **ucfirst** (*string* str)

  Uppercase first leter

* **chunk_split** (*string* body, *ui64* chunklen = 64, *string* end = "\r\n") : *array*

  Split a string into smaller chunks

* **nl2br** (*string* string, *bool* is_xhtml = true): *string*

  Returns string with '<br />' (`is_xhtml = true`) or '<br>' (`is_xhtml = false`) inserted
  before all newlines (`\r\n`, `\n\r`, `\n` and `\r`). 

* **parse_qs** (*string* str): *array*

  Parses str as if it were the query string passed via a URL.

* **parse_url**(*string* str): *object*

  This function parses a URL and returns an object containing any of the various
  components of the URL that are present. 
  
  Returned *object*
  ```
  {
    "scheme": string, // http, https, ftp...
    "host": string, // clean host, no ended with "/"
    "user": string,
    "pass": string,
    "path": string, // starts with "/"
    "query": string, // querystring
    "fragment": string,
  }
  ```
  Parses str as if it were the query string passed via a URL.

* **parse_csv** (*string* input, *string* delimiter = ",", *string* enclosure = '"', *string* escape = "\\"): *array*

  Parses a string input for fields in CSV format and returns an array containing the fields read.
  
* **parse_json** (*string* input): *object*
 
  **TODO** study, this return an object ?

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
