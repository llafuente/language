## entry-point file.

In plee there is only one file that can configure your project. This is
the `entry-point` file.

The `entry-point` differ from any other file it's where the program will start
its execution. Like main in c and more like node.js.

From this file you can configure the parser and compiler.
Even if there is no other place to configure that staff you can always include the
contents of a file with the macro `#include` that will merge the file and it
will behave at `entry-point` level.

Just now we introduce the preprocessor concept borrowed mostly from c.
Also say that `#include` read the file a insert its contents, so only one
file will be compiled.

The file is execution goes top to bottom. If you need to create a infinite loop
we recommend the `loop statement`.

```
var something-happens = false; // <-- shock?!
loop {
  // some nasa science

  if (something-happens) {
    exit 0;
  }
}
```

Before explain what a variable identifier can be, let see the operators and then
all will be clear.
