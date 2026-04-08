import { apiRequest, patchJson } from "./api";

export const getMyNotifications = () => apiRequest("/api/notifications");

export const markNotificationRead = (notificationId) =>
  patchJson(`/api/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () =>
  patchJson("/api/notifications/read-all");
