import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Membership from "./pages/Membership";
import Events from "./pages/Events";
import About from "./pages/About";
import Verticals from "./pages/Verticals";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import FAQs from "./pages/faq";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    // Set dark theme by default
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT ROUTE */}
        <Route
          path="/"
          element={
            role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* ✅ SIGNUP (NEW USER ENTRY POINT) */}
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/home" />
            ) : (
              <Signup />
            )
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/home"
          element={
            <Home />
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/membership"
          element={
            <ProtectedRoute role="user">
              <Membership />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute role="user">
              <Events />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />

        <Route path="/verticals" element={<Verticals />} />

        <Route path="/gallery" element={<Gallery />} />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/faq" element={<FAQs />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
