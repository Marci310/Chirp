module.exports = function (objectrepository) {
  return function (req, res, next) {
    if(!req.session.userId) {
      res.render("login");
    } else {
        res.redirect("/chirps");
    }
  };
};