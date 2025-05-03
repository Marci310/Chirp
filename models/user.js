const Schema = require("mongoose").Schema;
const db = require("../config/db.js");

const User = db.model("user", {
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = User;
