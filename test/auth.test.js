// express app
const app = require("../index");
// supertest
const request = require("supertest");
// flush user hook
const flushUser = require("./hooks/flushUser");
// delete latest added user script
beforeAll(flushUser);

describe("register process", () => {
  test("add user to db when credentials are correct", async () => {
    const newUser = await request(app)
      .post("/register")
      .send({ email: "test@gmail.com", password: "test123" });
    const newUserCredentials = newUser.body;
    expect(newUserCredentials.email).toBe(`test@gmail.com`);
    // expect(newUserCredentials.password).toBe(`test123`);
  });

  test("throw duplicate email error code status", async () => {
    const newUser = await request(app)
      .post("/register")
      .send({ email: "test@gmail.com", password: "test123" });
    const duplicateMailCodeStatus = newUser.body.code;
    expect(duplicateMailCodeStatus).toBe(11000);
  });

  test("throw password too short error", async () => {
    const newUser = await request(app)
      .post("/register")
      .send({ email: "test@gmail.com", password: "test" });
    const passwordErrMsg = newUser.body.errors.password.message;
    expect(passwordErrMsg).toBe(
      "Password is too short. Minimum password length is 6 characters"
    );
  });
});

describe("auth process", () => {
  test("authenticate user", async () => {
    const user = await request(app)
      .post("/authenticate")
      .send({ email: "test@gmail.com", password: "test123" });
    const token = user.body.token;
    expect(token).not.toBe(null);
  });
  test("throw incorrect email error", async () => {
    const userWithBadCredentials = await request(app)
      .post("/authenticate")
      .send({ email: "testt@gmail.com", password: "test123" });
    expect(userWithBadCredentials.body.error).toBe("incorrect email");
  });
  test("throw incorrect password error", async () => {
    const userWithBadCredentials = await request(app)
      .post("/authenticate")
      .send({ email: "test@gmail.com", password: "test1234" });
    expect(userWithBadCredentials.body.error).toBe("incorrect password");
  });
});

describe.skip("logout process", () => {
  test("logout user", async () => {
    const logout = await request(app).get("/logout");
    expect(logout.text).toBe("jwt deleted");
  });
});
