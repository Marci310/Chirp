/**
 * Checks if the password is correct, it is the user is redirected to /chirps
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
