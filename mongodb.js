const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionURL);

// const id = new ObjectId();
// console.log(id);
// console.log(id.getTimestamp());
const databaseName = "task-manager";

async function main() {
  await client.connect();
  console.log("Connected successfully to the server");
  const db = client.db(databaseName);
  // const user=await db.collection("user").find({name:'Andrew'}).toArray();
  // db.collection.find("task").find({ completed: false });
  // await db.collection("task").findOne({
  //   _id: new ObjectId("65107a3232201bfce08ab413"),
  // });
  // return task;
  // await db.collection("user").insertMany([
  //   {
  //     name: "Andrew",
  //     age: 27,
  //   },
  //   {
  //     name: "Gutner",
  //     age: 25,
  //   },
  // ]);
  // await db.collection("task").insertMany([
  //   {
  //     description: "Manual task",
  //     completed: true,
  //   },
  //   {
  //     description: "Automatic task",
  //     completed: false,
  //   },
  // ]);
  // await db
  //   .collection("user")
  //   .updateOne({ name: "Andrew" }, { $inc: { age: 1 } }) //inc=> increases the age of the given record details by 1
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // await db
  //   .collection("task")
  //   .updateMany({ completed: false }, { $set: { completed: true } })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((erroe) => {
  //     console.log(error);
  //   });
  // await db.collection('user').deleteMany({age:25}).then((result)=>{
  //   console.log(result);
  // }).catch((error)=>{
  //   console.log(error);
  // })
  await db
    .collection("task")
    .deleteOne({ description: "Manual task" })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log(error));
  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    client.close();
    console.log("connection closed successfully!");
  });
