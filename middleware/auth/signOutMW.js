/**
 * Logout the user by destroying the session and redirecting to the home page.
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
    return function (req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Internal Server Error");
            }
        });
        
        return res.redirect("/");
    };
  };