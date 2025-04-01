/**
 * Create a new user in the database redirects to /
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  return function (req, res, next) {
    if (!req.body.user || !req.body.email || !req.body.password || !req.body.password_again) {
      console.log("Missing required fields");
      return res.render("register");
    }
    if (req.body.password !== req.body.password_again) {
      console.log("Passwords do not match");
      return res.render("register");
    }
    return res.redirect("/");
  };
};
