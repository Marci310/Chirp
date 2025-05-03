const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const toastr = require("express-toastr");
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser('secret'));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

app.use(toastr());
app.use(function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  res.locals.userId = req.session.userId || null;
  res.locals.userName = req.session.userName || null;
  res.locals.userEmail = req.session.userEmail || null;
  res.locals.formData = {};
  res.locals.friends = req.session.friends || [];
  res.locals.chirps = [];
  res.locals.searchUsers = req.session.searchUsers || [];
  res.locals.searchTerm = req.session.searchTerm || null;
  
  next();
});
app.use(express.static("static"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./route/index")(app);

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});
