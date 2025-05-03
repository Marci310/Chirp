/**
 * Edit the user's friend list in the database then redirect to /friends
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
  const FriendModel = requireOption(objectrepository, "FriendModel");
  const UserModel = requireOption(objectrepository, "UserModel");
  
  return function (req, res, next) {
    const userId = req.session.userId;
    
    if (req.method === "GET") {
      return FriendModel.find({ userId: req.session.userId })
        .then((friends) => {
          const friendIds = friends.map((friend) => friend.friendId);
          return UserModel.find({ _id: { $in: friendIds } });
        })
        .then((friendUsers) => {
          res.locals.friends = friendUsers;
          return next();
        })
        .catch((err) => {
          console.error("Error fetching friends:", err);
          req.toastr.error("Error fetching friends");
          return res.redirect("/");
        });
    }
    
    if (req.method === "POST") {
      const friendId = req.params.id;
      
      if (userId === friendId) {
        req.toastr.error("You cannot add yourself as a friend");
        return res.json({ success: false });
      }
      
      return FriendModel.findOne({ userId: userId, friendId: friendId })
        .then((friend) => {
          if (!friend) {
            return FriendModel.create({ userId: userId, friendId: friendId })
              .then(() => {
                req.session.searchUsers = [];
                req.session.searchTerm = '';
                req.toastr.success("Friend added successfully!");
                return res.json({ success: true });
              })
              .catch((err) => {
                console.error("Error adding friend:", err);
                req.toastr.error("Error adding friend");
                return res.json({ success: false });
              });
          }
        })
        .catch((err) => {
          console.error("Error finding friend:", err);
          req.toastr.error("Error processing your request");
          return res.json({ success: false });
        });
    }
    
    if (req.method === "DELETE") {
      const friendId = req.params.id;
      
      return FriendModel.deleteOne({ userId: userId, friendId: friendId })
        .then(() => {
          req.session.searchUsers = [];
          req.session.searchTerm = '';
          req.toastr.success("Friend removed successfully!");
          return res.json({ success: true });
        })
        .catch((err) => {
          console.error("Error removing friend:", err);
          req.toastr.error("Error removing friend");
          return res.json({ success: false });
        });
    }
    
    return next();
  };
};