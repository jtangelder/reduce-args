(function(window) {
    var obj = {};
    function test() {
        console.log(this, arguments);
    }

    function invariant(condition, msg) {
        if(!condition) {
            throw new Error(msg || "invariant fail");
        }
    }

    invariant(Array.isArray(obj), 'obj is not an array!');
    test(true, document, []);

})(window);
