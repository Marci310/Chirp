/**
 * Delete a chirp from the database, then redirect to /userChirps
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    next();
  };
};
