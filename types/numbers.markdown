## Number types

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