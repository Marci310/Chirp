/**
 * Delete the user from the database then redirect to /
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
