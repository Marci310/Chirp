/**
 * Get users via search
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  const UserModel = requireOption(objectrepository, "UserModel");
  const FriendModel = requireOption(objectrepository, "FriendModel");
  return function (req, res, next) {
    const searchTerm = req.body.searchTerm || '';
    
    if (!searchTerm || searchTerm.trim() === '') {
      req.session.searchUsers = [];
      return res.redirect("/friends");
    }

    UserModel.find({
      $or: [{ name: { $regex: searchTerm, $options: "i" } }, { email: { $regex: searchTerm, $options: "i" } }],
    })
      .then((users) => {
        users = users.filter((user) => user._id.toString() !== req.session.userId.toString());

        if (users.length === 0) {
          req.session.searchUsers = [];
          req.session.searchTerm = searchTerm;
          return res.redirect("/friends");
        }

        const userIds = users.map(user => user._id);
      

      return FriendModel.find({ 
        userId: req.session.userId,
        friendId: { $in: userIds }
      })
      .then(followings => {
        const followedUserIds = new Set(
          followings.map(follow => follow.friendId.toString())
        );
        
        const enhancedUsers = users.map(user => {
          const userObject = user.toObject();
          userObject.isFollowing = followedUserIds.has(user._id.toString());
          return userObject;
        });
        
        req.session.searchUsers = enhancedUsers;
        req.session.searchTerm = searchTerm;
        
        return res.redirect("/friends");
      });


      })
      .catch((err) => {
        console.error("Error finding users:", err);
        req.toastr.error("Error finding users");
        res.locals.searchUsers = [];
        return res.redirect("/friends");
      });
  };
};
