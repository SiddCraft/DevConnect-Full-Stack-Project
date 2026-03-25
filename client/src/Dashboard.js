import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setForm(data); // Initialize form with current data
        })
        .catch((err) => {
          console.error("Error:", err);
          logout();
          navigate("/login");
        });
    }
  }, [token, logout, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then((updated) => {
        setUserData(updated);
        setEditMode(false);
        alert("Profile updated successfully");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update profile.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-card">
          {userData ? (
            <>
              <h2>👋 Welcome, {userData.name}!</h2>
              {!editMode ? (
                <>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>GitHub:</strong> {userData.github}</p>
                  <p><strong>Education:</strong> {userData.education}</p>
                  <p><strong>Experience:</strong> {userData.experience}</p>
                  <p><strong>Skills:</strong> {userData.skills}</p>
                  <button onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <input type="text" name="name" value={form.name || ""} onChange={handleChange} placeholder="Name" />
                  <input type="text" name="github" value={form.github || ""} onChange={handleChange} placeholder="GitHub" />
                  <input type="text" name="education" value={form.education || ""} onChange={handleChange} placeholder="Education" />
                  <input type="text" name="experience" value={form.experience || ""} onChange={handleChange} placeholder="Experience" />
                  <input type="text" name="skills" value={form.skills || ""} onChange={handleChange} placeholder="Skills" />
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
              )}
            </>
          ) : (
            <p className="loading-text">Loading or unauthorized...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
