# Testing

Testing can be done in two stages. Runtime (specific build) and compile time.

## Testing runtime

Code will be isolated in a specific build. So no testing code will be in the real executable.


### Testing single function

```
test return_var[, error_var] fn function_name(arguments...) {
    assert return_var == true "it should be true";
    assert error_var == null "it should be null";
}

```

### testing multiple functions

```
test fn test_unique_name() {
    //  do your staff, test object will be available for you.
}

```

# testing/asserting in compile time

If you change `test` keyword `#test` the test will be run in compile time.

Same goes to `assert`, you can use `#assert`.
