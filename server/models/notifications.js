const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: String, // The user who receives the notification
  message: String, // Notification text
  type: String, // "message" or "job"
  isRead: { type: Boolean, default: false }, // Track if seen
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
