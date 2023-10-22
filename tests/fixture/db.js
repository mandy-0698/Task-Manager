const User = require("../../src/models/user");
const Task = require("../../src/models/task");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@gmail.com",
  password: "56jdhsuf",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, "mynewCourse"),
    },
  ],
};

const userTwo = {
  _id: userTwoId,
  name: "Michael",
  email: "michael@gmail.com",
  password: "56jhsua",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, "mynewCourse"),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Virtual task2",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Virtual task3",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Virtual task4",
  completed: false,
  owner: userTwo._id,
};
const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  setupDatabase,
  taskOne,
  taskTwo,
  taskThree,
};
