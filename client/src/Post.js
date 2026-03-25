import React, { useState } from "react";
import axios from "axios";
import "./Post.css";

const Post = ({ post, loggedInUser }) => {
  if (!post) return null; // ✅ Prevent undefined errors

  const [liked, setLiked] = useState(post.likes?.includes(loggedInUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  // ✅ Like Toggle Functionality
  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${post._id}/like`, { userId: loggedInUser.id });
  
      if (res.data.success) {
        setLiked(!liked); // ✅ Toggle the like state
        setLikeCount(res.data.totalLikes); // ✅ Update like count
      }
    } catch (error) {
      console.error("❌ Error liking post:", error);
    }
  };
  
    // ✅ Comment Functionality
    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
      
        if (!loggedInUser || !loggedInUser.name) {
          console.error("❌ Error: User data is missing!");
          return;
        }
      
        try {
          const res = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
            user: loggedInUser.name, // ✅ Ensure user is included
            content: newComment,
          });
      
          setComments([...comments, { user: loggedInUser.name, content: newComment }]); // ✅ Update UI
          setNewComment(""); 
        } catch (error) {
          console.error("❌ Error adding comment:", error);
        }
      };
      
      

  return (
    <div className="post-card">
      <div className="post-header">
  <img src={post.user?.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="avatar" />
  <h4>{post.user?.name || "Anonymous"}</h4>
</div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button onClick={handleLike}>{liked ? "❤️" : "🤍"} {likeCount}</button>
        <button onClick={() => setShowComments(!showComments)}>💬 Comment</button>      </div>

        {showComments && (
  <div className="comments-section">
    {comments.map((comment, index) => (
      <p key={index}><strong>{comment.user || "User"}</strong>: {comment.content}</p>
    ))}
    <input type="text" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
    <button onClick={handleAddComment}>Post</button>
  </div>
)}
    </div>
  );
};

export default Post;
