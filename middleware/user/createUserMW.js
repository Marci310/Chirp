/**
 * Create a new user or update existing user in the database
 * redirects to / on success
 */

const session = require("express-session");
const requireOption = require("../requireOption");
const bcrypt = require("bcrypt");

module.exports = function (objRepo) {
  const UserModel = requireOption(objRepo, "UserModel");

  return function (req, res, next) {
    const isUpdate = session.user
    let user = isUpdate ? res.locals.user : new UserModel();
    
    if (!req.body.user || !req.body.email) {
      return res.render(isUpdate ? "edit" : "register", { 
        error: "Username and email are required",
        formData: req.body,
        user: user
      });
    }
    
    const isPasswordChange = req.body.password && req.body.password.length > 0;
    
    if (!isUpdate && !isPasswordChange) {
      req.toastr.error("Password is required for new users");
      return res.render("register", { 
        formData: req.body,
        user: user
      });
    }
    
    if (isPasswordChange && (!req.body.password_again || req.body.password !== req.body.password_again)) {
      req.toastr.error("Passwords do not match");
      return res.render(isUpdate ? "edit" : "register", { 
        formData: req.body,
        user: user
      });
    }
    
    user.name = req.body.user;
    user.email = req.body.email;
    
    const saveUser = () => {
      return user.save()
        .then(() => {
          req.toastr.success(
            isUpdate ? "Profile updated successfully!" : "Account created successfully!"
          );
          return res.redirect("/");
        })
        .catch((err) => {
          let errorMessage = isUpdate ? "Error updating account" : "Error creating account";
          
          if (err.code === 11000) {
            errorMessage = "Email already in use";
          }

          req.toastr.error(errorMessage);
          
          return res.render(isUpdate ? "/user" : "/login", {
            formData: req.body,
            user: user
          });
        });
    };
    
    if (isPasswordChange) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          req.toastr.error("Error processing your request");
          return res.render(isUpdate ? "/user" : "/login", { 
            formData: req.body,
            user: user
          });
        }
        
        user.password = hash;
        saveUser();
      });
    } else {
      saveUser();
    }
  };
};