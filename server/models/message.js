const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: String, // Who sent the message
  text: String, // Message content
  groupId: String, // ✅ Group chat identifier
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
