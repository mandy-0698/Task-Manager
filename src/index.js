const express = require("express");
const UserRouter = require("./routers/users");
const jwt = require("jsonwebtoken");
const TaskRouter = require("./routers/tasks");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
// });
// app.use((req,res,next)=>{
// res.status(503).send("Service is temporarily unavailable!");
// })

app.use(express.json()); //to convert json into object
app.use("/users", UserRouter);
app.use("/tasks", TaskRouter);
const bcrypt = require("bcryptjs");

// const myFunc = async () => {
//   const password = "ram@123";
//   const hashedPassword = await bcrypt.hash(password, 8);
//   // console.log(password);
//   // console.log(hashedPassword);
//   const isMatch = await bcrypt.compare("Ram@123", hashedPassword);
//   console.log(isMatch);
// };

//myFunc();
// const myFunc = async () => {
//   const token = jwt.sign({ _id: "Rt@2346" }, "mynewProject", {
//     expiresIn: 60 * 60,
//   });
//   console.log(token);
//   const ans = jwt.verify(token, "mynewProject");
//   console.log(ans);
// };

// myFunc();
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
