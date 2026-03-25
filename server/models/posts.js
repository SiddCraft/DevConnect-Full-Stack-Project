const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { 
    type: Object, 
    required: true, 
    default: { name: "Anonymous", avatar: "default-avatar.jpg" } 
  },
  likes: { type: Array, default: [] },
  comments: { type: Array, default: [] },
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt timestamps

// ✅ Ensure `PostSchema` is correctly referenced in the export!
module.exports = mongoose.model("Post", PostSchema);
