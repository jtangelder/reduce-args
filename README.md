reduce-args
==============

Remove function calls or strip arguments in javascript code. Useful for removing debug messages in a production build.
The next step after using this small tool, would be to compress the code with something like UglifyJS.
 
Uses [Recast](https://github.com/benjamn/recast) for parsing the code.

### Example
````js
invariant(isArray(obj), "obj should be an array!");
````
...becomes...
 
````js
invariant(isArray(obj));
````

### Usage
````js
var reduceArgs = require('reduce-args');

var min = reduceArgs(testCode, [
	// removes all console.*() calls
	{ test: /^console./, removeCall: true },
	
	// keeps only the argument at index 0 at calls to invariant()
	{ test: /^invariant$/, keepArgs: [0] },
	
	// drops all arguments to invariant()
	{ test: /^invariant$/, keepArgs: [] },
	
	// drops the argument at index 1, and keeps the rest
	{ test: /^invariant$/, stripArgs: [1] }
]);

console.log(min.code);
````

See the [`tests`](tests/index.js) for more details.

### Install
`npm install reduce-args`
