import React, { useState, useEffect } from "react";
import Post from "./Post"; // ✅ Import the corrected Post component
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in user

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    }
  };

  const handlePostSubmit = async () => {
    if (newPost.trim() === "") return;

    await axios.post("http://localhost:5000/api/posts", {
      content: newPost,
      user: loggedInUser || { name: "Shiva", avatar: "default-avatar.jpg" }, // ✅ Default user backup
    });
    

    setNewPost("");
    fetchPosts();
  };

  return (
    <div className="home-container">
      <h1>🚀 DevConnect Feed</h1>

      <div className="new-post">
        <textarea
          placeholder="Share your thoughts..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      <div className="post-feed">
  {posts.length > 0 ? (
    posts.map((post) => (
      <Post key={post._id} post={post} loggedInUser={loggedInUser} />
    ))
  ) : (
    <p>No posts yet. Be the first to share!</p>
  )}
</div>

    </div>
  );
};

export default Home;
