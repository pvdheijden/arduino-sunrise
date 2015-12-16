var assert = require('chai').assert;

suite('Testing 1, 2, 3, ...', function() {
    test('true should be true not false', function () {
        assert(true === true, 'true is true');
        assert(true !== false, 'true is not false');
    });
});