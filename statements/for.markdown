## for

```
for [(][init;]condition; after_loop[)] {

} [else {
    // executed if condition fails the first time
}]

```

### for AST

```json
ForStatement <: Statement {
    "type": "for-statement";
    "init": VariableDeclaration | Expression | null;
    "test": Expression | null;
    "update": Expression | null;
    "body": BlockStatement;
}
```


## for in

```
for [(][key, ] value in iterable[)] {

} [else {
    // executed if condition fails the first time
}]
```

## short for

```
for iterable {
    $value // is automatically declared
    $key // is automatically declared
    // cannot be nested!
} [else {
    // executed if condition fails the first time
}]
```

### for in AST
```json
ForInStatement <: Statement {
    "type": "forin-statement";
    "key": Identifier | null;
    "value": Identifier;
    "iterable": Identifier;
    "body": BlockStatement;
}
```