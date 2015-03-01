# Listeners (Propossal)

Listeners can be attached to functions at compile time.

```plee
#listener(fn).before(fn(function_name, arguments, stack))
#listener(fn).beforeOff(fn)
#listener(fn).after(fn(function_name, arguments, return_value, error_value, stack))
#listener(fn).afterOff(fn)
#listener(fn).removeAll
```

*STUDY* This could be part of the postprocessor
