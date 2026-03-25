import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { ThemeContext } from "./ThemeProvider";
import ThemeProvider from "./ThemeProvider";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Profile from "./Profile";
import Messages from "./Messages";
import Notifications from "./Notifications";
import JobPost from "./Jobs";
import TopNavbar from "./TopNavbar";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./NotFound";

function AppRoutes() {
  const token = localStorage.getItem("token"); // ✅ Check token persistence
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user && <TopNavbar />}
      <Routes>
      <Route path="/" element={token ? <Navigate to="/home" /> : <Login />} /> {/* ✅ Fix: Redirect only if logged in */}        <Route path="/register" element={<Register />} />
      <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} /> {/* ✅ Fix: Redirect unauthorized users to login */}
        {user && (
          <>
            <Route path="/jobs" element={<PrivateRoute><JobPost /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
