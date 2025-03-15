/**
 * Edit the user's friend list in the database then redirect to /user
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
