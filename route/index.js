//globals
const authMW = require("../middleware/auth/authMW");
const checkPassMW = require("../middleware/auth/checkPassMW");
const renderMW = require("../middleware/renderMW");
//user
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

  app.use("/", checkPassMW(objRepo), renderMW(objRepo, "login"));

  app.get("/user", authMW(objRepo), getUserMW(objRepo), renderMW(objRepo, "user"));

  app.post("/user/create", createUserMW(objRepo));

  app.del("/user/delete", authMW(objRepo), deleteUserMW(objRepo));

  app.patch("/user/edit", authMW(objRepo), editUserMW(objRepo));

  app.get("/friends", authMW(objRepo), getFriendUsersMW(objRepo), renderMW(objRepo, "friends"));

  app.patch("/friends/edit/:userid", authMW(objRepo), editUserFriendListMW(objRepo));

  app.get("friends/search/:searchkey", authMW(objRepo), getUsersViaSearchMW(objRepo));

  app.get("/chirps", authMW(objRepo), getAllChirpsMW(objRepo), renderMW(objRepo, "chirps"));

  app.get("/yourchirps", authMW(objRepo), getUsersChirpsMW(objRepo), renderMW(objRepo, "userchirps"));

  app.post("/yourchirps/create", authMW(objRepo), createChirpMW(objRepo));

  app.del("/yourchirps/delete/:chirpid", authMW(objRepo), delChirpMW(objRepo));

  app.patch("/yourchirps/edit/:chirpid", authMW(objRepo), editChirpMW(objRepo));
};
