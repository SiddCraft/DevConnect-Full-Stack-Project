const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path based on your structure
const authMiddleware = require("../middleware/auth"); // Optional: Use this if Explore requires login

// Get all users (excluding passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
