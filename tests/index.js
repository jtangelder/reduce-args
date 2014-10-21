var minimizeCalls = require('../index');
var assert = require("assert");

function min(code, conf) {
    conf = conf || {};
    conf.test = conf.test || /^fn$/;
    return minimizeCalls(code, [conf]).code;
}

describe('minimizeCalls', function() {
    var code = 'fn(true, true, false);';

    it('should remove arguments at the given indexes', function() {
        assert.equal(min(code, {stripArgs: [1,2]}), 'fn(true);', 'should strip the last two args');
        assert.equal(min(code, {stripArgs: [0]}), 'fn(null, true, false);', 'should strip the first arg');
        assert.equal(min(code, {stripArgs: []}), code, 'should strip no args');
    });

    it('should keep arguments at the given indexes', function() {
        assert.equal(min(code, {keepArgs: [1,2]}), 'fn(null, true, false);', 'should keep the last two args');
        assert.equal(min(code, {keepArgs: [1]}), 'fn(null, true);', 'should only keep the second arg');
        assert.equal(min(code, {keepArgs: []}), 'fn();', 'should strip all args');
    });

    it('should remove the function call', function() {
        assert.equal(min(code, {removeCall: true}), ';', 'should remove the call');
    });

    it('should only hit the matching the functions', function() {
        assert.equal(min(code, {removeCall: true, test: /fn/}), ';', 'should remove any call matching /fn/');
        assert.equal(min(code, {removeCall: true, test: /^fn$/}), ';', 'should remove the call to /^fn$/');
        assert.equal(min(code, {removeCall: true, test: /^console\.log$/}), code, 'shouldn\t remove the call');
    });

    it('should remove the console function calls and drop the invariant msg.', function() {
        var testCode = 'console.log(true); invariant(true, "this message should be stripped");';
        var resultCode = '; invariant(true);';

        assert.equal(minimizeCalls(testCode, [
            { test: /^console./, removeCall: true },
            { test: /^invariant$/, keepArgs: [0] }
        ]).code, resultCode);
    });
});