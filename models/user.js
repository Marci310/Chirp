const Schema = require("mongoose").Schema;
const db = require("../config/db.js");

const User = db.model("user", {
  name: String,
  email: String,
  password: String,
});

module.exports = User;
