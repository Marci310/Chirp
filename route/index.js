//globals
const authMW = require("../middleware/auth/authMW");
const checkPassMW = require("../middleware/auth/checkPassMW");
const renderMW = require("../middleware/renderMW");
//user
const checkExistingUserEmailMW = require("../middleware/user/checkExistingUserEmailMW");
const createUserMW = require("../middleware/user/createUserMW");
const deleteUserMW = require("../middleware/user/deleteUserMW");
const editUserMW = require("../middleware/user/editUserMW");
const getUserMW = require("../middleware/user/getUserMW");
const getUsersViaSearchMW = require("../middleware/user/getUsersViaSearchMW");
const editUserFriendListMW = require("../middleware/user/editUserFriendListMW");
const getFriendUsersMW = require("../middleware/user/getFriendUsersMW");
//chirps
const createChirpMW = require("../middleware/chirp/createChirpMW");
const delChirpMW = require("../middleware/chirp/delChirpMW");
const editChirpMW = require("../middleware/chirp/editChirpMW");
const getAllChirpsMW = require("../middleware/chirp/getAllChirpsMW");
const getUsersChirpsMW = require("../middleware/chirp/getUsersChirpsMW");

module.exports = function (app) {
  const objRepo = {};

  app.get("/", authMW(objRepo), renderMW(objRepo, "login")); //Get the login page

  app.get("/register", renderMW(objRepo, "register")); //Get the register page

  app.post("/register", createUserMW(objRepo)); //Create a new user

  app.get("/forgottenpass", renderMW(objRepo, "forgotten-pass")); //Get the forgotten password page

  app.post("/forgottenpass", checkExistingUserEmailMW(objRepo), renderMW(objRepo, "login")); //Send a password reset email

  app.post("/login", checkPassMW(objRepo)); //Login the user

  app.get("/user", authMW(objRepo), getUserMW(objRepo), renderMW(objRepo, "profile")); //Get the user's profile page

  app.delete("/user/delete", authMW(objRepo), deleteUserMW(objRepo)); //Delete the user

  app.patch("/user/edit", authMW(objRepo), editUserMW(objRepo)); //Edit the user's data

  app.get("/friends", authMW(objRepo), getFriendUsersMW(objRepo), renderMW(objRepo, "friends")); //Get the user's friends

  app.patch("/friends/edit/:userid", authMW(objRepo), editUserFriendListMW(objRepo)); //Edit the user's friend list

  app.get("friends/search/:searchkey", authMW(objRepo), getUsersViaSearchMW(objRepo)); //Get users via search

  app.get("/chirps", authMW(objRepo), getAllChirpsMW(objRepo), renderMW(objRepo, "chirps")); //Get all chirps that are followed by the user

  app.get("/yourchirps", authMW(objRepo), getUsersChirpsMW(objRepo), renderMW(objRepo, "user-chirps")); //Get the user's chirps

  app.post("/yourchirps/create", authMW(objRepo), createChirpMW(objRepo)); //Create a new chirp

  app.delete("/yourchirps/delete/:chirpid", authMW(objRepo), delChirpMW(objRepo)); //Delete a chirp

  app.patch("/yourchirps/edit/:chirpid", authMW(objRepo), editChirpMW(objRepo)); //Edit a chirp
};
