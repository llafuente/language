## entry-point file.

In plee there is only one file that can configure your project.
This is the `entry-point` file.

The `entry-point` differ from any other file it's where the program
will start its execution. Like main in c and but more like
node.js or phyton.

From this file you can configure the parser and compiler.
Even if there is no other place to configure that staff you
can always include the contents of a file with `#include` and split
proyect configuration.

Just now we introduce the preprocessor concept borrowed mostly from c.
Also say that `#include` read the file a insert its contents,
so only one file will be compiled.

The file is execution goes top to bottom. If you need to create an infinite loop we recommend the `loop statement`.

```
var something-happens = false; // <-- shock?!
loop {
  // some nasa science

  if (something-happens) {
    exit 0;
  }
}
```

Did you spot an error?

Are you sure... do not skip the operators, you will understand.
