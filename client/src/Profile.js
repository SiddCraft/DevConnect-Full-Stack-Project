import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // 👈 CSS file

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    github: "",
    bio: "",
    education: "",
    experience: "",
    skills: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/profile", profile, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="profile-container">
      <h2>🚀 Developer Profile</h2>
      
      {/* ✅ Display Profile Info */}
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a></p>

      {/* ✅ Editable Fields */}
      <label>Bio:</label>
      <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows="3" />

      <label>Education:</label>
      <input name="education" value={profile.education} onChange={handleChange} placeholder="Your educational background" />

      <label>Experience:</label>
      <input name="experience" value={profile.experience} onChange={handleChange} placeholder="Work experience" />

      <label>Skills (comma-separated):</label>
      <input name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills: JavaScript, React, Node.js..." />

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default Profile;
