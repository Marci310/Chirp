const Schema = require("mongoose").Schema;
const db = require("../config/db.js");

const UserFollowing = db.model("user_following", {
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  friendId: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = UserFollowing;
