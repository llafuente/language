## swap
swap variable names.

swap x y;


### swap AST

```json
SwapStatement <: Statement {
    "type": "swap-statement",
    "left": Idenfier,
    "right": Idenfier
}
```
