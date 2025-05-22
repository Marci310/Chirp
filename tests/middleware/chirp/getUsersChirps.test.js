const mw = require("../../../middleware/chirp/getUsersChirpsMW");
jest.mock("../../../middleware/requireOption", () => {
  return jest.fn();
});
const requireOption = require("../../../middleware/requireOption");
const flushPromises = () => new Promise(setImmediate);

describe("getUsersChirps middleware", () => {
  let ChirpModel;
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
          { userId: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp1", date: new Date("2012.01.01") },
          { userId: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp2", date: new Date("2012.01.02") }
        ]);
      }),
    };
    objrepo = {
      ChirpModel: ChirpModel,
    };
    requireOption.mockImplementation((objRepo, modelName) => {
      if (modelName === "ChirpModel") {
        return objRepo.ChirpModel;
      }
    });
    req = {
      session: {
        userId: 1
      },
      toastr: {
        error: jest.fn((message) => message)
      },
    };
    res = {
      locals: {
        chirps: null,
      },
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch chirps and call next", async () => {
    const mwFunc = mw(objrepo);
    await mwFunc(req, res, next);
    await flushPromises();
    expect(ChirpModel.find).toHaveBeenCalledWith({ userId: req.session.userId });
    expect(ChirpModel.populate).toHaveBeenCalledWith("userId");
    expect(ChirpModel.sort).toHaveBeenCalledWith({ date: -1 });
    expect(ChirpModel.exec).toHaveBeenCalled();
    expect(res.locals.chirps).toEqual([
      { userId: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp1", date: new Date("2012.01.01") },
          { userId: { _id: 1, name: "User1", email: "user1@email.com", password: "pass1" }, text: "Chirp2", date: new Date("2012.01.02") }
    ]);
    expect(next).toHaveBeenCalled();
    });
  test("should handle error and send 500 status", async () => {
    console.error = jest.fn();
    ChirpModel.exec.mockImplementationOnce(() => {
      return Promise.reject(new Error("Database error"));
    });
    const mwFunc = mw(objrepo);
    await mwFunc(req, res, next);
    await flushPromises();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    expect(console.error).toBeCalledWith("Error fetching chirps:", expect.any(Error));
    expect(next).not.toHaveBeenCalled();
  });
});
