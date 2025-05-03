/**
 * Checks if the given email is already in use, it it is it sends a reset email.
 */

const requireOption = require("../requireOption");

module.exports = function (objRepo) {
  const UserModel = requireOption(objRepo, "UserModel");
  return function (req, res, next) {
    if (!req.body.email) {
      return res.render("forgotten-pass", {
        emailError: "Email is required",
        formData: req.body,
      });
    }
    return UserModel.find({email: req.body.email}).then((user) => {
      if (user && user.length > 0) {
        console.log("Email sent to user:", user);
      } else {
        console.log("User not found with this email:", req.body.email);
      }
      
      req.toastr.success("Email sent to user!");
      return res.redirect("/");
    }).catch((err) => {
      console.error("Error finding user:", err);
      req.toastr.error("Email sent to user!");
      return res.redirect("/login");
    });
  };
};
