const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userschema = new mongoose.Schema(
  {
    //for creating schema
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 6) {
          throw new Error("password should have atleast seven characters");
        } else if (value.toLowerCase().includes("password")) {
          throw new Error("please enter strong password!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
userschema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userschema.methods.toJSON = function () {
  const user = this;
  console.log(user);
  const userProfile = user.toObject();
  delete userProfile.password;
  delete userProfile.tokens;
  return userProfile;
};

userschema.methods.generateAuthToken = function () {
  const user = this;
  console.log(user._id);
  const token = jwt.sign({ _id: user._id.toString() }, "mynewCourse");
  console.log(token);
  return token;
};
// userschema.method("generateAuthToken", async (id) => {
//   // const user = this;
//   // console.log(user);
//   console.log(id);
//   console.log("inside generateAuthtoken fn");
//   const token = jwt.sign({ _id: id }, "mynewCourse");
//   // console.log(token);
//   return token;
// });
// userschema.methods.generateAuthToken=()=>{
//   return this;
//   const user=this;
//   console.log(user);
//   console.log("inside generateAuthtoken fn");
//   const token= jwt.sign({_id:user._id.toString()},"mynewCourse");
//   console.log(token);
//   return token;
// }
userschema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
//Calling pre() or post() after compiling a model does not work in Mongoose in general. For example, the below pre('save') middleware will not fire.
userschema.pre("save", async function (next) {
  //this will run before saving the data to database and it can also be used for updating the existing document as well
  const user = this;
  //console.log(user);
  if (user.isModified("password")) {
    // console.log("hi before saving");
    user.password = await bcrypt.hash(user.password, 8);
  }
  // console.log("before saving");
  next();
});
userschema.pre("deleteOne", async function (next) {
  console.log("deleting tasks");
  // console.log(this);
  // const user = this;
  const id = this.getQuery()["_id"];
  console.log(id);
  await Task.deleteMany({ owner: id });
  next();
});
const User = mongoose.model("User", userschema);

module.exports = User;
