const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  github: String,
  education: { type: String, default: "" },
  experience: { type: String, default: "" },
  skills: { type: [String], default: [] },
});

module.exports = mongoose.model("User", UserSchema);
