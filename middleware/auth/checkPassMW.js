/**
 * Checks if the password is correct, it is the user is redirected to /chirps
 */

const requireOption = require("../requireOption");
const bcrypt = require("bcrypt");

module.exports = function (objectrepository) {
  const UserModel = requireOption(objectrepository, "UserModel");
  return function (req, res, next) {
    if (!req.body.email || !req.body.password) {
      console.log("Missing required fields");
      req.toastr.error("Email and password are required");
      return res.render("login", { formData: req.body });
    }
    return UserModel.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        req.toastr.error("Invalid email or password");
        return res.redirect("/");
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
          req.toastr.error("Invalid email or password");
          return res.redirect("/");
        }
        
        if (result) {
          req.session.userId = user._id;
          req.session.userName = user.name;
          req.session.userEmail = user.email;
          req.toastr.success("Login successful!");
          return res.redirect("/chirps");
        } else {
          req.toastr.error("Invalid email or password");
          return res.redirect("/");
        }
      });
    }
    ).catch((err) => {
      console.log("Error finding user", err);
      req.toastr.error("Authentication error user");
      return res.render("login", { formData: req.body });
    });
    
  };
};
