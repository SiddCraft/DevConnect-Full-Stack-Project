const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.name}!` });
});

module.exports = router;
