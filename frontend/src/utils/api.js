const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }
  return response.json();
}

export async function sendChat(payload) {
  return request("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function fetchHistory() {
  return request("/history");
}

export async function fetchSettings() {
  return request("/settings");
}

export async function saveSettings(payload) {
  return request("/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function uploadReport(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload-report", {
    method: "POST",
    body: formData
  });
}

export async function lookupNearby(payload) {
  return request("/nearby-doctors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
