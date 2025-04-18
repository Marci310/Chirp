const Schema = require("mongoose").Schema;
const db = require("../config/db.js");

const Chirp = db.model("chirp", {
  text: String,
  user: { type: Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
});

module.exports = Chirp;
