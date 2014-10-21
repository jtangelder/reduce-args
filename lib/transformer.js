var recast = require("recast");
var builders = recast.types.builders;


function nodeToString(node) {
    return recast.print(node).code;
}

module.exports = recast.Visitor.extend({
    init: function(config) {
        this.minimizeConfig = config || [];
    },

    visitCallExpression: function(node) {
        return this.minimizeCallExpression(node);
    },

    removeCallExpression: function(node) {
        return builders.emptyStatement();
    },

    keepArguments: function(node, keepArgs) {
        // convert the keepArgs to an stripArgs array
        var stripArgs = [];
        for(var i=0; i<node.arguments.length; i++) {
            if(keepArgs.indexOf(i) === -1) {
                stripArgs.push(i);
            }
        }

        return this.stripArguments(node, stripArgs);
    },

    stripArguments: function(node, stripArgs) {
        var args = [];
        var shouldRemove = true;

        for(var i=node.arguments.length-1; i >= 0; i--) {
            var arg = node.arguments[i];
            var shouldStrip = stripArgs.indexOf(i) > -1;

            if(shouldStrip) {
                if(!shouldRemove) {
                    args.unshift(builders.literal(null, arg.loc));
                }
            } else {
                args.unshift(arg);
                shouldRemove = false;
            }
        }

        return builders.callExpression(node.callee, args);
    },

    minimizeCallExpression: function(node) {
        var fnCall = (node.callee.type != recast.Syntax.FunctionExpression) && nodeToString(node.callee);
        if(fnCall) {
            for (var i = 0; i < this.minimizeConfig.length; i++) {
                var config = this.minimizeConfig[i];

                if (config.test.test(fnCall)) {
                    if (config.removeCall) {
                        return this.removeCallExpression(node);
                    } else if (config.keepArgs) {
                        return this.keepArguments(node, config.keepArgs);
                    } else if (config.stripArgs) {
                        return this.stripArguments(node, config.stripArgs);
                    }
                }
            }
        }

        if(node.callee.body) {
            node.callee.body = this.visit(node.callee.body);
        }

        return node;
    }
});
