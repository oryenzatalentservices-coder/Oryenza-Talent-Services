import React, { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Inbox,
  LogOut,
  ChevronRight,
  Database,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import { exportToExcel, exportToPDF, exportToCSV } from "../utils/exportUtils";
import "../styles/admin.css";

export default function AdminDashboard({ onExit }) {
  // Theme state synced with localStorage and documentElement
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oryenza_theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("oryenza-dark");
    }
    return true;
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("oryenza-dark");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("oryenza_theme", "dark");
      } else {
        document.documentElement.classList.remove("oryenza-dark");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("oryenza_theme", "light");
      }
      return next;
    });
  };

  const [adminKey, setAdminKey] = useState(() => {
    return (
      sessionStorage.getItem("oryenza_admin_key") ||
      localStorage.getItem("oryenza_admin_key") ||
      ""
    );
  });
  const [inputKey, setInputKey] = useState("");
  const [rememberKey, setRememberKey] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Data states
  const [activeTab, setActiveTab] = useState("inquiries"); // 'inquiries' | 'candidates' | 'system'
  const [inquiries, setInquiries] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null); // 'inquiry' | 'candidate'
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Export dropdown menu state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = React.useRef(null);

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-verify if adminKey was already in storage
  useEffect(() => {
    if (adminKey) {
      verifyAndLoad(adminKey);
    }
  }, []);

  const verifyAndLoad = async (keyToVerify) => {
    const trimmed = (keyToVerify || "").trim();
    if (!trimmed) {
      setAuthError("Please enter your Admin Secret Key.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    // Fast-path instant unlock for the primary admin key
    if (trimmed === "OryenzaTalentServices@132026") {
      setIsAuthenticated(true);
      setAdminKey(trimmed);
      if (rememberKey) {
        localStorage.setItem("oryenza_admin_key", trimmed);
      } else {
        sessionStorage.setItem("oryenza_admin_key", trimmed);
      }
      setAuthLoading(false);
      loadAllData(trimmed);
      return;
    }

    // Dynamic verification against backend for custom keys
    try {
      const result = await api.verifyAdminKey(trimmed);
      if (result && result.success) {
        setIsAuthenticated(true);
        setAdminKey(trimmed);
        if (rememberKey) {
          localStorage.setItem("oryenza_admin_key", trimmed);
        } else {
          sessionStorage.setItem("oryenza_admin_key", trimmed);
        }
        loadAllData(trimmed);
      } else {
        throw new Error("Invalid Admin Key. Please check your credentials.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError(
        err.message || "Invalid Admin Key. Please check your credentials."
      );
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setAuthError("Please enter your Admin Secret Key.");
      return;
    }
    verifyAndLoad(inputKey.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("oryenza_admin_key");
    localStorage.removeItem("oryenza_admin_key");
    setAdminKey("");
    setInputKey("");
    setIsAuthenticated(false);
  };

  const loadAllData = async (key = adminKey) => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [inqRes, candRes, statRes] = await Promise.all([
        api.getInquiries("all", key).catch(() => ({ data: [] })),
        api.getCandidates("all", key).catch(() => ({ data: [] })),
        api.getStats().catch(() => ({ data: null })),
      ]);

      setInquiries(inqRes.data || []);
      setCandidates(candRes.data || []);
      setStats(statRes.data || null);
    } catch (err) {
      console.error("Data load error:", err);
      setDataError("Failed to fetch records: " + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // Status updates
  const handleInquiryStatusChange = async (id, newStatus) => {
    try {
      await api.updateInquiry(id, { status: newStatus }, adminKey);
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleCandidateStatusChange = async (id, newStatus) => {
    try {
      await api.updateCandidate(id, { status: newStatus }, adminKey);
      setCandidates((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Delete records
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hiring inquiry?"))
      return;
    try {
      await api.deleteInquiry(id, adminKey);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    } catch (err) {
      alert("Failed to delete inquiry: " + err.message);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to remove this candidate profile?"))
      return;
    try {
      await api.deleteCandidate(id, adminKey);
      setCandidates((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    } catch (err) {
      alert("Failed to delete candidate: " + err.message);
    }
  };

  // Save admin notes in detail modal
  const handleSaveNotes = async () => {
    if (!selectedItem) return;
    setSavingNotes(true);
    try {
      if (itemType === "inquiry") {
        await api.updateInquiry(
          selectedItem.id,
          { admin_notes: adminNotes },
          adminKey
        );
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, admin_notes: adminNotes }
              : item
          )
        );
      } else {
        await api.updateCandidate(
          selectedItem.id,
          { admin_notes: adminNotes },
          adminKey
        );
        setCandidates((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, admin_notes: adminNotes }
              : item
          )
        );
      }
      setSelectedItem((prev) => ({ ...prev, admin_notes: adminNotes }));
      alert("Notes saved successfully.");
    } catch (err) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  // Data Export Handler (Excel, PDF, CSV)
  const handleExport = (format) => {
    const dataToExport =
      activeTab === "inquiries" ? filteredInquiries : filteredCandidates;

    if (!dataToExport || dataToExport.length === 0) {
      alert("No records to export.");
      return;
    }

    if (format === "excel") {
      exportToExcel(activeTab, dataToExport);
    } else if (format === "pdf") {
      exportToPDF(activeTab, dataToExport);
    } else if (format === "csv") {
      exportToCSV(activeTab, dataToExport);
    }
  };

  // Filtered queries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        item.name?.toLowerCase().includes(term) ||
        item.company?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term) ||
        item.requirement?.toLowerCase().includes(term) ||
        item.message?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, searchTerm]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        item.name?.toLowerCase().includes(term) ||
        item.current_role?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term) ||
        item.skills?.toLowerCase().includes(term) ||
        item.preferred_location?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [candidates, statusFilter, searchTerm]);

  // Gatekeeper Screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-portal-wrapper">
        <div className="admin-auth-screen">
          <div className="admin-auth-card">
            {/* Theme Switcher Button on Auth Screen */}
            <div className="admin-auth-theme-floating">
              <button
                type="button"
                className="admin-theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Activate light mode" : "Activate dark mode"}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                <span>{isDark ? "Light" : "Dark"}</span>
              </button>
            </div>

            <div className="admin-auth-logo-wrap">
              <div className="admin-brand-pill large">
                <img
                  src="/assets/oryenza_logo_clean.png"
                  alt="Oryenza Talent Services logo"
                  className="brand-logo"
                  width="90"
                  height="68"
                />
              </div>
            </div>
            <div className="admin-auth-shield-badge">
              <Shield size={14} />
              <span>Restricted Area</span>
            </div>
            <h1 className="admin-auth-title">Admin Management</h1>
            <p className="admin-auth-subtitle">
              Enter your backend Admin Secret Key to view client hiring
              mandates and candidate CV applications.
            </p>

            <form onSubmit={handleLoginSubmit} className="admin-auth-form">
              <div className="admin-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide key" : "Show key"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="admin-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                />
                <span>Remember key on this browser</span>
              </label>

              {authError && (
                <div className="admin-auth-error">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="admin-auth-btn"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Unlock Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              className="admin-back-btn"
              onClick={onExit}
            >
              ← Return to Oryenza Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="admin-portal-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-inner">
          <div className="admin-brand-lockup">
            <div className="admin-brand-pill">
              <img
                src="/assets/oryenza_logo_clean.png"
                alt="Oryenza Talent Services logo"
                className="brand-logo"
                width="76"
                height="58"
              />
            </div>
            <span className="admin-brand-tag">Admin Management</span>
          </div>

          <div className="admin-nav-actions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              className="admin-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Activate light mode" : "Activate dark mode"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>

            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => loadAllData()}
              title="Refresh records"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="admin-btn-outline"
              onClick={onExit}
              title="Return to public site"
            >
              <ExternalLink size={15} />
              <span>Exit to Website</span>
            </button>
            <button
              type="button"
              className="admin-btn-outline"
              onClick={handleLogout}
              title="Log out and clear stored key"
            >
              <LogOut size={15} />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-container">
        {/* KPI Summary Cards */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card">
            <div className="admin-metric-info">
              <span>Client Inquiries</span>
              <strong>{inquiries.length}</strong>
            </div>
            <div className="admin-metric-icon">
              <Inbox size={22} />
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-info">
              <span>Candidate Talent Pool</span>
              <strong>{candidates.length}</strong>
            </div>
            <div className="admin-metric-icon">
              <Users size={22} />
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-info">
              <span>Resumes Uploaded</span>
              <strong>
                {candidates.filter((c) => c.resume_path).length}
              </strong>
            </div>
            <div className="admin-metric-icon">
              <FileText size={22} />
            </div>
          </div>

          <div className="admin-metric-card">
            <div className="admin-metric-info">
              <span>Backend Status</span>
              <strong style={{ fontSize: "1.2rem", color: "#16a34a" }}>
                Connected
              </strong>
            </div>
            <div className="admin-metric-icon">
              <Database size={22} />
            </div>
          </div>
        </div>

        {/* Tab Selection & Search / Export Bar */}
        <div className="admin-tab-header">
          <div className="admin-tabs-list">
            <button
              type="button"
              className={`admin-tab-btn ${
                activeTab === "inquiries" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("inquiries");
                setStatusFilter("all");
              }}
            >
              <Briefcase size={16} />
              <span>Client Inquiries</span>
              <span className="admin-badge-count">{inquiries.length}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${
                activeTab === "candidates" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("candidates");
                setStatusFilter("all");
              }}
            >
              <Users size={16} />
              <span>Candidate Pool</span>
              <span className="admin-badge-count">{candidates.length}</span>
            </button>
          </div>

          <div className="admin-controls-row">
            {/* Live Search */}
            <div className="admin-search-input-wrap">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder={
                  activeTab === "inquiries"
                    ? "Search inquiries..."
                    : "Search candidates, skills..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {activeTab === "inquiries" ? (
                <>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </>
              ) : (
                <>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                  <option value="placed">Placed</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>

            {/* Export Dropdown (Excel, PDF, CSV) */}
            <div className="admin-export-dropdown-wrap" ref={exportMenuRef}>
              <button
                type="button"
                className={`admin-btn-outline admin-export-trigger ${
                  showExportMenu ? "active" : ""
                }`}
                onClick={() => setShowExportMenu((prev) => !prev)}
                title="Export data to Excel, PDF, or CSV"
                aria-haspopup="true"
                aria-expanded={showExportMenu}
              >
                <Download size={14} />
                <span>Export</span>
                <ChevronDown
                  size={13}
                  className={`admin-export-chevron ${
                    showExportMenu ? "rotate" : ""
                  }`}
                />
              </button>

              {showExportMenu && (
                <div className="admin-export-menu" role="menu">
                  <div className="admin-export-menu-header">
                    <span>
                      Export {activeTab === "inquiries" ? "Inquiries" : "Candidates"} (
                      {activeTab === "inquiries"
                        ? filteredInquiries.length
                        : filteredCandidates.length}
                      )
                    </span>
                  </div>

                  <button
                    type="button"
                    className="admin-export-item"
                    onClick={() => {
                      handleExport("excel");
                      setShowExportMenu(false);
                    }}
                    role="menuitem"
                  >
                    <div className="admin-export-item-icon excel">
                      <FileSpreadsheet size={16} />
                    </div>
                    <div className="admin-export-item-content">
                      <div className="admin-export-item-title">
                        Excel Spreadsheet (.xlsx)
                      </div>
                      <div className="admin-export-item-desc">
                        Full formatted workbook
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="admin-export-item"
                    onClick={() => {
                      handleExport("pdf");
                      setShowExportMenu(false);
                    }}
                    role="menuitem"
                  >
                    <div className="admin-export-item-icon pdf">
                      <FileText size={16} />
                    </div>
                    <div className="admin-export-item-content">
                      <div className="admin-export-item-title">
                        PDF Document (.pdf)
                      </div>
                      <div className="admin-export-item-desc">
                        Printable branded report
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="admin-export-item"
                    onClick={() => {
                      handleExport("csv");
                      setShowExportMenu(false);
                    }}
                    role="menuitem"
                  >
                    <div className="admin-export-item-icon csv">
                      <Download size={16} />
                    </div>
                    <div className="admin-export-item-content">
                      <div className="admin-export-item-title">CSV File (.csv)</div>
                      <div className="admin-export-item-desc">
                        Standard raw delimited data
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Tables */}
        {activeTab === "inquiries" ? (
          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client / Contact</th>
                    <th>Requirement</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="admin-empty-state">
                          <Inbox size={42} className="admin-empty-icon" />
                          <p>No hiring inquiries found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td style={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
                          {new Date(inq.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                            {inq.name}
                          </div>
                          {inq.company && (
                            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                              🏢 {inq.company}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: "0.8rem",
                              display: "flex",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            <a
                              href={`mailto:${inq.email}`}
                              style={{ color: "var(--blue)" }}
                              title="Email client"
                            >
                              ✉ {inq.email}
                            </a>
                            {inq.phone && (
                              <a
                                href={`tel:${inq.phone}`}
                                style={{ color: "var(--muted)" }}
                                title="Call client"
                              >
                                📞 {inq.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              background: "rgba(21, 101, 216, 0.08)",
                              color: "var(--blue)",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            {inq.requirement}
                          </span>
                        </td>
                        <td style={{ maxWidth: "260px" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.84rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={inq.message}
                          >
                            {inq.message}
                          </p>
                        </td>
                        <td>
                          <select
                            className={`admin-status-select status-${inq.status}`}
                            value={inq.status}
                            onChange={(e) =>
                              handleInquiryStatusChange(inq.id, e.target.value)
                            }
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="admin-icon-btn"
                              onClick={() => {
                                setSelectedItem(inq);
                                setItemType("inquiry");
                                setAdminNotes(inq.admin_notes || "");
                              }}
                              title="View details & notes"
                            >
                              <FileText size={15} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn danger"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              title="Delete inquiry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-table-card">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Candidate</th>
                    <th>Role & Experience</th>
                    <th>Contact</th>
                    <th>Resume / CV</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="admin-empty-state">
                          <Users size={42} className="admin-empty-icon" />
                          <p>No candidate applications found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <tr key={cand.id}>
                        <td style={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
                          {new Date(cand.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                            {cand.name}
                          </div>
                          {cand.preferred_location && (
                            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                              📍 {cand.preferred_location}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{cand.current_role}</div>
                          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                            {cand.experience_years} yrs experience
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.82rem" }}>
                            <a
                              href={`mailto:${cand.email}`}
                              style={{ color: "var(--blue)" }}
                            >
                              ✉ {cand.email}
                            </a>
                            <br />
                            <a
                              href={`tel:${cand.phone}`}
                              style={{ color: "var(--muted)" }}
                            >
                              📞 {cand.phone}
                            </a>
                          </div>
                        </td>
                        <td>
                          {cand.resume_path ? (
                            <a
                              href={api.getResumeDownloadUrl(
                                cand.resume_path,
                                adminKey
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-resume-btn"
                              title="Download candidate resume"
                            >
                              <Download size={13} />
                              <span>Resume (.pdf)</span>
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                              No file
                            </span>
                          )}
                        </td>
                        <td>
                          <select
                            className={`admin-status-select status-${cand.status}`}
                            value={cand.status}
                            onChange={(e) =>
                              handleCandidateStatusChange(cand.id, e.target.value)
                            }
                          >
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="offered">Offered</option>
                            <option value="placed">Placed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="admin-icon-btn"
                              onClick={() => {
                                setSelectedItem(cand);
                                setItemType("candidate");
                                setAdminNotes(cand.admin_notes || "");
                              }}
                              title="View full profile"
                            >
                              <FileText size={15} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn danger"
                              onClick={() => handleDeleteCandidate(cand.id)}
                              title="Remove candidate"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Detail & Notes Modal */}
      {selectedItem && (
        <div
          className="admin-detail-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="admin-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-detail-header">
              <div>
                <h3 className="admin-detail-title">
                  {itemType === "inquiry"
                    ? "Client Inquiry Details"
                    : "Candidate Profile & CV"}
                </h3>
                <span className="admin-detail-meta">
                  ID #{selectedItem.id} · Submitted{" "}
                  {new Date(selectedItem.created_at).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setSelectedItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {itemType === "inquiry" ? (
                <>
                  <div className="admin-detail-row">
                    <strong>Client Name:</strong> {selectedItem.name}
                  </div>
                  {selectedItem.company && (
                    <div className="admin-detail-row">
                      <strong>Company:</strong> {selectedItem.company}
                    </div>
                  )}
                  <div className="admin-detail-row">
                    <strong>Requirement:</strong> {selectedItem.requirement}
                  </div>
                  <div className="admin-detail-row">
                    <strong>Contact:</strong>{" "}
                    <a href={`mailto:${selectedItem.email}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.email}
                    </a>{" "}
                    ·{" "}
                    <a href={`tel:${selectedItem.phone}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.phone}
                    </a>
                  </div>
                  <div className="admin-detail-box">
                    <strong>Message / Mandate Brief:</strong>
                    <p>{selectedItem.message}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-detail-row">
                    <strong>Full Name:</strong> {selectedItem.name}
                  </div>
                  <div className="admin-detail-row">
                    <strong>Current / Target Role:</strong>{" "}
                    {selectedItem.current_role} ({selectedItem.experience_years} years)
                  </div>
                  <div className="admin-detail-row">
                    <strong>Preferred Location:</strong>{" "}
                    {selectedItem.preferred_location}
                  </div>
                  <div className="admin-detail-row">
                    <strong>Contact:</strong>{" "}
                    <a href={`mailto:${selectedItem.email}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.email}
                    </a>{" "}
                    ·{" "}
                    <a href={`tel:${selectedItem.phone}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.phone}
                    </a>
                  </div>
                  {selectedItem.portfolio_url && (
                    <div className="admin-detail-row">
                      <strong>Portfolio / LinkedIn:</strong>{" "}
                      <a
                        href={selectedItem.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--blue)" }}
                      >
                        {selectedItem.portfolio_url} ↗
                      </a>
                    </div>
                  )}
                  <div className="admin-detail-box">
                    <strong>Key Skills & Tech Stack:</strong>
                    <p>{selectedItem.skills}</p>
                  </div>
                  {selectedItem.resume_path && (
                    <div>
                      <a
                        href={api.getResumeDownloadUrl(
                          selectedItem.resume_path,
                          adminKey
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-resume-btn"
                        style={{ padding: "8px 16px" }}
                      >
                        <Download size={15} />
                        <span>Download Resume File ({selectedItem.resume_original_name || "CV.pdf"})</span>
                      </a>
                    </div>
                  )}
                </>
              )}

              {/* Internal Admin Notes */}
              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  Internal Admin Notes (Private):
                </label>
                <textarea
                  className="admin-notes-textarea"
                  placeholder="Add private recruiter notes, interview scheduling notes, or candidate feedback here..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-auth-btn"
                  style={{ width: "auto", marginTop: "10px", padding: "8px 18px", fontSize: "0.85rem" }}
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? "Saving Notes..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
