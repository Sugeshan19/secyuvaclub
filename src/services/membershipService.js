import { apiRequest, postJson } from "./api";

export const getMyMembership = () => apiRequest("/api/user/membership");

export const applyMembership = (payload) =>
  postJson("/api/membership/apply", payload);

export const generateMembershipCard = () => apiRequest("/api/membership/card");
