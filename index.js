const express = require("express");
const app = express();

app.use(express.static("static"));

require("./route/index")(app);

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});
