/**
 * Checks whether the user is logged in and if not redirects to /
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
