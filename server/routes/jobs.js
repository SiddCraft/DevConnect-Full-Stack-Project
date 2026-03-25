const express = require("express");
const Job = require("../models/jobs");
const router = express.Router();

// ✅ Post a new job
router.post("/post", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: "Job posted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error posting job" });
  }
});

// ✅ Search jobs by title or company
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { $or: [{ title: { $regex: search, $options: "i" } }, { company: { $regex: search, $options: "i" } }] } : {};
    const jobs = await Job.find(query);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
});

module.exports = router;
