const express = require("express");
const UserRouter = require("./routers/users");
const jwt = require("jsonwebtoken");
const TaskRouter = require("./routers/tasks");
const Task = require("../src/models/task");
const User = require("../src/models/user");
require("./db/mongoose");

const app = express();
const multer = require("multer");

app.use(express.json()); //to convert json into object
app.use("/users", UserRouter);
app.use("/tasks", TaskRouter);

module.exports = app;
