## struct

```
struct identifier {
  member: type = initialization;
  //...
  method = fn [self] [arguments] {
    // self must be first, and cannot be overriden like other languages
    // remember that this does not exist
  }; // this time, semiclon is mandatory (atm)
};
```

Examples:
```
struct v2 {
  x:number = 0;
  y = 0; // implicit type -> number
  add = fn self, x, y { // if nothing is retrurned
    self.x - self.y;
    
  }
};
```
