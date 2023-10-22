const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOneId,
  userOne,
  userTwo,
  setupDatabase,
  taskOne,
  taskTwo,
  taskThree,
} = require("./fixture/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Virtual task",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should get all tasks for a user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Test delete task securtiy", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id.toString()}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  expect(response.error.text).toContain("Task not found!");
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should delete user task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete task if unauthenticated", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
  expect(response.error.text).toContain("Please authenticate!");
});

test("Should not update other user tasks", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Virtual",
      completed: true,
    })
    .expect(400);
  const task = await Task.findById(taskThree._id);
  expect(task.description).not.toEqual("Virtual");
});

test("Should fetch user task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.description).toBe(taskThree.description);
});

test("Should not fetch user task by id if unauthenticated", async () => {
  const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .send()
    .expect(401);
  expect(response.error.text).toContain("Please authenticate!");
});

test("Should not fetch other users task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  expect(response.error.text).toContain("task not found");
});
