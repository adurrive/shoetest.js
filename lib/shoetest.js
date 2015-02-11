'use strict';

var RandExp = require ('randexp');
var reference = require('../reference.json');
var regexp = require('./regexp');
var _ = require('lodash');

/**
* Shoetest.js library
*/
function Shoetest () {
  var basic = {};
  var basicExtra = {};
  var special = {};
  var punctuation = reference.punctuationRegExp;
  var test;

  for (var c in reference.chars) {
    // Initialize the characters index
    basic[c[0]] = basic[c[0]] || {};
    basic[c[0]][c[1]] = basic[c[0]][c[1]] || {};
    basic[c[0]][c[1]][c[2]] = '(?:' + c + '|[' + reference.chars[c] + '])';

    // Initialize the special characters index
    for (var i = 0, j = reference.chars[c].length; i < j; i++) {
      special[reference.chars[c][i]] = c;
    }
  }

  // Initialize the characters index extended with extra characters
  basicExtra = JSON.parse(JSON.stringify(basic));
  for (var e in reference.extra) {
    // Extend the characters index with similar characters
    basicExtra[e[0]] = basicExtra[e[0]] || {};
    basicExtra[e[0]][e[1]] = basicExtra[e[0]][e[1]] || {};
    if (basicExtra[e[0]][e[1]][e[2]]) {
      basicExtra[e[0]][e[1]][e[2]] = '(?:' + basicExtra[e[0]][e[1]][e[2]] + '|[' + regexp.escape(reference.extra[e]) + '])';
    } else {
      basicExtra[e[0]][e[1]][e[2]] = '(?:' + e + '|[' + regexp.escape(reference.extra[e]) + '])';
    }
  }

  /**
  * Shoetest.js simplify method
  *
  * @param {String} str
  * @return {String} modified str without diacritics
  * @api public
  */
  this.simplify = function (str) {
    var simplified = '';

    if (!str) {
      return;
    }

    str = String(str);

    for (var i = 0, j = str.length; i < j; i++) {
      simplified += special[str[i]] || str[i];
    }
    return simplified;
  };

  /**
  * Shoetest.js getRegExp method
  *
  * @param {String} str
  * @param {Object} options
  * @return {RegExp} regular expression based on str
  * @api public
  */
  this.getRegExp = function (str, options) {
    var re = '';
    var current = '';
    var prevX = '';
    var prevY = '';
    var prevZ = '';
    var cY, cZ, c, index, re1, re2, re3, sb, sp;

    if (!str) {
      return;
    }

    str = String(str);

    options = _.assign({
      strict: true,
      diacritics: false,   
      charCase: false,
      punctuation: false,
      whitespaces: false,
      boundaries: true,
      begin: '',
      end: ''
    }, options);

    if (options.strict) {
      index = basic;
    } else {
      index = basicExtra;
    }

    if (!options.diacritics) {
      str = this.simplify(str);
    }

    if (!options.punctuation && !options.boundaries) {
      sb = '[\\s' + punctuation + ']';
      sp = '';
      str = str.replace(new RegExp(sb + '+', 'g'), '');
      sb = sb + '*';
    } else if (!options.punctuation) {
      sb = '';
      sp = '[' + punctuation + ']';
      // Use \u0000 as an easy identifier
      str = str.replace(new RegExp(sp + '+', 'g'), '\u0000');
      sp = sp + '*';
    } else if (!options.boundaries) {
      sb = '\\s';
      sp = '';
      str = str.replace(new RegExp(sb + '+', 'g'), '');
      sb = sb + '*';
    } else {
      sb = '';
      sp = '';
    }

    for (var i = 0, j = str.length; i < j; i++) {
      cY = str[i-2];
      cZ = str[i-1];
      c = str[i];
      prevX = prevY;
      prevY = prevZ;
      prevZ = current;

      // Get regular expression with one character
      if (options.boundaries && /\s/.test(c)) {
        if (!options.whitespaces && !options.punctuation) {
          re1 = '[\\s' + punctuation + ']+';
        } else if (!options.whitespaces) {
          re1 = '\\s+';
        } else if (!options.punctuation) {
          re1 = '[' + punctuation + ']*' + c + '[' + punctuation + ']*';
        } else {
          re1 = c;
        }        
      } else {
        if (c && index[c] && index[c][undefined] && index[c][undefined][undefined]) {
          re1 = index[c][undefined][undefined];
        } else {
          re1 = regexp.escape(c);
        }
      }

      // Get regular expression with two characters
      if (cZ && c && index[cZ] && index[cZ][c] && index[cZ][c][undefined]) {
        re2 = index[cZ][c][undefined];
      } else {
        re2 = null;
      }

      // Get regular expression with three characters
      if (cY && cZ && c && index[cY] && index[cY][cZ] && index[cY][cZ][c]) {
        re3 = index[cY][cZ][c];
      } else {
        re3 = null;
      }

      if (!re2 && !re3) {
        // Save running current regular expression
        re += current + (current ? sb : '');
        // Reset history and start new one
        prevX = '';
        prevY = '';
        prevZ = '';
        if (re1 === '\u0000') { 
          current = sp;
        } else {
          current = re1;
        }
      } else {
        // Build up current regular expression
        current = '(?:' + prevZ + sb + re1;
        if (re2) {
          current += '|' + prevY + sb + re2;
        }
        if (re3) {
          current += '|' + prevX + sb + re3;
        }
        current += ')';
      }
    }

    re = '(' + options.begin + re + current + options.end + ')';
    return new RegExp(re, 'g' + (options.charCase ? '' : 'i'));
  };

  /**
  * Shoetest.js test method
  *
  * @param {String} str
  * @param {String|Array} texts
  * @param {Object} options
  * @return {Boolean} true if str is found in texts
  * @api public
  */
  this.test = function (str, texts, options) {
    var re;

    if (!str || !texts) {
      return;
    }

    if (!Array.isArray(texts)) {
      texts = [ texts ];
    }
    
    re = this.getRegExp(str, options);

    for (var i = 0, j = texts.length; i < j; i++) {
      if (re.test(texts[i])) {
        return true;
      }
    }
    return false;
  };

  /**
  * Shoetest.js match method
  *
  * @param {String} str
  * @param {String|Array} texts
  * @param {Object} options
  * @return {Array} matching str in texts
  * @api public
  */
  this.match = function (str, texts, options) {
    var match, re;
    var results = [];

    if (!str || !texts) {
      return;
    }

    if (!Array.isArray(texts)) {
      texts = [ texts ];
    }

    re = this.getRegExp(str, options);

    for (var i = 0, j = texts.length; i < j; i++) {
      if (_.isString(texts[i])) {
        match = texts[i].match(re);
        if (match) {
          results = results.concat(match);
        }
      }
    }
    return results;
  };

  /**
  * Shoetest.js replace method
  *
  * @param {String} str
  * @param {String} newstr
  * @param {String|Array} texts
  * @param {Object} options
  * @return {String|Array} modified texts with str replaced
  * @api public
  */
  this.replace = function (str, newstr, texts, options) {
    var re;
    var results = [];

    if (!str || !texts) {
      return;
    }

    if (!Array.isArray(texts)) {
      texts = [ texts ];
    }

    newstr = newstr || '';

    re = this.getRegExp(str, options);

    for (var i = 0, j = texts.length; i < j; i++) {
      if (_.isString(texts[i])) {
        results.push(texts[i].replace(re, newstr));
      } else {
        results.push(texts[i]);
      }
    }

    if (results.length === 1) {
      return results[0];
    }

    return results;
  };

  /**
  * Shoetest.js fun method
  *
  * @param {String} str
  * @return {String} modified str with random diacritics
  * @api public
  */
  this.fun = function (str) {
    var options, re;

    if (!str) {
      return;
    }

    options = { charCase: true, punctuation: true, whitespaces: true };
    re = this.getRegExp(str, options);

    return new RandExp(re).gen();
  };

}

module.exports = new Shoetest();