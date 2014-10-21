var recast = require("recast");
var ReduceArgs = require("./transformer");


module.exports = function(code, config) {
    var ast = recast.parse(code);
    return recast.print(new ReduceArgs(config).visit(ast));
};
