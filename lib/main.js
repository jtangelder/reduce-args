var recast = require("recast");
var MinimizeCalls = require("./transformer");


module.exports = function(code, config, callback) {
    var ast = recast.parse(code);
    return recast.print(new MinimizeCalls(config).visit(ast));
};
