const request = require("supertest");
const app = require("../src/app");

test("Should sign up a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Gaurav12",
      email: "garjhak4545@gmail.com",
      password: "486eg564",
      age: 24,
    })
    .expect(201);
});
