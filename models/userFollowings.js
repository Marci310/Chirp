const Schema = require("mongoose").Schema;
const db = require("../config/db.js");

const UserFollowing = db.model("user_following", {
  follower: { type: Schema.Types.ObjectId, ref: "user" },
  following: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = UserFollowing;
