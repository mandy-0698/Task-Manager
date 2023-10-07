const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
