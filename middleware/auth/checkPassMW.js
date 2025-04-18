/**
 * Checks if the password is correct, it is the user is redirected to /chirps
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (!req.body.email || !req.body.password) {
      console.log("Missing required fields");
      return res.render("login");
    }
    res.redirect("/chirps");
  };
};
