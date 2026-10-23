// API Service for Oryenza Talent Services Client
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function getAdminHeaders(customKey) {
  const key =
    customKey ||
    (typeof window !== "undefined"
      ? window.sessionStorage?.getItem("oryenza_admin_key") ||
        window.localStorage?.getItem("oryenza_admin_key")
      : null);

  const headers = {};
  if (key) {
    headers["x-admin-key"] = key;
  }
  return headers;
}

export const api = {
  // Client Inquiries (Public Submission)
  async submitInquiry(data) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to submit inquiry");
    return result;
  },

  // Protected Admin Inquiry Endpoints
  async getInquiries(status = "all", adminKey = null) {
    const res = await fetch(
      `${API_BASE}/inquiries?status=${encodeURIComponent(status)}`,
      {
        headers: getAdminHeaders(adminKey),
      }
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch inquiries");
    return result;
  },

  async updateInquiry(id, updates, adminKey = null) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders(adminKey),
      },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update inquiry");
    return result;
  },

  async deleteInquiry(id, adminKey = null) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(adminKey),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete inquiry");
    return result;
  },

  // Candidate Applications (Public Submission with Resume file)
  async submitCandidate(formData) {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: "POST",
      body: formData, // multipart/form-data with resume file
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to submit candidate application");
    }
    return result;
  },

  // Protected Admin Candidate Endpoints
  async getCandidates(status = "all", adminKey = null) {
    const res = await fetch(
      `${API_BASE}/candidates?status=${encodeURIComponent(status)}`,
      {
        headers: getAdminHeaders(adminKey),
      }
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch candidates");
    return result;
  },

  async updateCandidate(id, updates, adminKey = null) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders(adminKey),
      },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update candidate");
    return result;
  },

  async deleteCandidate(id, adminKey = null) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "DELETE",
      headers: getAdminHeaders(adminKey),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete candidate");
    return result;
  },

  // Public Stats & System Health
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch stats");
    return result;
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/stats/health`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch health");
    return result;
  },
};
