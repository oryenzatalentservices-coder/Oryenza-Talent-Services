// API Service for Oryenza Talent Services Client
const API_BASE = "/api";

export const api = {
  // Inquiries
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

  async getInquiries(status = "all") {
    const res = await fetch(
      `${API_BASE}/inquiries?status=${encodeURIComponent(status)}`,
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch inquiries");
    return result;
  },

  async updateInquiry(id, updates) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update inquiry");
    return result;
  },

  async deleteInquiry(id) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete inquiry");
    return result;
  },

  // Candidates
  async submitCandidate(formData) {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: "POST",
      body: formData, // multipart/form-data for resume file
    });
    const result = await res.json();
    if (!res.ok)
      throw new Error(result.error || "Failed to submit candidate application");
    return result;
  },

  async getCandidates(status = "all") {
    const res = await fetch(
      `${API_BASE}/candidates?status=${encodeURIComponent(status)}`,
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to fetch candidates");
    return result;
  },

  async updateCandidate(id, updates) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update candidate");
    return result;
  },

  async deleteCandidate(id) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to delete candidate");
    return result;
  },

  // Stats & Health
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
