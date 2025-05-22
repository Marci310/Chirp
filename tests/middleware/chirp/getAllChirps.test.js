const mw = require("../../../middleware/chirp/getAllChirpsMW");
jest.mock("../../../middleware/requireOption", () => {
  return jest.fn();
});
const requireOption = require("../../../middleware/requireOption");
const flushPromises = () => new Promise(setImmediate);
describe("getAllChirpsMW middleware", () => {
    let ChirpModel;
    let FriendModel;
    let objrepo;
    let req;
    let res;
    let next;
  beforeEach(() => {
    ChirpModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockImplementation(() => {
        return Promise.resolve([
          { user: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp1", date: new Date("2012.01.01") },
          { user: { _id: 2, name: "User2", email: "user2@email.com", password: "pass2" }, text: "Chirp2", date: new Date("2012.01.01") },
        ]);
      }),
    };

    FriendModel = {
      find: jest.fn().mockImplementation(() => {
        return Promise.resolve([
          { userId: 1, friendId: 2 },
          { userId: 1, friendId: 3 },
        ]);
      }),
    };
    objrepo = {
      ChirpModel: ChirpModel,
      FriendModel: FriendModel,
    };
    requireOption.mockImplementation((objRepo, modelName) => {
      if (modelName === "ChirpModel") {
        return objRepo.ChirpModel;
      } else if (modelName === "FriendModel") {
        return objRepo.FriendModel;
      }
    });
    req = {
      session: {
        userId: 1,
        userName: "User1",
        userEmail: "user1@email.com",
        url: null,
      },
      toastr: {
        error: jest.fn((message) => message),
      },
    };
    res = {
      locals: {
        chirps: null,
        userName: null,
        userEmail: null,
        userId: null,
      },
      redirect: jest.fn((where) => {}),
    };
    next = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should fetch chirps and set them in res.locals with empty local user", async () => {
    await mw(objrepo)(req, res, next);
    await flushPromises();
    expect(FriendModel.find).toBeCalledWith({ userId: 1 });
    expect(ChirpModel.find).toBeCalledWith({ user: { $in: [2, 3, 1] } });
    expect(ChirpModel.populate).toBeCalledWith("user");
    expect(ChirpModel.sort).toBeCalledWith({ date: -1 });
    expect(ChirpModel.exec).toBeCalled();
    expect(res.locals.chirps).toEqual([
      { user: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp1", date: new Date("2012.01.01") },
      { user: { _id: 2, name: "User2", email: "user2@email.com", password: "pass2" }, text: "Chirp2", date: new Date("2012.01.01") },
    ]);
    expect(res.locals.userName).toEqual("User1");
    expect(res.locals.userEmail).toEqual("user1@email.com");
    expect(res.locals.userId).toEqual(1);
    expect(req.session.url).toEqual("/chirps");
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });
  test("should fetch chirps and set them in res.locals with existing local user", async () => {
    res.locals.userName = "user2";
    res.locals.userEmail = "user2@email.com";
    res.locals.userId = 2;
    await mw(objrepo)(req, res, next);
    await flushPromises();
    expect(FriendModel.find).toBeCalledWith({ userId: 1 });
    expect(ChirpModel.find).toBeCalledWith({ user: { $in: [2, 3, 1] } });
    expect(ChirpModel.populate).toBeCalledWith("user");
    expect(ChirpModel.sort).toBeCalledWith({ date: -1 });
    expect(ChirpModel.exec).toBeCalled();
    expect(res.locals.chirps).toEqual([
      { user: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp1", date: new Date("2012.01.01") },
      { user: { _id: 2, name: "User2", email: "user2@email.com", password: "pass2" }, text: "Chirp2", date: new Date("2012.01.01") },
    ]);
    expect(res.locals.userName).not.toEqual("User1");
    expect(res.locals.userEmail).not.toEqual("user1@email.com");
    expect(res.locals.userId).not.toEqual(1);
    expect(req.session.url).toEqual("/chirps");
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });
  test("should handle error and redirect to home", async () => {
    console.error = jest.fn();
    ChirpModel.exec.mockImplementationOnce(() => {
      return Promise.reject(new Error("Database error"));
    });
    await mw(objrepo)(req, res, next);
    await flushPromises();
    expect(req.toastr.error).toBeCalledWith("Error fetching chirps");
    expect(res.redirect).toBeCalledWith("/");
    expect(next).not.toBeCalled();
    expect(console.error).toBeCalledWith("Error fetching chirps:", expect.any(Error));
  });

});
