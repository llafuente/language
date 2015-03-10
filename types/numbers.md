<a name="number-type"></a>
### Number types

Any number type has the following properties.

* .infinity

* .minfinity

* .max

  Maximum number represented

* .min

  Minimum number represented

* .min_resolution

  Minimum resolution.

  1 for integers

  [STUDY] f32 & f64

* .round

  round function behavior.

  0 toward zero
  1 to nearest
  2 toward positive infinity
  3 toward negative infinity

* .null

  Default value for a not initialized number.


Number with decimals has special properties

* *epsilon* = 0

  epsilon can be modified at compile time.

  If you set epsilon many times in your program, the last one prevail. So it's recommended to do it in the configuration file.

  When set, modify `a == b` to `-epsilon < (a - b) < epsilon`, So there is a performance hit, but avoid floating points errors.


Number representations

* binary

  * 0b[0-1]

  number will be truncated to nearest 8 byte possible.
  0b0101 (is in fact 0b00000101)

* hecadecimal

  * 0x(abcdef0123456789)
  * 0#(abcdef0123456789)

* octal

  * 0o(01234567)
  * 0c(01234567)


bitmask dir {
  north, // =1,
  east,  // = 2,
  south, // = 4,
  west   // = 8
}

var dir diagonal = dir.north | dir.east;



#### Safe mode

Safe mode wrap some operations, giving runtime-errors if something
happends:

* [Arithmetic underflow](http://en.wikipedia.org/wiki/Arithmetic_underflow)
* [Arithmetic overflow](http://en.wikipedia.org/wiki/Arithmetic_overflow)
* Division by cero

Otherwise you will have to deal with undefined behaviour or `nan` (not a number)

Safe mode is slow, so it's not compiled by default. To enable use `-safe` compile option.
