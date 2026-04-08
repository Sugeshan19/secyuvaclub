import { apiRequest, patchJson, postJson } from "./api";

export const getOpenHiringOpportunities = () =>
  apiRequest("/api/hiring-opportunities");

export const getAllHiringOpportunities = () =>
  apiRequest("/api/hiring-opportunities/admin");

export const createHiringOpportunity = (payload) =>
  postJson("/api/hiring-opportunities", payload);

export const updateHiringOpportunity = (id, payload) =>
  patchJson(`/api/hiring-opportunities/${id}`, payload);

export const deleteHiringOpportunity = (id) =>
  apiRequest(`/api/hiring-opportunities/${id}`, { method: "DELETE" });