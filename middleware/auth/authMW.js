/**
 * Checks whether the user is logged in and if not redirects to /
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if(!req.session.userId) {
      req.toastr.error("You must be logged in to access this page");
      return res.redirect("/");
    }
    next();
  };
};
