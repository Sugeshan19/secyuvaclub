import { apiRequest, patchJson, postJson } from "./api";

export const getAdminStats = () => apiRequest("/api/admin/stats");

export const getMembers = (search = "") =>
  apiRequest(`/api/admin/members?search=${encodeURIComponent(search)}`);

export const getPendingMembers = () => apiRequest("/api/admin/pending-members");

export const getMemberAttendance = (memberId) =>
  apiRequest(`/api/admin/members/${memberId}/attendance`);

export const approveMember = (membershipId) =>
  patchJson(`/api/admin/approve/${membershipId}`);

export const rejectMember = (membershipId) =>
  patchJson(`/api/admin/reject/${membershipId}`);

export const createEvent = (payload) => postJson("/api/events", payload);

export const getAllHiringOpportunities = () =>
  apiRequest("/api/hiring-opportunities/admin");

export const createHiringOpportunity = (payload) =>
  postJson("/api/hiring-opportunities", payload);

export const updateHiringOpportunity = (id, payload) =>
  patchJson(`/api/hiring-opportunities/${id}`, payload);

export const deleteHiringOpportunity = (id) =>
  apiRequest(`/api/hiring-opportunities/${id}`, { method: "DELETE" });

export const uploadEventPoster = async (file) => {
  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/admin/upload-poster`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = response.headers.get("content-type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Upload error: ${text || "Unknown error"}`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
};

export const startAttendance = (eventId) =>
  postJson(`/api/events/${eventId}/start-attendance`, {});

export const deleteEvent = async (eventId) =>
  apiRequest(`/api/events/${eventId}`, { method: "DELETE" });

export const getEventAttendanceSummary = (eventId) =>
  apiRequest(`/api/events/${eventId}/attendance-summary`);
