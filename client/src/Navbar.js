import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { ThemeContext } from "./ThemeProvider"; // ✅ Make sure this is here!
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🚀 DevConnect</div>
      <div className="navbar-links">
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <button onClick={logout}>Logout</button>}

        <button onClick={toggleTheme} className="theme-button">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
