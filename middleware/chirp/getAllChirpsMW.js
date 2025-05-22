/**
 * Get all the followed users' chirps from the database
 */
const requireOption = require("../requireOption");

module.exports = function (objRepo) {
  const ChirpModel = requireOption(objRepo, "ChirpModel");
  const FriendModel = requireOption(objRepo, "FriendModel");

  return function (req, res, next) {
    const userId = req.session.userId;

    FriendModel.find({ userId: userId })
      .then((friends) => {
        const friendIds = friends.map(friend => friend.friendId);
        friendIds.push(userId);
        return ChirpModel.find({ user: { $in: friendIds } })
          .populate("user")
          .sort({ date: -1 })
          .exec();
      })
      .then((chirps) => {
        res.locals.chirps = chirps;
        if(!res.locals.userName) {
          res.locals.userName = req.session.userName;
        }
        if(!res.locals.userEmail) {
          res.locals.userEmail = req.session.userEmail;
        }
        if(!res.locals.userId) {
          res.locals.userId = req.session.userId;
        }
        req.session.url = "/chirps";

        return next();
      })
      .catch((err) => {
        console.error("Error fetching chirps:", err);
        req.toastr.error("Error fetching chirps");
        return res.redirect("/");
      });
  };
};