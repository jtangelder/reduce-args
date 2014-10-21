minimize-calls
==============

Remove function calls or strip arguments in javascript code. Useful for removing debug messages in a production build.
The next step after using this small tool, would be to compress the code with something like UglifyJS.
 
Uses [Recast](https://github.com/benjamn/recast) for parsing the code.

### Usage
````js
var minimizeCalls = require('minimize-calls');

var min = minimizeCalls(testCode, [
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
`npm install minimize-calls`
