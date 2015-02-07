var assert = require('assert');
var regexp = require('../lib/regexp');

describe('regexp', function() {
  it('should be an object', function () {
    assert.equal(typeof regexp, 'object');
  });
  it('should have an escape method', function() {
    assert.equal(typeof regexp.escape, 'function');
  });

  describe('#escape()', function() {
    it('should escape $ in a string', function() {
      assert.equal(regexp.escape('It\'s $5!'), 'It\'s \\$5!');
    });
    it('should escape ? in a string', function() {
      assert.equal(regexp.escape('Is it $5?'), 'Is it \\$5\\?');
    });
  });
});