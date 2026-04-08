import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getEvents,
  registerForEvent,
  verifyAttendanceOtp,
} from "../services/eventService";
import { getOpenHiringOpportunities } from "../services/hiringOpportunityService";
import { getMyMembership } from "../services/membershipService";
import BorderGlow from "../components/BorderGlow";
import "./events.css";

const STATUS_SECTIONS = ["upcoming", "ongoing", "completed"];

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [hiringOpportunities, setHiringOpportunities] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [canAccessEvents, setCanAccessEvents] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      alert(err.message || "Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  const loadHiringOpportunities = async () => {
    try {
      const data = await getOpenHiringOpportunities();
      setHiringOpportunities(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadMembershipAndEvents = async () => {
      try {
        const membership = await getMyMembership();
        const isApproved = membership?.status === "approved";
        const isValid = membership?.validTill
          ? new Date(membership.validTill) >= new Date()
          : false;

        if (!isApproved || !isValid) {
          alert("Approved membership is required to access events.");
          navigate("/membership", { replace: true });
          return;
        }

        setCanAccessEvents(true);
        await Promise.all([loadEvents(), loadHiringOpportunities()]);
      } catch (err) {
        alert(err.message || "Please complete membership to access events.");
        navigate("/membership", { replace: true });
      }
    };

    loadMembershipAndEvents();
  }, [navigate]);

  const groupedEvents = useMemo(() => {
    return STATUS_SECTIONS.reduce((acc, key) => {
      acc[key] = events.filter((event) => event.status === key);
      return acc;
    }, {});
  }, [events]);

  const onRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      await loadEvents();
      alert("Registered successfully");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  const onVerifyOtp = async (eventId) => {
    try {
      await verifyAttendanceOtp(eventId, otpInputs[eventId] || "");
      await loadEvents();
      alert("Attendance marked as present");
    } catch (err) {
      alert(err.message || "OTP verification failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="events-page">
        <div className="events-container">
          <div className="events-head">
            <h1>Club Events</h1>
            <p>Track, register, and mark attendance for YUVA activities.</p>
          </div>

          {!canAccessEvents ? (
            <p>Checking membership access...</p>
          ) : loading ? (
            <p>Loading events...</p>
          ) : (
            STATUS_SECTIONS.map((status) => (
              <section key={status} className="event-section">
                <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Events</h2>

                {groupedEvents[status].length === 0 ? (
                  <p className="empty-state">No {status} events available.</p>
                ) : (
                  <div className="event-grid">
                    {groupedEvents[status].map((event) => (
                      <BorderGlow key={event._id} className="event-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={28} glowColor="200 80 60" colors={['#60a5fa', '#ec4899', '#10b981']}>
                        <article className="event-card-inner">
                        {event.poster && (
                          <div className="event-poster-container">
                            <img src={event.poster} alt={event.title} className="event-poster" />
                          </div>
                        )}
                        <div className="event-top">
                          <h3>{event.title}</h3>
                          <span className={`status-badge ${event.status}`}>
                            {event.status}
                          </span>
                        </div>

                        <p>{event.description}</p>

                        <ul>
                          <li>Date: {new Date(event.date).toLocaleDateString()}</li>
                          <li>Time: {event.time}</li>
                          <li>Location: {event.location}</li>
                          <li>
                            Attendance: {event.attendanceStatus || "absent"}
                          </li>
                        </ul>

                        <div className="event-actions">
                          {!event.isRegistered ? (
                            <button
                              className="action-btn"
                              disabled={event.status === "completed"}
                              onClick={() => onRegister(event._id)}
                            >
                              Register
                            </button>
                          ) : (
                            <span className="registered-pill">Registered</span>
                          )}

                          {event.isRegistered && event.attendanceStatus !== "present" && (
                            <div className="otp-box">
                              <input
                                placeholder="Enter OTP"
                                value={otpInputs[event._id] || ""}
                                onChange={(e) =>
                                  setOtpInputs((prev) => ({
                                    ...prev,
                                    [event._id]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                className="action-btn secondary"
                                onClick={() => onVerifyOtp(event._id)}
                              >
                                Verify OTP
                              </button>
                            </div>
                          )}
                        </div>
                        </article>
                      </BorderGlow>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}

          {hiringOpportunities.length > 0 && (
            <section className="event-section opportunity-section">
              <h2>Hiring Opportunities</h2>
              <div className="opportunity-grid">
                {hiringOpportunities.map((opportunity) => (
                  <BorderGlow
                    key={opportunity._id}
                    className="opportunity-card-glow"
                    backgroundColor="#1e293b"
                    borderRadius={12}
                    glowRadius={26}
                    glowColor="200 80 60"
                    colors={['#f59e0b', '#f97316', '#ea580c']}
                  >
                    <article className="opportunity-card-inner">
                      <div className="opportunity-top">
                        <h3>{opportunity.title}</h3>
                        <span className="status-badge open">Open</span>
                      </div>
                      <p>{opportunity.description || "No description provided."}</p>
                      <a
                        className="apply-btn"
                        href={opportunity.googleFormLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Interested? Apply Now
                      </a>
                    </article>
                  </BorderGlow>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Events;
