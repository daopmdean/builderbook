const generateSlug = require("../../../server/utils/slugify");

const MockUserModal = {
  slugs: ["john-jonhson-jr", "john-jonhson-jr-1", "john"],
  findOne({ slug }) {
    if (this.slugs.includes(slug)) {
      return Promise.resolve({ id: "id" });
    }

    return Promise.resolve(null);
  },
};

describe("slugify", () => {
  test("no duplication", () => {
    expect.assertions(1);

    return generateSlug(MockUserModal, "John Jonhson.").then((slug) => {
      expect(slug).toBe("john-jonhson");
    });
  });

  test("one duplication", async () => {
    expect.assertions(1);

    return generateSlug(MockUserModal, "John.").then((slug) => {
      expect(slug).toBe("john-1");
    });
  });

  test("multiple duplication", () => {
    expect.assertions(1);

    return generateSlug(MockUserModal, "John Jonhson Jr.").then((slug) => {
      expect(slug).toBe("john-jonhson-jr-2");
    });
  });
});
