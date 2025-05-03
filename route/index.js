//globals
const authMW = require("../middleware/auth/authMW");
const checkPassMW = require("../middleware/auth/checkPassMW");
const renderMW = require("../middleware/renderMW");
const signOutMW = require("../middleware/auth/signOutMW");
const basicMW = require("../middleware/auth/basicMW");
//user
const checkExistingUserEmailMW = require("../middleware/user/checkExistingUserEmailMW");
const getUsersViaSearchMW = require("../middleware/user/getUsersViaSearchMW");
const userControllerMW = require("../middleware/user/userControllerMW");
const friendControllerMW = require("../middleware/user/friendControllerMW");
//chirp
const getAllChirpsMW = require("../middleware/chirp/getAllChirpsMW");
const chirpControllerMW = require("../middleware/chirp/chirpControllerMW");

const UserModel = require("../models/user");
const ChirpModel = require("../models/chirp");
const FriendModel = require("../models/userFollowings");


module.exports = function (app) {
  const objRepo = {
    UserModel: UserModel,
    ChirpModel: ChirpModel,
    FriendModel: FriendModel,
  };

  app.get("/", basicMW(objRepo)); //Get the login page

  app.post("/login", checkPassMW(objRepo)); //Login the user

  app.get("/chirps", authMW(objRepo), getAllChirpsMW(objRepo), renderMW(objRepo, "chirps") ); //Get all chirps that are followed by the user

  app.post("/chirps", authMW(objRepo), chirpControllerMW(objRepo)); //Create or Update a chirp

  app.post("/chirps/:id", authMW(objRepo), chirpControllerMW(objRepo));

  app.delete("/chirps/:id", authMW(objRepo), chirpControllerMW(objRepo)); //Delete a chirp

  app.get("/yourchirps", authMW(objRepo), chirpControllerMW(objRepo), renderMW(objRepo, "chirps")); //Get the user's chirps

  app.get("/logout", authMW(objRepo), signOutMW(objRepo)); //Logout the user

  app.get("/register", renderMW(objRepo, "register")); //Get the register page

  app.post("/register", userControllerMW(objRepo)); //Register the user

  app.get("/forgottenpass", renderMW(objRepo, "forgotten-pass")); //Get the forgotten password page

  app.post("/forgottenpass", checkExistingUserEmailMW(objRepo), renderMW(objRepo, "login")); //Send a password reset email

  app.get("/user", authMW(objRepo), userControllerMW(objRepo)); //Get the user data


  app.post("/user", authMW(objRepo), userControllerMW(objRepo)) //Register the user

  app.delete("/user", authMW(objRepo), userControllerMW(objRepo)); //Delete the user

  app.post("/friendsearch", authMW(objRepo), getUsersViaSearchMW(objRepo)); //Get users via search

  app.get("/friends", authMW(objRepo), friendControllerMW(objRepo), renderMW(objRepo, "friends")); //Get the user's friends

  app.post("/friends/:id", authMW(objRepo), friendControllerMW(objRepo));

  app.delete("/friends/:id", authMW(objRepo), friendControllerMW(objRepo)); //Delete a chirp

  


  


  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
};
