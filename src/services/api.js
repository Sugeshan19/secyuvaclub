const API_BASE = process.env.REACT_APP_API_URL;

const buildHeaders = (token, extra = {}) => ({
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extra,
});

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(token, options.headers || {}),
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  const message = payload?.message || "Request failed";

  if (
    response.status === 401 ||
    /invalid token|no token|jwt/i.test(String(message))
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(message);
  }

  return payload;
};

export const postJson = (path, body) =>
  apiRequest(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const patchJson = (path, body = {}) =>
  apiRequest(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const putJson = (path, body) =>
  apiRequest(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
