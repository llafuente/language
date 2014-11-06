## if


```
if [(] test [)] { // braces are mandatory

} [else if [(] test [)] {
} [else {
}]
```



### if AST

```json
IfStatement <: Statement {
    "type": "if-statement",
    "test": ConditionStatement,
    "body": BlockStament
    "consequent": Statement
    "alternate": Statement
}
```
