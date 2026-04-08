import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const loadNotifications = async () => {
      try {
        const data = await getMyNotifications();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    loadNotifications();
  }, [token]);

  if (role === "admin") return null;

  const handleLogout = () => {
    localStorage.clear();
    // hard redirect so the app reloads and shows login immediately
    window.location.href = "/login";
  };

  const handleMarkOne = async (id) => {
    try {
      await markNotificationRead(id);
      const data = await getMyNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      const data = await getMyNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* BRAND */}
        <div className="nav-brand" onClick={() => navigate("/home")}>
          <img src="/images/yuva-logo.png" alt="YUVA" className="nav-logo" />
          <div className="brand-text">
            <span className="brand-main">YUVA</span>
            <span className="brand-sub">Club · SEC</span>
          </div>
        </div>

        {/* LINKS */}
        <nav className="nav-links">
          <NavLink to="/home" className="nav-item">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-item">
            About
          </NavLink>
          <NavLink to="/verticals" className="nav-item">
            Verticals
          </NavLink>
          <NavLink to="/gallery" className="nav-item">
            Gallery
          </NavLink>
          <NavLink to="/membership" className="nav-item">
            Membership
          </NavLink>
          <NavLink to="/events" className="nav-item">
            Events
          </NavLink>
          {token ? (
            <>
              <NavLink to="/profile" className="nav-item">
                Profile
              </NavLink>

              <div className="notification-wrap">
                <button
                  className="notification-bell"
                  onClick={() => setOpenNotifications((prev) => !prev)}
                  title="Notifications"
                >
                  <span>🔔</span>
                  {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount}</span>
                  )}
                </button>

                {openNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <strong>Notifications</strong>
                      <button onClick={handleMarkAll}>Mark all read</button>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="notification-empty">No notifications</p>
                    ) : (
                      notifications.map((item) => (
                        <button
                          key={item._id}
                          className={`notification-item ${item.isRead ? "read" : "unread"}`}
                          onClick={() => handleMarkOne(item._id)}
                        >
                          <span>{item.message}</span>
                          <small>{new Date(item.createdAt).toLocaleString()}</small>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-item">
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-item">
                Signup
              </NavLink>
            </>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
