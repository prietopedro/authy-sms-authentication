const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name must be provided"]
  },
  phone: {
    type: String,
    required: [true, "Phone number must be provided"],
    unique: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  authy_id: {
    type: String
  },
  email: {
    type: String,
    required: [true, "Phone number must be provided"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password must be provided"]
  }
});

var User = mongoose.model("Users", userSchema);
module.exports = User;
