// routes/profile.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const User = require("../models/User"); // adjust path if needed

// PUT /api/profile/update
router.put("/update", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ✅ Get user profile by ID
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // ✅ Update profile (Education, Experience, Skills)
  router.put("/:id", async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.json({ message: "Profile updated!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

module.exports = router;
