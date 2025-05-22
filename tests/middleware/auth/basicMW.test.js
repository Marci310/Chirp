const mw = require("../../../middleware/auth/basicMW");

describe("basicMW middleware", () => {
  let objectrepository;
  let req;
  let res;
  let next;

  beforeEach(() => {
    objectrepository = null;
    req = {
      session: {
        userId: null,
      },
    };
    res = {
      render: jest.fn((view) => {}),
      redirect: jest.fn((where) => {}),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("not-logged-in", () => {
    req.session.userId = null;
    mw(objectrepository)(req, res, next);
    expect(next).not.toBeCalled();
    expect(res.render).toBeCalledWith("login");
    expect(res.redirect).not.toBeCalled();
  });
  test("logged-in", () => {
    req.session.userId = 1;
    mw(objectrepository)(req, res, next);
    expect(next).not.toBeCalled();
    expect(res.render).not.toBeCalled();
    expect(res.redirect).toBeCalledWith("/chirps");
  });
});
