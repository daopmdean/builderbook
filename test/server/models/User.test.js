const mongoose = require("mongoose");
const User = require("../../../server/models/User");

describe("slugify", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST);
    console.log("mongoose connected");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("mongoose disconnected");
  });

  test("no duplication", async () => {
    expect.assertions(1);
    await User.deleteOne({ email: "test1@test.ts" });
    const user = await User.signInOrSignUp({
      googleId: "test1",
      email: "test1@test.ts",
      googleToken: { accessToken: "test1", refreshToken: "test1" },
      displayName: "Test Name",
      avatarUrl: "test1",
    });
    expect(user.slug).toBe("test-name");
  });
});
