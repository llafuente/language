## if

### if-classic

```plee
if test {
    // note: braces are mandatory, event for empty-statements
} [else if test {

} [else {

}]
```


### if-return

```plee
var x = if test {
  10; // result of the last statement is used.
} else {
  var z = 10 + 7;
  z; // result of the last statement is used.
}
```


### if as modifier (shorthand)

Another lazy form to avoid curly braces.

```plee
log "no-curly-braces" if i_am_lazy; // i_am_lazy must be defined :)
```


### unless as modifier (shorthand)

For expressiveness this time, because `unless` is much larger than `if !`.

```plee
log "this is a small file" unless __LINE__ > 500;
```


### Chained Comparisons

For making it easy to test if a value falls within a certain range.

Syntax:

> x (<|>) y [(<|>) z]*

Expanded by the compiler to:

> (x < y) && (y < z)
