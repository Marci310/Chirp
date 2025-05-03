const requireOption = require("../requireOption");
const bcrypt = require("bcrypt");

module.exports = function (objectrepository) {
  const UserModel = requireOption(objectrepository, "UserModel");
  return function (req, res, next) {
    if (req.method === "POST" || req.method === "PUT") {
      const isUpdate =  req.originalUrl === "/user";
      const renderTemplate = isUpdate ? "profile" : "register";
      
      if (!req.body.email) {
        return res.render(renderTemplate, {
          emailError: "Email is required",
          formData: req.body,
        });
      }
      
      if (!req.body.user) {
        return res.render(renderTemplate, {
          userError: "Username is required",
          formData: req.body,
        });
      }
      
      const isPasswordChange = req.body.password && req.body.password.length > 0;
      if (!isUpdate || isPasswordChange) {
        if (!req.body.password) {
          return res.render(renderTemplate, {
            passwordError: "Password is required",
            formData: req.body,
          });
        }
        
        if (!req.body.password_again || req.body.password !== req.body.password_again) {
          return res.render(renderTemplate, {
            passwordError: "Passwords do not match",
            formData: req.body,
          });
        }
      }
      
      const saveUser = (user, hash) => {
        if (hash) {
          user.password = hash;
        }
        
        return user.save()
          .then(() => {

            if (!isUpdate) {
              req.toastr.success("User created successfully!");
              return res.redirect("/");
            }
            
            req.toastr.success("Profile updated successfully!");
            return res.redirect("/user");
          })
          .catch((err) => {
            console.error(`Error ${isUpdate ? 'updating' : 'creating'} user:`, err);
            
            if (err.code === 11000) {
              const keyPattern = err.keyPattern;
              if (keyPattern?.name) {
                return res.render(renderTemplate, {
                  userError: "Username already in use",
                  formData: req.body,
                });
              } else if (keyPattern?.email) {
                return res.render(renderTemplate, {
                  emailError: "Email already in use",
                  formData: req.body,
                });
              }
            }
            
            req.toastr.error(`Error ${isUpdate ? 'updating' : 'creating'} user`);
            return res.render(renderTemplate, { formData: req.body });
          });
      };
      
      const processUser = () => {
        if (isUpdate) {
          return UserModel.findById(req.session.userId)
            .then((user) => {
              if (!user) {
                req.toastr.error("User not found");
                return res.redirect("/");
              }
              
              user.name = req.body.user;
              user.email = req.body.email;
              
              if (isPasswordChange) {
                return bcrypt.hash(req.body.password, 10)
                  .then((hash) => saveUser(user, hash))
                  .catch((err) => {
                    console.error("Error hashing password:", err);
                    return res.render("profile", {
                      passwordError: "Error processing your request",
                      formData: req.body,
                    });
                  });
              } else {
                return saveUser(user);
              }
            })
            .catch((err) => {
              console.error("Error finding user:", err);
              req.toastr.error("User not found");
              return res.redirect("/");
            });
        } else {
          return bcrypt.hash(req.body.password, 10)
            .then((hash) => {
              const newUser = new UserModel({
                name: req.body.user,
                email: req.body.email,
                password: hash,
              });
              
              return saveUser(newUser);
            })
            .catch((err) => {
              console.error("Error hashing password:", err);
              return res.render("register", {
                passwordError: "Error processing your request",
                formData: req.body,
              });
            });
        }
      };
      console.log("Processing user data...");
      return processUser();

    } else if (req.method === "GET") {
        return UserModel.findById(req.session.userId)
            .then((user) => {
                if (!user) {
                    req.toastr.error("User not found");
                    return res.redirect("/");
                }
                return res.render("profile", {
                    user: user,
                    formData: {
                        user: user.name,
                        email: user.email,
                    },
                });
            })
            .catch((err) => {
                console.error("Error fetching user:", err);
                req.toastr.error("Error fetching user data");
                return res.redirect("/");
            });
    } else if (req.method === "DELETE") {
        return UserModel.findByIdAndDelete(req.session.userId)
            .then(() => {
              req.toastr.success("Account deleted successfully");
                req.session.destroy((err) => {
                  if (err) {
                    console.error("Error destroying session:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                });
                return res.redirect("/");
            })
            .catch(err => {
                console.error("Error deleting user:", err);
                req.toastr.error("Error deleting account");
                return res.redirect("/userProfile");
            });
    } else {
        return next();
    }
  };
};
