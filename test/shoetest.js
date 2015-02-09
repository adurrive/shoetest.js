var assert = require('assert');
var shoetest = require('../lib/shoetest');

describe('shoetest', function() {
  it('should be an object', function () {
    assert.equal(typeof shoetest, 'object');
  });
  it('should have a simplify method', function() {
    assert.equal(typeof shoetest.simplify, 'function');
  });
  it('should have a fun method', function() {
    assert.equal(typeof shoetest.fun, 'function');
  });
  it('should have a getRegExp method', function() {
    assert.equal(typeof shoetest.getRegExp, 'function');
  });
  it('should have a test method', function() {
    assert.equal(typeof shoetest.test, 'function');
  });
  it('should have a match method', function() {
    assert.equal(typeof shoetest.match, 'function');
  });

  describe('#simplify()', function() {
    it('should remove diacritics', function() {
      var simplified = shoetest.simplify('heļlṏ wɵrḻɖ');
      assert.equal(simplified, 'hello world');
    });
    it('should match case', function() {
      var simplified = shoetest.simplify('Heļlṏ Wɵrḻɖ');
      assert.equal(simplified, 'Hello World');
    });
    it('should match punctuation', function() {
      var simplified = shoetest.simplify('Heļlṏ, Wɵrḻɖ!');
      assert.equal(simplified, 'Hello, World!');
    });
  });

  describe('#fun()', function() {
    it('should transform string', function() {
      var fun = shoetest.fun('hello world');
      assert.notEqual(fun, 'hello world');
    });
    it('should be reversible with simplify', function() {
      var reversed = shoetest.simplify(shoetest.fun('hello world'));
      assert.equal(reversed, 'hello world');
    });
    it('should keep case', function() {
      var reversed = shoetest.simplify(shoetest.fun('Hello World'));
      assert.equal(reversed, 'Hello World');
    });
    it('should keep punctuation', function() {
      var reversed = shoetest.simplify(shoetest.fun('Hello, World!'));
      assert.equal(reversed, 'Hello, World!');
    });
  });

  describe('#getRegExp()', function() {
    it('should be a regular expression', function() {
      var re = shoetest.getRegExp('hello world');
      assert.equal(re instanceof RegExp, true);
    });
  });

  describe('#test()', function() {
    var text = 'The Crème de la Crème de la Crème!\nEat it!';
    var texts = [ 'Algæ Britannicæ', 'The Crème de la Crème de la Crème! $@v€ it!' ];
    it('should return false when the query is not matched in the provided text', function() {
      assert.equal(shoetest.test('Cream', text), false);
    });
    it('should return true when the query is matched in the provided text', function() {
      assert.equal(shoetest.test('Creme', text), true);
    });
    it('should not match special characters by default', function() {
      assert.equal(shoetest.test('save', texts), false);
    });
    it('should not match special characters by default', function() {
      assert.equal(shoetest.test('$@v€', texts), true);
    });
    it('should match special characters when strict is set to false', function() {
      assert.equal(shoetest.test('save', texts, { strict: false }), true);
    });
    it('should not match the diacritics by default', function() {
      assert.equal(shoetest.test('the créme', texts), true);
    });
    it('should match the diacritics when diacritics is set to true', function() {
      assert.equal(shoetest.test('the créme', texts, { diacritics: true }), false);
    });
    it('should match the diacritics when diacritics is set to true', function() {
      assert.equal(shoetest.test('the crème', texts, { diacritics: true }), true);
    });
    it('should not match the case by default', function() {
      assert.equal(shoetest.test('The CREME De La CREME De La CREME!', texts), true);
    });
    it('should match the case when charCase is set to true', function() {
      assert.equal(shoetest.test('The CREME De La CREME De La CREME!', texts, { charCase: true }), false);
    });
    it('should match the case when charCase is set to true', function() {
      assert.equal(shoetest.test('The Creme de la Creme de la Creme!', texts, { charCase: true }), true);
    });
    it('should not match the punctuation by default', function() {
      assert.equal(shoetest.test('Algae\'"`~-._°#<>%,;*+?!^=:{}()|[]/\\ Britannicae', texts), true);
    });
    it('should match the punctuation when punctuation is set to true', function() {
      assert.equal(shoetest.test('the creme, de la creme, de la creme.', texts, { punctuation: true }), false);
    });
    it('should match the punctuation when punctuation is set to true', function() {
      assert.equal(shoetest.test('the creme de la creme de la creme!', texts, { punctuation: true }), true);
    });
    it('should not match the exact whitespaces by default', function() {
      assert.equal(shoetest.test('the creme de la creme de la creme! eat it!', text), true);
    });
    it('should match the exact whitespaces when whitespaces is set to true', function() {
      assert.equal(shoetest.test('the creme de la creme de la creme! eat it!', text, { whitespaces: true }), false);
    });
    it('should match the exact whitespaces when whitespaces is set to true', function() {
      assert.equal(shoetest.test('the creme de la creme de la creme!\neat it!', text, { whitespaces: true }), true);
    });
    it('should match word boundaries by default', function() {
      assert.equal(shoetest.test('thecreme', texts), false);
    });
    it('should not match word boundaries when boundaries is set to false', function() {
      assert.equal(shoetest.test('thecreme', texts, { boundaries: false }), true);
    });
    it('should not match word boundaries when boundaries is set to false', function() {
      assert.equal(shoetest.test('thecre mede lacrem', texts, { boundaries: false }), true);
    });
    it('should not be a bounded string by default', function() {
      assert.equal(shoetest.test('he creme de la crem', texts), true);
    });
    it('should match the regular expression set to begin', function() {
      assert.equal(shoetest.test('he creme de la creme', texts, { begin: '\\b' }), false);
    });
    it('should match the regular expression set to end', function() {
      assert.equal(shoetest.test('the creme de la crem', texts, { end: '\\b' }), false);
    });
    it('should match the regular expression set to begin and end', function() {
      assert.equal(shoetest.test('the creme de la creme', texts, { begin: '\\b', end: '\\b' }), true);
    });
  });

  describe('#match()', function() {
    var text = 'The Crème de la Crème de la Crème!\nEat it!';
    var texts = [ 'Algæ Britannicæ', 'The Crème de la Crème de la Crème! $@v€ it!' ];
    it('should return an empty array when the query is not matched in the provided text', function() {
      assert.deepEqual(shoetest.match('Cream', text), []);
    });
    it('should return an array with the match query', function() {
      assert.deepEqual(shoetest.match('Creme', text), [ 'Crème', 'Crème', 'Crème' ]);
    });
    it('should not match special characters by default', function() {
      assert.deepEqual(shoetest.match('save', texts), []);
    });
    it('should not match special characters by default', function() {
      assert.deepEqual(shoetest.match('$@v€', texts), [ '$@v€' ]);
    });
    it('should match special characters when strict is set to false', function() {
      assert.deepEqual(shoetest.match('save', texts, { strict: false }), [ '$@v€' ]);
    });
    it('should not match the diacritics by default', function() {
      assert.deepEqual(shoetest.match('the créme', texts), [ 'The Crème' ]);
    });
    it('should match the diacritics when diacritics is set to true', function() {
      assert.deepEqual(shoetest.match('the créme', texts, { diacritics: true }), []);
    });
    it('should match the diacritics when diacritics is set to true', function() {
      assert.deepEqual(shoetest.match('the crème', texts, { diacritics: true }), [ 'The Crème' ]);
    });
    it('should not match the case by default', function() {
      assert.deepEqual(shoetest.match('The CREME De La CREME De La CREME!', texts), [ 'The Crème de la Crème de la Crème!' ]);
    });
    it('should match the case when charCase is set to true', function() {
      assert.deepEqual(shoetest.match('The CREME De La CREME De La CREME!', texts, { charCase: true }), []);
    });
    it('should match the case when charCase is set to true', function() {
      assert.deepEqual(shoetest.match('The Creme de la Creme de la Creme!', texts, { charCase: true }), [ 'The Crème de la Crème de la Crème!' ]);
    });
    it('should not match the punctuation by default', function() {
      assert.deepEqual(shoetest.match('Algae\'"`~-._°#<>%,;*+?!^=:{}()|[]/\\ Britannicae', texts), [ 'Algæ Britannicæ' ]);
    });
    it('should match the punctuation when punctuation is set to true', function() {
      assert.deepEqual(shoetest.match('the creme, de la creme, de la creme.', texts, { punctuation: true }), []);
    });
    it('should match the punctuation when punctuation is set to true', function() {
      assert.deepEqual(shoetest.match('the creme de la creme de la creme!', texts, { punctuation: true }), [ 'The Crème de la Crème de la Crème!' ]);
    });
    it('should not match the exact whitespaces by default', function() {
      assert.deepEqual(shoetest.match('the creme de la creme de la creme! eat it!', text), [ 'The Crème de la Crème de la Crème!\nEat it!' ]);
    });
    it('should match the exact whitespaces when whitespaces is set to true', function() {
      assert.deepEqual(shoetest.match('the creme de la creme de la creme! eat it!', text, { whitespaces: true }), []);
    });
    it('should match the exact whitespaces when whitespaces is set to true', function() {
      assert.deepEqual(shoetest.match('the creme de la creme de la creme!\neat it!', text, { whitespaces: true }), [ 'The Crème de la Crème de la Crème!\nEat it!' ]);
    });
    it('should match word boundaries by default', function() {
      assert.deepEqual(shoetest.match('thecreme', texts), []);
    });
    it('should not match word boundaries when boundaries is set to false', function() {
      assert.deepEqual(shoetest.match('thecreme', texts, { boundaries: false }), [ 'The Crème' ]);
    });
    it('should not match word boundaries when boundaries is set to false', function() {
      assert.deepEqual(shoetest.match('thecre mede lacrem', texts, { boundaries: false }), [ 'The Crème de la Crèm' ]);
    });
    it('should not be a bounded string by default', function() {
      assert.deepEqual(shoetest.match('he creme de la crem', texts), [ 'he Crème de la Crèm' ]);
    });
    it('should match the regular expression set to begin', function() {
      assert.deepEqual(shoetest.match('he creme de la creme', texts, { begin: '\\b' }), []);
    });
    it('should match the regular expression set to end', function() {
      assert.deepEqual(shoetest.match('the creme de la crem', texts, { end: '\\b' }), []);
    });
    it('should match the regular expression set to begin and end', function() {
      assert.deepEqual(shoetest.match('the creme de la creme', texts, { begin: '\\b', end: '\\b' }), [ 'The Crème de la Crème' ]);
    });
  });
  describe('#replace()', function() {
    var text = 'The Crême de la Crème de la Créme!';
    it('should replace the provided string with the new string', function() {
      assert.deepEqual(shoetest.replace('creme', 'Crème fraîche', text), 'The Crème fraîche de la Crème fraîche de la Crème fraîche!');
    });
    it('should keep the matched string when using $1', function() {
      assert.deepEqual(shoetest.replace('creme', '$1 fraîche', text), 'The Crême fraîche de la Crème fraîche de la Créme fraîche!');
    });
  });
});