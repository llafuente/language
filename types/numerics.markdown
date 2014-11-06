## Number types

Any number type has the following properties.

* .EPSILON

  This is a mutable value, but default is always 0, for every type.

  Designed to avoid floating-points errors, you should set EPISILON in your main file to your desired/app specific value. And you can happily do == in floating points numbers.

* .INFINITY

* .MINFINITY

* .MAX

  Maximum number represented

* .MIN

  Minimum number represented

* .MIN_RES

  Minimum resolution.

  1 for integers

  [STUDY] f32 & f64

* .ROUND

  0 toward zero
  1 to nearest
  2 toward positive infinity
  3 toward negative infinity

* .NULL

  Default value for a not initialized number.