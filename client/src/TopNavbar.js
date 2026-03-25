import React from "react";
import { FaHome, FaUser, FaEnvelope, FaBriefcase, FaBell } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./TopNavbar.css";

const TopNavbar = () => {
  return (
    <nav className="top-navbar">
      <NavLink to="/home" className="nav-icon" activeclassname="active">
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/jobs" className="nav-icon" activeclassname="active">
        <FaBriefcase />
        <span>Jobs</span>
      </NavLink>
      <NavLink to="/messages" className="nav-icon" activeclassname="active">
        <FaEnvelope />
        <span>Messages</span>
      </NavLink>
      <NavLink to="/notifications" className="nav-icon" activeclassname="active">
        <FaBell />
        <span>Notifications</span>
      </NavLink>
      <NavLink to="/dashboard" className="nav-icon" activeclassname="active">
        <FaUser />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default TopNavbar;
