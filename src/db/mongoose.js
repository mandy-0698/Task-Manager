const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-db"); //for connecting to database ...format =>url/name of db






// const task = new Task({});

// task
//   .save()
//   .then(() => {
//     console.log(task);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     mongoose.connection.close();
//     console.log("Connection closed!");
//   });
