minimize-calls
==============

Remove function calls or strip arguments in javascript code. Useful for removing debug messages in a production build.
The next step after using this small tool, would be to compress the code with something like UglifyJS.
 
Uses [Recast](https://github.com/benjamn/recast) for parsing the code.

### Usage
````js
var minimizeCalls = require('minimize-calls');

var min = minimizeCalls(testCode, [
	{ test: /^console./, removeCall: true },	// removes all console.*() calls
	{ test: /^invariant$/, keepArgs: [0] }		// keeps only the argument at index 0 at calls to invariant()
	{ test: /^invariant$/, keepArgs: [] }		// drops all arguments
	{ test: /^invariant$/, stripArgs: [1] }		// drops the argument at index 1, and keeps the rest
]);

console.log(min.code);
````

See the [`tests`](tests/index.js) for more details.
