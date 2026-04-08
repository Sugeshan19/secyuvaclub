import { apiRequest, postJson } from "./api";

export const getEvents = () => apiRequest("/api/events");

export const registerForEvent = (eventId) =>
  postJson(`/api/events/${eventId}/register`, {});

export const verifyAttendanceOtp = (eventId, otpCode) =>
  postJson(`/api/events/${eventId}/verify-otp`, { otpCode });
