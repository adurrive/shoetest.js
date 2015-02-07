'use strict';

/**
 * Escape string to build a regular expression
 */
exports.escape = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};