'use strict';

/**
 * Escape string to build a regular expression
 *
 * @param {String} str
 * @return {String} escaped str
 * @api private
 */
exports.escape = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};