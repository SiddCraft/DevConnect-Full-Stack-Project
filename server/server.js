const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt"); // ✅ Added bcrypt import
const http = require("http"); // ✅ Added HTTP server instance
const { Server } = require("socket.io");
const Notification = require("./models/notifications.js");
const User = require("./models/User.js");
const Job = require("./models/jobs.js");
const Posts = require("./models/posts.js");
const Message = require("./models/message.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB connection error:", err));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/", require("./routes/protected"));

// ✅ Registration Route
app.post("/api/register", async (req, res) => {
  const { name, email, password, github } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, github });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: "User already exists or error" });
  }
});

// ✅ Fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Socket.io Messaging System
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // ✅ Join a Chat Room
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group: ${groupId}`);
  });

  // ✅ Send Message & Notify Receiver
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message({
        sender: data.sender,
        text: data.text,
        groupId: data.groupId, 
      });

      await newMessage.save();

      const notification = new Notification({
        userId: data.receiverId,
        message: `${data.sender} sent you a message.`,
        type: "message",
      });

      await notification.save();

      // ✅ Emit message & notification only to the right group
      io.to(data.groupId).emit("receiveMessage", newMessage);
      io.to(data.receiverId).emit("newNotification", notification);

    } catch (error) {
      console.error("❌ Error in sendMessage:", error);
    }
  });

  // ✅ Post a Job Notification
  socket.on("postJob", async (data) => {
    try {
      const notification = new Notification({
        userId: data.userId,
        message: `A new job "${data.title}" was posted.`,
        type: "job",
      });

      await notification.save();

      io.emit("newNotification", notification);
    } catch (error) {
      console.error("❌ Error in postJob:", error);
    }
  });

  // ✅ Typing Indicators
  socket.on("userTyping", (data) => {
    socket.to(data.groupId).emit("typing", { user: data.user });
  });

  socket.on("userStoppedTyping", (data) => {
    socket.to(data.groupId).emit("stoppedTyping", { user: data.user });
  });

  // ✅ Handle Disconnect
  socket.on("disconnect", () => {
    console.log(`⚠️ User disconnected: ${socket.id}`);
  });
});

// ✅ Post System (Likes & Comments)
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/posts", require("./routes/posts"));

app.put("/api/posts/:id/like", async (req, res) => {
  await Posts.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.json({ message: "Post liked!" });
});

app.put("/api/posts/:id/comment", async (req, res) => {
  await Posts.findByIdAndUpdate(req.params.id, { $push: { comments: req.body } });
  res.json({ message: "Comment added!" });
});

// ✅ Start Server Using HTTP Instance
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
