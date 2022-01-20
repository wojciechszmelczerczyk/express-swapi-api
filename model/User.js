const mongoose = require("mongoose");

const { Schema } = mongoose;

const { isEmail } = require("validator");

// user schema
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [
      6,
      "Password is too short. Minimum password length is 6 characters",
    ],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
