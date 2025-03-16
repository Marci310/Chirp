/**
 * Checks if the given email is already in use, it it is it sends a reset email.
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
