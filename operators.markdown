## Operators

| Precedence | Operator type | Associativity | Individual operators |
|---|---|---|---|---|
| 0 | Grouping | n/a | ( … ) |
| 1 | Member Access | left-to-right | *lhs* **.** *rhs* |
| 1 | Computed Member Access | left-to-right | *lhs* [ … ] |
| 1 | new (with argument list) | n/a | new … ( … ) |
| 2 | Function Call | left-to-right | *lhs* (…) |
| 2 | new (without argument list) | right-to-left | new *rhs* |
| 3 | Postfix Increment | n/a | *lhs* ++ |
| 3 | Postfix Decrement | n/a | *lhs* -- |
| 4 | Logical NOT | right-to-left | ! *rhs* |
| 4 | Bitwise NOT | right-to-left | ~ *rhs* |
| 4 | Unary Plus | right-to-left | + *rhs* |
| 4 | Unary Negation | right-to-left | - *rhs* |
| 4 | Prefix Increment | right-to-left | ++ *rhs* |
| 4 | Prefix Decrement | right-to-left | -- *rhs* |
| 4 | typeof | right-to-left | typeof *rhs* |
| 4 | delete | right-to-left | delete *rhs* |
| 4 | resize | right-to-left | resize *rhs* |
| 4 | Exits operator | n/a | *lhs*? |
| 5 | Multiplication | left-to-right | *lhs* \* *rhs* |
| 5 | Division | left-to-right | *lhs* / *rhs* |
| 5 | Remainder | left-to-right | *lhs* % *rhs* |
| 6 | Addition | left-to-right | *lhs* + *rhs* |
| 6 | Subtraction | left-to-right | *lhs* - *rhs* |
| 7 | Bitwise Left Shift | left-to-right | *lhs* << *rhs* |
| 7 | Bitwise Right Shift | left-to-right | *lhs* >> *rhs* |
| 8 | Less Than | left-to-right | *lhs* < *rhs* |
| 8 | Less Than Or Equal | left-to-right | *lhs* <= *rhs* |
|   |                    |               | *lhs* ≤ *rhs* |
| 8 | Greater Than | left-to-right | *lhs* > *rhs* |
| 8 | Greater Than Or Equal | left-to-right | *lhs* >= *rhs* |
|   |                       |               | *lhs* ≥ *rhs* |
| 8 | force assignment | left-to-right | *rhs* ! |
| 9 | Equality | left-to-right | *lhs* == *rhs* |
| 9 | Floating point equality (inside epsilon range) | left-to-right | *lhs* ~= *rhs* |
| 9 | Inequality | left-to-right | *lhs* != *rhs* |
|   |            |               | *lhs* ≠ *rhs* |
| 9 | Address Equality | left-to-right | *lhs* @= *rhs* |
| 9 | Add/Append/Push | left-to-right | *lhs* [] *rhs* |
| 10 | Bitwise AND | left-to-right | *lhs* & *rhs* |
| 11 | Bitwise XOR | left-to-right | *lhs* ^ *rhs* |
| 12 | Bitwise OR | left-to-right | *lhs* &#124; *rhs* |
| 13 | Logical AND | left-to-right | *lhs* && *rhs* |
| 14 | Logical OR | left-to-right | *lhs* &#124;&#124; *rhs* |
| 15 | Conditional | right-to-left | *lhs* ? … : *rhs* |
| 16 | Safe assignment | right-to-left | *lhs* ?= *rhs* |
| 16 | Assignment | right-to-left | *lhs* = *rhs* |
| 16 | Assignment | right-to-left | *lhs* += *rhs* |
| 16 | Assignment | right-to-left | *lhs* -= *rhs* |
| 16 | Assignment | right-to-left | *lhs* \*= *rhs* |
| 16 | Assignment | right-to-left | *lhs* /= *rhs* |
| 16 | Assignment | right-to-left | *lhs* %= *rhs* |
| 16 | Assignment | right-to-left | *lhs* <<= *rhs* |
| 16 | Assignment | right-to-left | *lhs* >>= *rhs* |
| 16 | Assignment | right-to-left | *lhs* >>>= *rhs* |
| 16 | Assignment | right-to-left | *lhs* &= *rhs* |
| 16 | Assignment | right-to-left | *lhs* ^= *rhs* |
| 16 | Assignment | right-to-left | *lhs* &#124;= *rhs* |
| 17 | Cast operator | left-to-right | *lhs* as *type* |

<!--
| 17 | Spread | n/a | ... … |
| 18 | Comma / Sequence | left-to-right | *lhs* , *rhs* | </tbody>
| 4 | void | right-to-left | void *rhs* |
| 7 | Bitwise Unsigned Right Shift | left-to-right | *lhs* >>> *rhs* |
| 8 | in | left-to-right | *lhs* in *rhs* |
| 8 | instanceof | left-to-right | *lhs* instanceof *rhs* |
| 9 | Strict Equality | left-to-right | *lhs* === *rhs* |
| 9 | Strict Inequality | left-to-right | *lhs* !== *rhs* |
| 17 | yield | right-to-left | yield *rhs* |
-->


Mathematical operators need to be separated by `space` for readability
purposes and fully support UTF-8 as identifier.

```
var x = y + z; // ok
```

See more information about [var-idenfiers](#var-idenfiers)
```
var x = y+z; // compilation-error
// undefined variable x+z
```
