const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// ✅ Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// ✅ Create a new post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.json(newPost);
});

// ✅ Like a post
router.put("/:id/like", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.json({ message: "Post liked!" });
});

// ✅ Add a comment
router.put("/:id/comment", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $push: { comments: req.body } });
  res.json({ message: "Comment added!" });
});

module.exports = router;
