const mongoose = require("mongoose");
const Task = require("../src/models/task");
require("../src/db/mongoose");

const id = "6511d27bc3985b0c1877eb7f";

// Task.findByIdAndRemove(id).then((task)=>{
//     console.log("Deleted task ",task);
//     return Task.count({completed:false});
// }).then((count)=>{
//     console.log(count);
// }).catch((e)=>{
//     console.log(e);
// })

const deleteTaskandCount = async (id) => {
  const task = await Task.findByIdAndRemove(id);
  console.log(`deleted ${JSON.stringify(task)}`);
  const count = await Task.count({ completed: false });
  return count;
};

deleteTaskandCount(id)
  .then((count) => {
    console.log(`${count}`);
  })
  .catch((e) => {
    console.error(e);
  });
