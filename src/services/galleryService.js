import { apiRequest, patchJson, postJson } from "./api";

export const getGalleryImages = () => apiRequest("/api/gallery");

export const createGalleryImage = (payload) => postJson("/api/gallery", payload);

export const updateGalleryImage = (id, payload) =>
  patchJson(`/api/gallery/${id}`, payload);

export const deleteGalleryImage = (id) =>
  apiRequest(`/api/gallery/${id}`, { method: "DELETE" });

export const uploadGalleryImage = async (file) => {
  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/gallery/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(payload.message || "Failed to upload gallery image");
  }

  return payload;
};
