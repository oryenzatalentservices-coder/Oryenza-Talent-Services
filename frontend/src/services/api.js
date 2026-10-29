// API Service for Oryenza Talent Services Client
const rawApiBase =
  import.meta.env.VITE_API_BASE_URL ||
  "https://oryenza-talent-services.onrender.com/api";
const API_BASE = rawApiBase.replace(/\/+$/, "");

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
    headers["Authorization"] = `Bearer ${key}`;
  }
  return headers;
}

/**
 * Safely parse HTTP responses and prevent "Unexpected token '<', <!DOCTYPE..." crashes
 * when the backend is offline, proxy fails, or Vercel rewrites /api to index.html.
 */
async function handleResponse(res, fallbackError = "Request failed") {
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  // Handle HTTP error statuses (4xx, 5xx)
  if (!res.ok) {
    if (data && (data.error || data.message)) {
      throw new Error(data.error || data.message);
    }

    if (!contentType.includes("application/json")) {
      if (res.status === 404) {
        throw new Error(
          "API endpoint not found (404). Please ensure the backend server is running and the route is configured."
        );
      }
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error(
          "Backend server is offline or unreachable (HTTP " + res.status + "). Please ensure the backend is running on port 5000."
        );
      }
      throw new Error(
        `Backend server returned an error (HTTP ${res.status} ${res.statusText || ""}).`
      );
    }

    throw new Error(fallbackError);
  }

  // Handle case where HTTP status is 200 OK, but body is HTML (e.g., Vercel SPA rewrite returning index.html)
  if (!data) {
    const isVercel =
      typeof window !== "undefined" &&
      window.location.hostname.includes("vercel.app");

    if (isVercel) {
      throw new Error(
        "Backend API is not configured on this Vercel deployment. Please deploy your backend service (e.g., on Render or Railway) and set the VITE_API_BASE_URL environment variable in your Vercel Project Settings."
      );
    }

    throw new Error(
      "Backend server returned HTML instead of JSON. Please make sure the backend is running on port 5000 (run 'npm run dev' from the project root)."
    );
  }

  return data;
}

/**
 * Universal safe fetch wrapper that intercepts network connectivity drops
 */
async function request(url, options = {}, fallbackError = "Request failed") {
  let res;
  try {
    res = await fetch(url, options);
  } catch (netErr) {
    console.error("API network error:", netErr);
    const isVercel =
      typeof window !== "undefined" &&
      window.location.hostname.includes("vercel.app");

    if (isVercel) {
      throw new Error(
        "Cannot reach backend server. Please verify your backend service is running and that CORS allows your Vercel domain."
      );
    }

    throw new Error(
      "Cannot connect to the backend server at " +
        url +
        ". Please make sure the backend is running locally on port 5000 (run 'npm run dev' or 'cd backend && npm start')."
    );
  }

  return await handleResponse(res, fallbackError);
}

export const api = {
  // Client Inquiries (Public Submission)
  async submitInquiry(data) {
    return await request(
      `${API_BASE}/inquiries`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      "Failed to submit inquiry"
    );
  },

  // Protected Admin Inquiry Endpoints
  async getInquiries(status = "all", adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `&admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/inquiries?status=${encodeURIComponent(status)}${keyParam}`,
      {
        headers: getAdminHeaders(adminKey),
      },
      "Failed to fetch inquiries"
    );
  },

  async updateInquiry(id, updates, adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `?admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/inquiries/${id}${keyParam}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(adminKey),
        },
        body: JSON.stringify(updates),
      },
      "Failed to update inquiry"
    );
  },

  async deleteInquiry(id, adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `?admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/inquiries/${id}${keyParam}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(adminKey),
      },
      "Failed to delete inquiry"
    );
  },

  // Candidate Applications (Public Submission with Resume file)
  async submitCandidate(formData) {
    return await request(
      `${API_BASE}/candidates`,
      {
        method: "POST",
        body: formData, // multipart/form-data with resume file
      },
      "Failed to submit candidate application"
    );
  },

  // Protected Admin Candidate Endpoints
  async getCandidates(status = "all", adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `&admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/candidates?status=${encodeURIComponent(status)}${keyParam}`,
      {
        headers: getAdminHeaders(adminKey),
      },
      "Failed to fetch candidates"
    );
  },

  async updateCandidate(id, updates, adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `?admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/candidates/${id}${keyParam}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(adminKey),
        },
        body: JSON.stringify(updates),
      },
      "Failed to update candidate"
    );
  },

  async deleteCandidate(id, adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key")
        : "");
    const keyParam = key ? `?admin_key=${encodeURIComponent(key)}` : "";
    return await request(
      `${API_BASE}/candidates/${id}${keyParam}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(adminKey),
      },
      "Failed to delete candidate"
    );
  },

  // Public Stats & System Health
  async getStats() {
    return await request(`${API_BASE}/stats`, {}, "Failed to fetch stats");
  },

  async getHealth() {
    return await request(`${API_BASE}/stats/health`, {}, "Failed to fetch health");
  },

  // Admin Verification & Resume Access
  async verifyAdminKey(adminKey) {
    return await this.getInquiries("all", adminKey);
  },

  getResumeDownloadUrl(filename, adminKey = null) {
    const key =
      adminKey ||
      (typeof window !== "undefined"
        ? window.sessionStorage?.getItem("oryenza_admin_key") ||
          window.localStorage?.getItem("oryenza_admin_key") ||
          ""
        : "");
    return `${API_BASE}/candidates/resume/${encodeURIComponent(filename)}?admin_key=${encodeURIComponent(key)}`;
  },
};

