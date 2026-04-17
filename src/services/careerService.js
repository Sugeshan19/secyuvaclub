import { postJson } from "./api";

export const applyForCareer = (payload) =>
  postJson("/api/careers/apply", payload);
