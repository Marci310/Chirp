const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./route/index")(app);

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});
