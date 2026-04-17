import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BorderGlow from "../components/BorderGlow";
import {
  approveMember,
  createEvent,
  deleteEvent,
  getCareerApplications,
  getAdminStats,
  getEventAttendanceSummary,
  getMemberAttendance,
  getMembers,
  getPendingMembers,
  rejectMember,
  startAttendance,
  updateCareerApplicationStatus,
  uploadEventPoster,
} from "../services/adminService";
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  updateGalleryImage,
  uploadGalleryImage,
} from "../services/galleryService";
import { getEvents } from "../services/eventService";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");

  const [stats, setStats] = useState({
    totalApplications: 0,
    activeMembers: 0,
    newThisWeek: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    attendanceRate: 0,
  });

  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [search, setSearch] = useState("");

  const [careerApplications, setCareerApplications] = useState([]);
  const [careerFilters, setCareerFilters] = useState({
    search: "",
    domain: "",
    status: "",
  });
  const [careerLoading, setCareerLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [activeOtp, setActiveOtp] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState({});

  const [memberAttendance, setMemberAttendance] = useState({});
  const [memberAttendanceLoading, setMemberAttendanceLoading] = useState({});
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "upcoming",
    poster: "",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterUploading, setPosterUploading] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "general",
    imageUrl: "",
  });
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryEditingId, setGalleryEditingId] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await getMembers(search);
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  const fetchPendingMembers = useCallback(async () => {
    try {
      const data = await getPendingMembers();
      setPendingMembers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCareerApplications = useCallback(async () => {
    try {
      setCareerLoading(true);
      const data = await getCareerApplications(careerFilters);
      setCareerApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setCareerLoading(false);
    }
  }, [careerFilters]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchGalleryImages = useCallback(async () => {
    try {
      const data = await getGalleryImages();
      setGalleryImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchPendingMembers();
    fetchEvents();
    fetchGalleryImages();
    fetchCareerApplications();
  }, [
    fetchEvents,
    fetchCareerApplications,
    fetchGalleryImages,
    fetchPendingMembers,
    fetchStats,
  ]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    fetchCareerApplications();
  }, [fetchCareerApplications]);

  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/download-members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Failed to download Excel");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "yuva_members.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Server error while downloading Excel");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveMember(id);
      await Promise.all([fetchPendingMembers(), fetchMembers(), fetchStats()]);
    } catch (err) {
      alert(err.message || "Failed to approve member");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectMember(id);
      await Promise.all([fetchPendingMembers(), fetchMembers(), fetchStats()]);
    } catch (err) {
      alert(err.message || "Failed to reject member");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      let posterUrl = eventForm.poster;
      if (posterFile) {
        setPosterUploading(true);
        const uploadResult = await uploadEventPoster(posterFile);
        posterUrl = uploadResult.posterUrl;
      }

      await createEvent({
        ...eventForm,
        poster: posterUrl,
      });

      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        status: "upcoming",
        poster: "",
      });
      setPosterFile(null);
      setPosterPreview(null);

      await Promise.all([fetchEvents(), fetchStats()]);
      alert("Event created successfully");
    } catch (err) {
      alert(err.message || "Failed to create event");
    } finally {
      setPosterUploading(false);
    }
  };

  const handlePosterSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPosterPreview(event.target?.result || null);
    };
    reader.readAsDataURL(file);
  };

  const handleStartAttendance = async (eventId) => {
    try {
      const result = await startAttendance(eventId);
      setActiveOtp((prev) => ({ ...prev, [eventId]: result }));
    } catch (err) {
      alert(err.message || "Failed to start attendance");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      await Promise.all([fetchEvents(), fetchStats()]);
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  };

  const handleViewAttendance = async (eventId) => {
    try {
      setAttendanceLoading((prev) => ({ ...prev, [eventId]: true }));
      const data = await getEventAttendanceSummary(eventId);
      setAttendanceSummary((prev) => ({ ...prev, [eventId]: data }));
    } catch (err) {
      alert(err.message || "Failed to fetch attendance details");
    } finally {
      setAttendanceLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleUpdateCareerStatus = async (applicationId, status) => {
    try {
      await updateCareerApplicationStatus(applicationId, status);
      if (status === "rejected") {
        setCareerApplications((prev) =>
          prev.filter((application) => application._id !== applicationId)
        );
        return;
      }

      await fetchCareerApplications();
    } catch (err) {
      alert(err.message || "Failed to update application status");
    }
  };

  const handleGalleryFileSelect = (e) => {
    const file = e.target.files?.[0];
    setGalleryFile(file || null);
  };

  const resetGalleryForm = () => {
    setGalleryForm({ title: "", category: "general", imageUrl: "" });
    setGalleryFile(null);
    setGalleryEditingId("");
  };

  const handleSaveGalleryImage = async (e) => {
    e.preventDefault();
    try {
      setGalleryUploading(true);
      let imageUrl = galleryForm.imageUrl.trim();

      if (galleryFile) {
        const uploaded = await uploadGalleryImage(galleryFile);
        imageUrl = uploaded.imageUrl;
      }

      if (!imageUrl) {
        throw new Error("Please upload an image file or enter an image URL");
      }

      const payload = {
        title: galleryForm.title,
        category: galleryForm.category,
        imageUrl,
      };

      if (galleryEditingId) {
        await updateGalleryImage(galleryEditingId, payload);
      } else {
        await createGalleryImage(payload);
      }

      resetGalleryForm();
      await fetchGalleryImages();
    } catch (err) {
      alert(err.message || "Failed to save gallery image");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleEditGalleryImage = (image) => {
    setGalleryEditingId(image._id);
    setGalleryForm({
      title: image.title || "",
      category: image.category || "general",
      imageUrl: image.imageUrl || "",
    });
    setGalleryFile(null);
    setActiveSection("gallery");
  };

  const handleDeleteGalleryImage = async (id) => {
    try {
      await deleteGalleryImage(id);
      await fetchGalleryImages();
      if (galleryEditingId === id) {
        resetGalleryForm();
      }
    } catch (err) {
      alert(err.message || "Failed to delete gallery image");
    }
  };

  const handleViewMemberAttendance = async (memberId) => {
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
      return;
    }

    setSelectedMemberId(memberId);

    if (memberAttendance[memberId]) {
      return;
    }

    try {
      setMemberAttendanceLoading((prev) => ({ ...prev, [memberId]: true }));
      const data = await getMemberAttendance(memberId);
      setMemberAttendance((prev) => ({ ...prev, [memberId]: data }));
    } catch (err) {
      alert(err.message || "Failed to fetch member attendance");
    } finally {
      setMemberAttendanceLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const toCsv = (rows) => {
    if (!rows || rows.length === 0) return "";
    const headers = [
      "Membership ID",
      "Name",
      "Email",
      "Register No",
      "Department",
      "Year",
      "Attendance Status",
      "Registered At",
    ];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const body = rows.map((u) =>
      [
        u.membershipId,
        u.name,
        u.email,
        u.rollNo,
        u.department,
        u.year,
        u.attendanceStatus,
        u.registeredAt ? new Date(u.registeredAt).toLocaleString() : "",
      ]
        .map(escapeCsv)
        .join(",")
    );

    return [headers.join(","), ...body].join("\n");
  };

  const downloadCsv = (filename, rows) => {
    const csv = toCsv(rows);
    if (!csv) {
      alert("No data available for download");
      return;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>YUVA Admin</h2>
        <p>Operations</p>

        <div className="admin-section-nav">
          <button
            className={activeSection === "overview" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            className={activeSection === "approvals" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("approvals")}
          >
            Membership Approvals
          </button>
          <button
            className={activeSection === "events" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("events")}
          >
            Events
          </button>
          <button
            className={activeSection === "gallery" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("gallery")}
          >
            Gallery Images
          </button>
          <button
            className={activeSection === "careers" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("careers")}
          >
            Careers
          </button>
          <button
            className={activeSection === "members" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection("members")}
          >
            Members List
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-dashboard">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
        </div>

        {activeSection === "overview" && (
          <div className="admin-stats">
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#60a5fa", "#3b82f6", "#1d4ed8"]}>
              <div className="stat-card-inner"><h4>Total Applications</h4><p>{stats.totalApplications}</p></div>
            </BorderGlow>
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#f59e0b", "#f97316", "#ea580c"]}>
              <div className="stat-card-inner"><h4>Pending Approvals</h4><p>{stats.pendingApprovals}</p></div>
            </BorderGlow>
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#10b981", "#34d399", "#6ee7b7"]}>
              <div className="stat-card-inner"><h4>Active Members</h4><p>{stats.activeMembers}</p></div>
            </BorderGlow>
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#8b5cf6", "#a78bfa", "#c9b9f5"]}>
              <div className="stat-card-inner"><h4>Total Events</h4><p>{stats.totalEvents}</p></div>
            </BorderGlow>
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#ec4899", "#f472b6", "#fbcfe8"]}>
              <div className="stat-card-inner"><h4>Attendance Rate</h4><p>{stats.attendanceRate}%</p></div>
            </BorderGlow>
            <BorderGlow className="stat-card-glow" backgroundColor="#1e293b" borderRadius={12} glowRadius={30} glowColor="200 80 60" colors={["#06b6d4", "#22d3ee", "#67e8f9"]}>
              <div className="stat-card-inner"><h4>New This Week</h4><p>{stats.newThisWeek}</p></div>
            </BorderGlow>
          </div>
        )}

        {(activeSection === "approvals" || activeSection === "overview") && (
          <div className="admin-panel">
            <h3>Pending Membership Approvals</h3>
            {pendingMembers.length === 0 ? (
              <p className="muted">No pending applications.</p>
            ) : (
              <div className="approval-grid">
                {pendingMembers.map((member) => (
                  <div key={member._id} className="approval-card">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                    <p>{member.rollNo}</p>
                    <div className="approval-actions">
                      <button onClick={() => handleApprove(member._id)}>Approve</button>
                      <button className="danger" onClick={() => handleReject(member._id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "events" && (
          <>
            <div className="admin-panel">
              <h3>Create Event</h3>
              <form className="event-form" onSubmit={handleCreateEvent}>
                <div className="form-row">
                  <input placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))} required />
                  <input placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))} required />
                </div>
                <div className="form-row">
                  <input placeholder="Date (DD/MM/YYYY)" value={eventForm.date} onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))} required />
                  <input placeholder="Time (HH:MM)" value={eventForm.time} onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))} required />
                </div>
                <div className="form-row">
                  <input placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))} required />
                  <select value={eventForm.status} onChange={(e) => setEventForm((prev) => ({ ...prev, status: e.target.value }))}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="poster-section">
                  <label className="poster-label">
                    <span>Event Poster (Image File)</span>
                    <input type="file" accept="image/*" onChange={handlePosterSelect} disabled={posterUploading} />
                  </label>
                  {posterPreview && (
                    <div className="poster-preview">
                      <img src={posterPreview} alt="Poster preview" />
                    </div>
                  )}
                  {posterUploading && <p className="uploading-text">Uploading poster...</p>}
                </div>

                <button type="submit" className="submit-btn" disabled={posterUploading}>Create Event</button>
              </form>
            </div>

            <div className="admin-panel">
              <h3>Event Operations</h3>
              {events.length === 0 ? (
                <p className="muted">No events yet.</p>
              ) : (
                <div className="event-admin-grid">
                  {events.map((event) => (
                    <div className="event-admin-card" key={event._id}>
                      <h4>{event.title}</h4>
                      <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p>{event.location}</p>
                      <span className={`status ${event.status}`}>{event.status}</span>

                      <div className="event-admin-actions">
                        <button onClick={() => handleStartAttendance(event._id)}>Start IN OTP</button>
                        <button onClick={() => handleViewAttendance(event._id)}>
                          {attendanceLoading[event._id] ? "Loading..." : "View Attendance"}
                        </button>
                        <button className="danger" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                      </div>

                      {activeOtp[event._id] && (
                        <p className="otp-readout">
                          IN OTP: <strong>{activeOtp[event._id].otpCode}</strong> (expires {new Date(activeOtp[event._id].otpExpiry).toLocaleTimeString()})
                        </p>
                      )}

                      {attendanceSummary[event._id] && (
                        <div className="attendance-summary">
                          <p className="attendance-counts">
                            Registered: <strong>{attendanceSummary[event._id].totalRegistered}</strong> | Attended: <strong>{attendanceSummary[event._id].totalAttended}</strong>
                          </p>

                          <div className="attendance-export-actions">
                            <button onClick={() => downloadCsv(`${event.title.replace(/\s+/g, "_")}_registered.csv`, attendanceSummary[event._id].registeredUsers)}>
                              Download Registered
                            </button>
                            <button onClick={() => downloadCsv(`${event.title.replace(/\s+/g, "_")}_attended.csv`, attendanceSummary[event._id].attendedUsers)}>
                              Download Attended
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === "gallery" && (
          <div className="admin-panel">
            <h3>Manage Gallery Images</h3>
            <form className="event-form" onSubmit={handleSaveGalleryImage}>
              <div className="form-row">
                <input
                  placeholder="Image title (optional)"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  placeholder="Category (e.g. womens day, sports day)"
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <input
                  placeholder="Or paste image URL"
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                />
                <input type="file" accept="image/*" onChange={handleGalleryFileSelect} />
              </div>

              <div className="gallery-form-actions">
                <button type="submit" className="submit-btn" disabled={galleryUploading}>
                  {galleryUploading ? "Saving..." : galleryEditingId ? "Update Image" : "Add Image"}
                </button>
                {galleryEditingId && (
                  <button type="button" className="member-action-btn" onClick={resetGalleryForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {galleryImages.length === 0 ? (
              <p className="muted">No gallery images yet.</p>
            ) : (
              <div className="event-admin-grid">
                {galleryImages.map((image) => (
                  <div className="event-admin-card" key={image._id}>
                    <img className="gallery-admin-preview" src={image.imageUrl} alt={image.title || "Gallery item"} />
                    <h4>{image.title || "Untitled"}</h4>
                    <p>Category: {image.category}</p>
                    <div className="event-admin-actions">
                      <button onClick={() => handleEditGalleryImage(image)}>Edit</button>
                      <button className="danger" onClick={() => handleDeleteGalleryImage(image._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "careers" && (
          <div className="admin-panel">
            <h3>Career Applications</h3>

            <div className="career-filter-grid">
              <input
                className="search-input"
                type="text"
                placeholder="Search by name / email / phone / department"
                value={careerFilters.search}
                onChange={(e) =>
                  setCareerFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />

              <select
                value={careerFilters.domain}
                onChange={(e) =>
                  setCareerFilters((prev) => ({ ...prev, domain: e.target.value }))
                }
              >
                <option value="">All Domains</option>
                <option value="PUBLIC RELATIONS">PUBLIC RELATIONS</option>
                <option value="EDITORIAL">EDITORIAL</option>
                <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                <option value="VIDEOGRAPHY">VIDEOGRAPHY</option>
                <option value="EDITING - Video">EDITING - Video</option>
                <option value="STUDENT RELATIONS">STUDENT RELATIONS</option>
                <option value="CONTENT CREATOR">CONTENT CREATOR</option>
                <option value="CONTENT WRITER">CONTENT WRITER</option>
              </select>

              <select
                value={careerFilters.status}
                onChange={(e) =>
                  setCareerFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
              </select>
            </div>

            {careerLoading ? (
              <p className="muted">Loading career applications...</p>
            ) : careerApplications.length === 0 ? (
              <p className="muted">No career applications found.</p>
            ) : (
              <div className="career-application-grid">
                {careerApplications.map((application) => (
                  <div key={application._id} className="career-application-card">
                    <div className="career-card-top">
                      <h4>{application.name}</h4>
                      <span className={`status ${application.status}`}>{application.status}</span>
                    </div>

                    <p><strong>Domain:</strong> {application.domain}</p>
                    <p><strong>Email:</strong> {application.email}</p>
                    <p><strong>Phone:</strong> {application.phone}</p>
                    <p><strong>Department:</strong> {application.department || "-"}</p>
                    <p><strong>Year:</strong> {application.year || "-"}</p>
                    <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleString()}</p>

                    {application.experience && (
                      <p><strong>Experience:</strong> {application.experience}</p>
                    )}

                    {application.portfolioLink && (
                      <p>
                        <strong>Portfolio:</strong>{" "}
                        <a href={application.portfolioLink} target="_blank" rel="noreferrer">
                          Open Link
                        </a>
                      </p>
                    )}

                    <div className="career-card-actions">
                      <button
                        onClick={() => handleUpdateCareerStatus(application._id, "shortlisted")}
                      >
                        {application.status === "shortlisted" ? "Shortlisted" : "Shortlist"}
                      </button>
                      <button
                        onClick={() => handleUpdateCareerStatus(application._id, "rejected")}
                        className="danger"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateCareerStatus(application._id, "new")}
                      >
                        Mark New
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeSection === "members" || activeSection === "overview") && (
          <div className="admin-panel">
            <div className="members-head">
              <h3>Members List</h3>
              <button className="download-btn" onClick={handleDownloadExcel}>
                Download Members Excel
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name / reg no / department"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Membership ID</th>
                    <th>Name</th>
                    <th>Register No</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Valid Till</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="9" align="center">No members found</td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m._id}>
                        <td>{m.membershipId}</td>
                        <td>{m.name}</td>
                        <td>{m.rollNo}</td>
                        <td>{m.department}</td>
                        <td>{m.year}</td>
                        <td>{m.email}</td>
                        <td><span className={`status ${m.status}`}>{m.status}</span></td>
                        <td>{m.validTill ? new Date(m.validTill).toLocaleDateString() : "-"}</td>
                        <td>
                          <button className="member-action-btn" onClick={() => handleViewMemberAttendance(m._id)}>
                            {selectedMemberId === m._id ? "Hide Attendance" : "View Attendance"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedMemberId && (
              <div className="member-attendance-panel">
                {memberAttendanceLoading[selectedMemberId] ? (
                  <p className="muted">Loading member attendance...</p>
                ) : memberAttendance[selectedMemberId] ? (
                  <>
                    <h4>
                      Attendance History: {memberAttendance[selectedMemberId].member.name}
                      {memberAttendance[selectedMemberId].member.rollNo
                        ? ` (${memberAttendance[selectedMemberId].member.rollNo})`
                        : ""}
                    </h4>
                    <p className="attendance-counts">
                      Total events attended: <strong>{memberAttendance[selectedMemberId].totalAttended}</strong>
                    </p>

                    {memberAttendance[selectedMemberId].eventsAttended.length === 0 ? (
                      <p className="muted">This member has not attended any events yet.</p>
                    ) : (
                      <ul className="attendance-list member-attendance-list">
                        {memberAttendance[selectedMemberId].eventsAttended.map((event) => (
                          <li key={`member-attended-${selectedMemberId}-${event.eventId}`}>
                            <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString()} at {event.time}
                            {event.location ? ` | ${event.location}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <p className="muted">No attendance data available.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
