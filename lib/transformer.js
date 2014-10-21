var recast = require("recast");
var Syntax = recast.Syntax;
var builders = recast.types.builders;


function nodeToString(node) {
    return recast.print(node).code;
}

module.exports = recast.Visitor.extend({
    init: function(config) {
        this.config = config || [];
    },

    removeCallExpression: function(node) {
        return this.remove();
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

    visitCallExpression: function(node) {
        var validType = node.callee && (
            node.callee.type == Syntax.MemberExpression ||
            node.callee.type == Syntax.Identifier);

        if(validType) {
            var fnCall = nodeToString(node.callee);
            for (var i = 0; i < this.config.length; i++) {
                var entry = this.config[i];
                if (entry.test.test(fnCall)) {
                    if (entry.removeCall) {
                        return this.removeCallExpression(node);
                    } else if (entry.keepArgs) {
                        return this.keepArguments(node, entry.keepArgs);
                    } else if (entry.stripArgs) {
                        return this.stripArguments(node, entry.stripArgs);
                    }
                }
            }
        }

        this.genericVisit(node);
    }
});
