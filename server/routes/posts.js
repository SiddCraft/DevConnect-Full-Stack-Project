const express = require("express");
const Post = require("../models/posts");

const router = express.Router();

// ✅ Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// ✅ Create a post with correct user data
router.post("/", async (req, res) => {
  const { content, user } = req.body;
  if (!user) return res.status(400).json({ message: "User is required!" });

  const newPost = new Post({ content, user });
  await newPost.save();
  res.json(newPost);
});

// ✅ Like a post (Prevent duplicate likes)
router.put("/posts/:id/like", async (req, res) => {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
  
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
  
    await post.save();
    res.json({ liked: post.likes.includes(userId), totalLikes: post.likes.length });
  });
  


// ✅ Comment on a post
router.post("/:id/comment", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found!" });
  
      const newComment = { user: req.body.user, content: req.body.content };
  
      post.comments.push(newComment);
      await post.save();
  
      res.json({ comments: post.comments }); // ✅ Send updated comments back
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      res.status(500).json({ message: "Server error while adding comment" });
    }
  });
  
  
// ✅ Generate shareable post link
router.get("/:id/share", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found!" });

  const shareLink = `http://localhost:3000/post/${post._id}`;
  res.json({ shareLink });
});

module.exports = router;
