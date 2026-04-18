import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (role === "admin") return null;

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
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
    <>
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

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* LINKS */}
        <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/home" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/verticals" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Verticals
          </NavLink>
          <NavLink to="/careers" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Careers
          </NavLink>
          <NavLink to="/gallery" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Gallery
          </NavLink>
          <NavLink to="/membership" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Membership
          </NavLink>
          <NavLink to="/events" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
            Events
          </NavLink>
          {token ? (
            <>
              <NavLink to="/profile" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
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
              <NavLink to="/login" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/signup" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
                Signup
              </NavLink>
            </>
          )}
        </nav>

        </div>
      </header>

      {token && (
        <button
          type="button"
          className="chat-fab"
          aria-label="Open chat"
          title="Open chat"
          onClick={() => navigate("/chat")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.52 1.46 4.77 3.75 6.23V21a1 1 0 0 0 1.53.85L11.2 19.4c.27.03.53.05.8.05 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
            <circle cx="8.5" cy="11" r="1.2" />
            <circle cx="12" cy="11" r="1.2" />
            <circle cx="15.5" cy="11" r="1.2" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Navbar;
