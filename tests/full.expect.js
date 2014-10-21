(function(window) {
    var obj = {};
    function test() {
        ;
    }

    function invariant(condition, msg) {
        if(!condition) {
            throw new Error(msg || "invariant fail");
        }
    }

    invariant(Array.isArray(obj));
    test(true, document, []);

})(window);
