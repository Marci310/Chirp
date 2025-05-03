/**
 * Get the logged in user's chirps from the database
 */

const requireOption = require("../requireOption");

module.exports = function (objRepo) {
  const ChirpModel = requireOption(objRepo, "ChirpModel");
  return function (req, res, next) {
    return ChirpModel.find({ userId: req.session.userId })
      .populate("userId")
      .exec()
      .then((chirps) => {
        res.locals.chirps = chirps;
        return next();
      })
      .catch((err) => {
        console.error("Error fetching chirps:", err);
        return res.status(500).send("Internal Server Error");
      });
  };
};
