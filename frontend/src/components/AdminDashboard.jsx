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
  BarChart3,
  TrendingUp,
  PieChart,
  Award,
  Activity,
  MapPin,
  Layers,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  exportToExcel,
  exportToPDF,
  exportToCSV,
  exportAnalyticsToPDF,
} from "../utils/exportUtils";
import "../styles/admin.css";

// WhatsApp SVG Icon component
function WhatsAppIcon({ size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.885 9.889m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Clean and normalize phone number for WhatsApp wa.me links
function cleanPhoneForWhatsApp(rawPhone) {
  if (!rawPhone) return "";
  let cleaned = String(rawPhone).replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = "91" + cleaned.slice(1);
  } else if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  return cleaned;
}

// Pre-formatted WhatsApp links for clients and candidates
function getClientWhatsAppUrl(inq) {
  if (!inq || !inq.phone) return null;
  const phone = cleanPhoneForWhatsApp(inq.phone);
  if (!phone) return null;
  const firstName = inq.name ? inq.name.trim().split(" ")[0] : "there";
  const reqText = inq.requirement ? ` regarding your "${inq.requirement}" requirement` : " regarding your hiring inquiry";
  const message = `Hi ${firstName}, this is from Oryenza Talent Services regarding your inquiry on our portal${reqText}. When would be a convenient time for a brief discussion?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function getCandidateWhatsAppUrl(cand) {
  if (!cand || !cand.phone) return null;
  const phone = cleanPhoneForWhatsApp(cand.phone);
  if (!phone) return null;
  const firstName = cand.name ? cand.name.trim().split(" ")[0] : "there";
  const roleText = cand.current_role ? ` for the ${cand.current_role} profile` : " for your CV submission";
  const message = `Hi ${firstName}, this is from Oryenza Talent Services regarding your application on our portal${roleText}. We would love to discuss active career opportunities with you. When are you free for a quick call?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function AdminDashboard({ onExit }) {
  // Theme state synced with localStorage and documentElement (defaults to white/light mode)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oryenza_theme_v2");
      if (saved) return saved === "dark";
      // First visit: always default to white (light) mode!
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("oryenza-dark");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("oryenza_theme_v2", "dark");
        localStorage.setItem("oryenza_theme", "dark");
      } else {
        document.documentElement.classList.remove("oryenza-dark");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("oryenza_theme_v2", "light");
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
  const [resumeBlobUrl, setResumeBlobUrl] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState(null);

  // Load candidate resume preview into blob URL when candidate detail modal opens
  useEffect(() => {
    if (!selectedItem || itemType !== "candidate" || !selectedItem.resume_path) {
      if (resumeBlobUrl && resumeBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(resumeBlobUrl);
      }
      setResumeBlobUrl(null);
      setResumeLoading(false);
      setResumeError(null);
      return;
    }

    let active = true;
    setResumeLoading(true);
    setResumeError(null);

    // 1. Instant check: if resume_data_url or resume_data is stored in record, use immediately!
    if (selectedItem.resume_data_url) {
      setResumeBlobUrl(selectedItem.resume_data_url);
      setResumeLoading(false);
      setResumeError(null);
      return;
    }
    if (selectedItem.resume_data) {
      const dataUrl = `data:application/pdf;base64,${selectedItem.resume_data}`;
      setResumeBlobUrl(dataUrl);
      setResumeLoading(false);
      setResumeError(null);
      return;
    }

    const filename = selectedItem.resume_path || selectedItem.resume_original_name || "";
    const isPdf = filename.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setResumeLoading(false);
      setResumeError("In-browser preview is available for PDF files. Click Download to open this file.");
      return;
    }

    const viewUrl = api.getResumeViewUrl(
      selectedItem.resume_path,
      adminKey,
      selectedItem.id
    );

    fetch(viewUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Resume file not found (${res.status})`);
        }
        return res.blob();
      })
      .then((blob) => {
        if (!active) return;
        const objectUrl = URL.createObjectURL(blob);
        setResumeBlobUrl(objectUrl);
        setResumeLoading(false);
        setResumeError(null);
      })
      .catch((err) => {
        if (!active) return;
        setResumeBlobUrl(null);
        setResumeLoading(false);
        setResumeError(
          "The resume file is not available on the server (it may have been submitted prior to persistent storage sync or cleared during server sleep). You can contact the candidate directly to request an updated CV."
        );
      });

    return () => {
      active = false;
      if (resumeBlobUrl && resumeBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(resumeBlobUrl);
      }
    };
  }, [selectedItem?.id, selectedItem?.resume_path, selectedItem?.resume_data_url, itemType]);

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

  // Helper checks to filter out legacy mock/dummy data
  const isMockCandidate = (c) => {
    if (!c) return true;
    const name = (c.name || "").toLowerCase().trim();
    const email = (c.email || "").toLowerCase().trim();
    return (
      name === "harshil desai" ||
      name === "anand verma" ||
      email.includes("harshil@example") ||
      email.includes("anand.verma@gmail")
    );
  };

  const isMockInquiry = (i) => {
    if (!i) return true;
    const name = (i.name || "").toLowerCase().trim();
    const email = (i.email || "").toLowerCase().trim();
    return (
      name === "rajesh sharma" ||
      name === "meera patel" ||
      email.includes("rajesh@techcorp") ||
      email.includes("meera@startupx")
    );
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

      // Read local true entries saved from user submissions
      let localInquiries = [];
      let localCandidates = [];
      try {
        localInquiries = JSON.parse(
          localStorage.getItem("oryenza_true_inquiries") || "[]"
        );
      } catch (_) {}
      try {
        localCandidates = JSON.parse(
          localStorage.getItem("oryenza_true_candidates") || "[]"
        );
      } catch (_) {}

      // Merge & deduplicate true inquiries (preferring backend version if ID matches)
      const remoteInquiries = (inqRes.data || []).filter((i) => !isMockInquiry(i));
      const inqMap = new Map();
      // Add local true entries first
      localInquiries.filter((i) => !isMockInquiry(i)).forEach((item) => {
        const key = item.id ? String(item.id) : (item.email || "") + "_" + (item.created_at || "");
        inqMap.set(key, item);
      });
      // Merge remote entries (overwriting local with synced server data)
      remoteInquiries.forEach((item) => {
        const key = item.id ? String(item.id) : (item.email || "") + "_" + (item.created_at || "");
        inqMap.set(key, item);
      });
      const mergedInquiries = Array.from(inqMap.values()).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );

      // Merge & deduplicate true candidates
      const remoteCandidates = (candRes.data || []).filter((c) => !isMockCandidate(c));
      const candMap = new Map();
      localCandidates.filter((c) => !isMockCandidate(c)).forEach((item) => {
        const key = item.id ? String(item.id) : (item.email || "") + "_" + (item.created_at || "");
        candMap.set(key, item);
      });
      remoteCandidates.forEach((item) => {
        const key = item.id ? String(item.id) : (item.email || "") + "_" + (item.created_at || "");
        candMap.set(key, item);
      });
      const mergedCandidates = Array.from(candMap.values()).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );

      // Hold true entries in state and keep localStorage synced
      setInquiries(mergedInquiries);
      setCandidates(mergedCandidates);
      setStats(statRes.data || null);

      try {
        localStorage.setItem(
          "oryenza_true_inquiries",
          JSON.stringify(mergedInquiries.slice(0, 200))
        );
        localStorage.setItem(
          "oryenza_true_candidates",
          JSON.stringify(mergedCandidates.slice(0, 200))
        );
      } catch (_) {}
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
      await api.updateInquiry(id, { status: newStatus }, adminKey).catch(() => {});
      setInquiries((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        try {
          localStorage.setItem("oryenza_true_inquiries", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleCandidateStatusChange = async (id, newStatus) => {
    try {
      await api.updateCandidate(id, { status: newStatus }, adminKey).catch(() => {});
      setCandidates((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        try {
          localStorage.setItem("oryenza_true_candidates", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
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
      await api.deleteInquiry(id, adminKey).catch(() => {});
      setInquiries((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem("oryenza_true_inquiries", JSON.stringify(filtered));
        } catch (_) {}
        return filtered;
      });
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    } catch (err) {
      alert("Failed to delete inquiry: " + err.message);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to remove this candidate profile?"))
      return;
    try {
      await api.deleteCandidate(id, adminKey).catch(() => {});
      setCandidates((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem("oryenza_true_candidates", JSON.stringify(filtered));
        } catch (_) {}
        return filtered;
      });
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
        ).catch(() => {});
        setInquiries((prev) => {
          const updated = prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, admin_notes: adminNotes }
              : item
          );
          try {
            localStorage.setItem("oryenza_true_inquiries", JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      } else {
        await api.updateCandidate(
          selectedItem.id,
          { admin_notes: adminNotes },
          adminKey
        ).catch(() => {});
        setCandidates((prev) => {
          const updated = prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, admin_notes: adminNotes }
              : item
          );
          try {
            localStorage.setItem("oryenza_true_candidates", JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
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

  // Reactive Analytics Computations
  const analyticsData = useMemo(() => {
    const totalInquiries = inquiries.length;
    const totalCandidates = candidates.length;

    // Candidate statuses count
    const candStatusCounts = {
      applied: 0,
      screening: 0,
      interview: 0,
      offered: 0,
      placed: 0,
      rejected: 0,
    };
    candidates.forEach((c) => {
      const s = (c.status || "applied").toLowerCase();
      if (candStatusCounts[s] !== undefined) {
        candStatusCounts[s]++;
      } else {
        candStatusCounts.applied++;
      }
    });

    const placedCount = candStatusCounts.placed;
    const interviewCount = candStatusCounts.interview + candStatusCounts.offered;
    const screeningCount = candStatusCounts.screening;
    const appliedCount = candStatusCounts.applied;
    const rejectedCount = candStatusCounts.rejected;

    // Resumes verified / uploaded
    const resumesCount = candidates.filter(
      (c) => c.resume_path || c.resume_original_name || c.resume_data
    ).length;
    const resumeIndexRate =
      totalCandidates > 0 ? Math.round((resumesCount / totalCandidates) * 100) : 0;
    const placementRate =
      totalCandidates > 0 ? Math.round((placedCount / totalCandidates) * 100) : 0;

    // Experience calculations
    let totalExpYears = 0;
    const expBrackets = {
      entry: { label: "Entry Level (0-2 yrs)", count: 0 },
      mid: { label: "Mid Level (3-5 yrs)", count: 0 },
      senior: { label: "Senior Specialist (6-9 yrs)", count: 0 },
      exec: { label: "Leadership (10+ yrs)", count: 0 },
    };
    candidates.forEach((c) => {
      const y = parseFloat(c.experience_years) || 0;
      totalExpYears += y;
      if (y <= 2) expBrackets.entry.count++;
      else if (y <= 5) expBrackets.mid.count++;
      else if (y <= 9) expBrackets.senior.count++;
      else expBrackets.exec.count++;
    });
    const avgExperience =
      totalCandidates > 0 ? (totalExpYears / totalCandidates).toFixed(1) : "0.0";

    // Client Inquiries statuses
    const inqStatusCounts = {
      new: 0,
      in_progress: 0,
      contacted: 0,
      closed: 0,
    };
    inquiries.forEach((inq) => {
      const s = (inq.status || "new").toLowerCase();
      if (inqStatusCounts[s] !== undefined) inqStatusCounts[s]++;
      else inqStatusCounts.new++;
    });
    const activeMandates = inqStatusCounts.new + inqStatusCounts.in_progress;
    const closedMandates = inqStatusCounts.closed;
    const mandateCloseRate =
      totalInquiries > 0 ? Math.round((closedMandates / totalInquiries) * 100) : 0;

    // Client Service Breakdown
    const serviceDistribution = {
      "Permanent Staffing": 0,
      "Executive Search": 0,
      "Contract Staffing": 0,
      "Bulk / Turnkey Hiring": 0,
      "General Mandates": 0,
    };
    inquiries.forEach((inq) => {
      const req = (inq.requirement || "").toLowerCase();
      if (req.includes("perm")) serviceDistribution["Permanent Staffing"]++;
      else if (
        req.includes("exec") ||
        req.includes("lead") ||
        req.includes("c-suite")
      )
        serviceDistribution["Executive Search"]++;
      else if (
        req.includes("contract") ||
        req.includes("temp") ||
        req.includes("contingent")
      )
        serviceDistribution["Contract Staffing"]++;
      else if (
        req.includes("bulk") ||
        req.includes("turnkey") ||
        req.includes("rpo")
      )
        serviceDistribution["Bulk / Turnkey Hiring"]++;
      else serviceDistribution["General Mandates"]++;
    });

    // Top Skills Extraction
    const skillFreq = {};
    candidates.forEach((c) => {
      if (!c.skills) return;
      const tokens = c.skills
        .split(/[,;\n/]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      tokens.forEach((raw) => {
        let norm = raw.charAt(0).toUpperCase() + raw.slice(1);
        if (norm.toLowerCase().includes("java") && !norm.toLowerCase().includes("javascript"))
          norm = "Java";
        if (norm.toLowerCase().includes("python")) norm = "Python";
        if (norm.toLowerCase().includes("react")) norm = "React.js";
        if (norm.toLowerCase().includes("node")) norm = "Node.js";
        if (
          norm.toLowerCase().includes("sql") ||
          norm.toLowerCase().includes("postgres") ||
          norm.toLowerCase().includes("mysql")
        )
          norm = "SQL / DB";
        if (
          norm.toLowerCase().includes("devops") ||
          norm.toLowerCase().includes("aws") ||
          norm.toLowerCase().includes("cloud")
        )
          norm = "DevOps / Cloud";
        if (
          norm.toLowerCase().includes("sales") ||
          norm.toLowerCase().includes("b2b") ||
          norm.toLowerCase().includes("business dev")
        )
          norm = "Sales / B2B";
        if (
          norm.toLowerCase().includes("hr") ||
          norm.toLowerCase().includes("recruit") ||
          norm.toLowerCase().includes("talent")
        )
          norm = "HR & Talent";
        if (
          norm.toLowerCase().includes("account") ||
          norm.toLowerCase().includes("finance") ||
          norm.toLowerCase().includes("tax")
        )
          norm = "Accounts / Finance";
        skillFreq[norm] = (skillFreq[norm] || 0) + 1;
      });
    });
    const sortedSkills = Object.entries(skillFreq)
      .map(([name, count]) => ({
        name,
        count,
        pct:
          totalCandidates > 0
            ? Math.round((count / totalCandidates) * 100)
            : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Geographic Footprint
    const geoDistribution = {
      "Surat & South Gujarat": 0,
      "Ahmedabad & Central Gujarat": 0,
      "Mumbai & Metros": 0,
      "Pan-India / Remote": 0,
    };
    candidates.forEach((c) => {
      const loc = (c.preferred_location || "").toLowerCase();
      if (
        loc.includes("surat") ||
        loc.includes("vapi") ||
        loc.includes("navsari") ||
        loc.includes("bharuch") ||
        loc.includes("valsad")
      ) {
        geoDistribution["Surat & South Gujarat"]++;
      } else if (
        loc.includes("ahmedabad") ||
        loc.includes("gandhinagar") ||
        loc.includes("vadodara") ||
        loc.includes("baroda") ||
        loc.includes("rajkot")
      ) {
        geoDistribution["Ahmedabad & Central Gujarat"]++;
      } else if (
        loc.includes("mumbai") ||
        loc.includes("pune") ||
        loc.includes("thane") ||
        loc.includes("navi")
      ) {
        geoDistribution["Mumbai & Metros"]++;
      } else {
        geoDistribution["Pan-India / Remote"]++;
      }
    });

    return {
      totalInquiries,
      totalCandidates,
      candStatusCounts,
      placedCount,
      interviewCount,
      screeningCount,
      appliedCount,
      rejectedCount,
      resumesCount,
      resumeIndexRate,
      placementRate,
      inqStatusCounts,
      activeMandates,
      closedMandates,
      mandateCloseRate,
      avgExperience,
      expBrackets,
      serviceDistribution,
      sortedSkills,
      geoDistribution,
    };
  }, [inquiries, candidates]);

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

            <button
              type="button"
              className={`admin-tab-btn ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("analytics");
              }}
            >
              <BarChart3 size={16} />
              <span>Company Analytics</span>
              <span className="admin-badge-count admin-analytics-pulse">Live</span>
            </button>
          </div>

          {activeTab === "analytics" ? (
            <div className="admin-controls-row">
              <button
                type="button"
                className="admin-btn-primary admin-analytics-pdf-btn"
                onClick={() =>
                  exportAnalyticsToPDF(analyticsData, inquiries, candidates)
                }
                title="Download Executive Company Analytics Report (PDF)"
              >
                <Download size={14} />
                <span>Executive Report (PDF)</span>
              </button>
            </div>
          ) : (
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
          )}
        </div>

        {/* Data Tables */}
        {activeTab === "inquiries" && (
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
                              flexDirection: "column",
                              gap: "4px",
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
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                  marginTop: "2px",
                                }}
                              >
                                <a
                                  href={`tel:${inq.phone}`}
                                  style={{ color: "var(--muted)" }}
                                  title="Call client"
                                >
                                  📞 {inq.phone}
                                </a>
                                {getClientWhatsAppUrl(inq) && (
                                  <a
                                    href={getClientWhatsAppUrl(inq)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-whatsapp-btn"
                                    title={`Chat on WhatsApp with ${inq.name}`}
                                  >
                                    <WhatsAppIcon size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
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
        )}

        {activeTab === "candidates" && (
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
                            {cand.phone && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                  marginTop: "4px",
                                }}
                              >
                                <a
                                  href={`tel:${cand.phone}`}
                                  style={{ color: "var(--muted)" }}
                                >
                                  📞 {cand.phone}
                                </a>
                                {getCandidateWhatsAppUrl(cand) && (
                                  <a
                                    href={getCandidateWhatsAppUrl(cand)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-whatsapp-btn"
                                    title={`Chat on WhatsApp with ${cand.name}`}
                                  >
                                    <WhatsAppIcon size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {cand.resume_path ? (
                            <a
                              href={api.getResumeDownloadUrl(
                                cand.resume_path,
                                adminKey,
                                cand.id
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

        {/* Company & Recruitment Analytics View */}
        {activeTab === "analytics" && (
          <div className="admin-analytics-container">
            {/* Top Strategic KPIs Grid */}
            <div className="admin-analytics-kpi-grid">
              <div className="admin-analytics-kpi-card accent-blue">
                <div className="admin-analytics-kpi-header">
                  <span className="admin-analytics-kpi-label">Placement Conversion Rate</span>
                  <div className="admin-analytics-kpi-icon">
                    <Award size={18} />
                  </div>
                </div>
                <div className="admin-analytics-kpi-value-wrap">
                  <span className="admin-analytics-kpi-value">{analyticsData.placementRate}%</span>
                  <span className="admin-analytics-kpi-badge success">
                    <TrendingUp size={12} />
                    <span>{analyticsData.placedCount} Placed</span>
                  </span>
                </div>
                <p className="admin-analytics-kpi-desc">
                  Based on qualified candidate profiles successfully joined with hiring clients
                </p>
                <div className="admin-analytics-mini-bar">
                  <div
                    className="admin-analytics-mini-fill"
                    style={{
                      width: `${Math.min(analyticsData.placementRate, 100)}%`,
                      background: "#10b981",
                    }}
                  />
                </div>
              </div>

              <div className="admin-analytics-kpi-card accent-navy">
                <div className="admin-analytics-kpi-header">
                  <span className="admin-analytics-kpi-label">Active Client Mandates</span>
                  <div className="admin-analytics-kpi-icon">
                    <Briefcase size={18} />
                  </div>
                </div>
                <div className="admin-analytics-kpi-value-wrap">
                  <span className="admin-analytics-kpi-value">{analyticsData.activeMandates}</span>
                  <span className="admin-analytics-kpi-badge info">
                    <span>{analyticsData.mandateCloseRate}% Closed</span>
                  </span>
                </div>
                <p className="admin-analytics-kpi-desc">
                  {analyticsData.inqStatusCounts.new} new mandates, {analyticsData.inqStatusCounts.in_progress} actively sourcing
                </p>
                <div className="admin-analytics-mini-bar">
                  <div
                    className="admin-analytics-mini-fill"
                    style={{
                      width: `${
                        analyticsData.totalInquiries > 0
                          ? (analyticsData.activeMandates / analyticsData.totalInquiries) * 100
                          : 0
                      }%`,
                      background: "#1565d8",
                    }}
                  />
                </div>
              </div>

              <div className="admin-analytics-kpi-card accent-purple">
                <div className="admin-analytics-kpi-header">
                  <span className="admin-analytics-kpi-label">Candidate Talent Pool</span>
                  <div className="admin-analytics-kpi-icon">
                    <Users size={18} />
                  </div>
                </div>
                <div className="admin-analytics-kpi-value-wrap">
                  <span className="admin-analytics-kpi-value">{analyticsData.totalCandidates}</span>
                  <span className="admin-analytics-kpi-badge purple">
                    <span>{analyticsData.avgExperience} yrs avg</span>
                  </span>
                </div>
                <p className="admin-analytics-kpi-desc">
                  Pre-screened professionals registered across Gujarat & national talent corridors
                </p>
                <div className="admin-analytics-mini-bar">
                  <div
                    className="admin-analytics-mini-fill"
                    style={{ width: "100%", background: "#8b5cf6" }}
                  />
                </div>
              </div>

              <div className="admin-analytics-kpi-card accent-teal">
                <div className="admin-analytics-kpi-header">
                  <span className="admin-analytics-kpi-label">Verified CV Index</span>
                  <div className="admin-analytics-kpi-icon">
                    <FileText size={18} />
                  </div>
                </div>
                <div className="admin-analytics-kpi-value-wrap">
                  <span className="admin-analytics-kpi-value">{analyticsData.resumeIndexRate}%</span>
                  <span className="admin-analytics-kpi-badge teal">
                    <span>{analyticsData.resumesCount} CVs</span>
                  </span>
                </div>
                <p className="admin-analytics-kpi-desc">
                  Candidate profiles with active resumes uploaded and sidecar preview ready
                </p>
                <div className="admin-analytics-mini-bar">
                  <div
                    className="admin-analytics-mini-fill"
                    style={{
                      width: `${Math.min(analyticsData.resumeIndexRate, 100)}%`,
                      background: "#06b6d4",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recruitment Pipeline Conversion Funnel */}
            <div className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div>
                  <h3 className="admin-analytics-card-title">
                    <Activity size={18} />
                    <span>Recruitment Pipeline & Conversion Funnel</span>
                  </h3>
                  <p className="admin-analytics-card-subtitle">
                    Candidate velocity across stages from portal submission to placement
                  </p>
                </div>
                <div className="admin-funnel-disqualified-tag">
                  <AlertCircle size={14} />
                  <span>{analyticsData.rejectedCount} Archived</span>
                </div>
              </div>

              <div className="admin-funnel-pipeline">
                {/* Step 1: Applied */}
                <div className="admin-funnel-stage">
                  <div className="admin-funnel-step-num">1</div>
                  <div className="admin-funnel-info">
                    <span className="admin-funnel-name">Applied / Inflow</span>
                    <strong className="admin-funnel-count">{analyticsData.totalCandidates}</strong>
                    <span className="admin-funnel-pct">100% Total Pool</span>
                  </div>
                  <div className="admin-funnel-bar-wrap">
                    <div className="admin-funnel-bar-fill stage-applied" style={{ width: "100%" }} />
                  </div>
                  <span className="admin-funnel-desc">Candidate submission</span>
                </div>

                <div className="admin-funnel-arrow">
                  <ChevronRight size={18} />
                </div>

                {/* Step 2: Screening */}
                <div className="admin-funnel-stage">
                  <div className="admin-funnel-step-num">2</div>
                  <div className="admin-funnel-info">
                    <span className="admin-funnel-name">Dossier Screening</span>
                    <strong className="admin-funnel-count">
                      {analyticsData.screeningCount +
                        analyticsData.interviewCount +
                        analyticsData.placedCount}
                    </strong>
                    <span className="admin-funnel-pct">
                      {analyticsData.totalCandidates > 0
                        ? Math.round(
                            ((analyticsData.screeningCount +
                              analyticsData.interviewCount +
                              analyticsData.placedCount) /
                              analyticsData.totalCandidates) *
                              100
                          )
                        : 0}
                      % qualified
                    </span>
                  </div>
                  <div className="admin-funnel-bar-wrap">
                    <div
                      className="admin-funnel-bar-fill stage-screening"
                      style={{
                        width: `${
                          analyticsData.totalCandidates > 0
                            ? ((analyticsData.screeningCount +
                                analyticsData.interviewCount +
                                analyticsData.placedCount) /
                                analyticsData.totalCandidates) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="admin-funnel-desc">Recruiter qualification</span>
                </div>

                <div className="admin-funnel-arrow">
                  <ChevronRight size={18} />
                </div>

                {/* Step 3: Interview */}
                <div className="admin-funnel-stage">
                  <div className="admin-funnel-step-num">3</div>
                  <div className="admin-funnel-info">
                    <span className="admin-funnel-name">Client Interviews</span>
                    <strong className="admin-funnel-count">
                      {analyticsData.interviewCount + analyticsData.placedCount}
                    </strong>
                    <span className="admin-funnel-pct">
                      {analyticsData.totalCandidates > 0
                        ? Math.round(
                            ((analyticsData.interviewCount + analyticsData.placedCount) /
                              analyticsData.totalCandidates) *
                              100
                          )
                        : 0}
                      % shortlisted
                    </span>
                  </div>
                  <div className="admin-funnel-bar-wrap">
                    <div
                      className="admin-funnel-bar-fill stage-interview"
                      style={{
                        width: `${
                          analyticsData.totalCandidates > 0
                            ? ((analyticsData.interviewCount + analyticsData.placedCount) /
                                analyticsData.totalCandidates) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="admin-funnel-desc">Client rounds & offers</span>
                </div>

                <div className="admin-funnel-arrow">
                  <ChevronRight size={18} />
                </div>

                {/* Step 4: Placed */}
                <div className="admin-funnel-stage final">
                  <div className="admin-funnel-step-num success">✓</div>
                  <div className="admin-funnel-info">
                    <span className="admin-funnel-name">Placed & Onboarded</span>
                    <strong className="admin-funnel-count">{analyticsData.placedCount}</strong>
                    <span className="admin-funnel-pct success">
                      {analyticsData.placementRate}% Placed
                    </span>
                  </div>
                  <div className="admin-funnel-bar-wrap">
                    <div
                      className="admin-funnel-bar-fill stage-placed"
                      style={{ width: `${Math.min(analyticsData.placementRate, 100)}%` }}
                    />
                  </div>
                  <span className="admin-funnel-desc">Joined client organization</span>
                </div>
              </div>
            </div>

            {/* Split Grid: Services Breakdown & In-Demand Skills */}
            <div className="admin-analytics-split-grid">
              {/* Left: Client Hiring Mandates Breakdown */}
              <div className="admin-analytics-card">
                <div className="admin-analytics-card-header">
                  <div>
                    <h3 className="admin-analytics-card-title">
                      <Layers size={18} />
                      <span>Client Hiring Mandate Portfolio</span>
                    </h3>
                    <p className="admin-analytics-card-subtitle">
                      Distribution of client requests across recruitment service models
                    </p>
                  </div>
                  <span className="admin-count-pill">{analyticsData.totalInquiries} Total</span>
                </div>

                <div className="admin-analytics-bars-list">
                  {Object.entries(analyticsData.serviceDistribution).map(([service, count], idx) => {
                    const pct =
                      analyticsData.totalInquiries > 0
                        ? Math.round((count / analyticsData.totalInquiries) * 100)
                        : 0;
                    const colors = ["#1565d8", "#0284c7", "#10b981", "#8b5cf6", "#f59e0b"];
                    const color = colors[idx % colors.length];

                    return (
                      <div key={service} className="admin-stat-bar-row">
                        <div className="admin-stat-bar-header">
                          <span className="admin-stat-bar-title">{service}</span>
                          <span className="admin-stat-bar-val">
                            <strong>{count}</strong> ({pct}%)
                          </span>
                        </div>
                        <div className="admin-stat-bar-track">
                          <div
                            className="admin-stat-bar-fill"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="admin-analytics-status-pill-grid">
                  <div className="admin-status-pill-item status-new">
                    <span>New Inquiries</span>
                    <strong>{analyticsData.inqStatusCounts.new}</strong>
                  </div>
                  <div className="admin-status-pill-item status-in-progress">
                    <span>In Progress</span>
                    <strong>{analyticsData.inqStatusCounts.in_progress}</strong>
                  </div>
                  <div className="admin-status-pill-item status-contacted">
                    <span>Contacted</span>
                    <strong>{analyticsData.inqStatusCounts.contacted}</strong>
                  </div>
                  <div className="admin-status-pill-item status-closed">
                    <span>Closed Mandates</span>
                    <strong>{analyticsData.inqStatusCounts.closed}</strong>
                  </div>
                </div>
              </div>

              {/* Right: In-Demand Candidate Skills */}
              <div className="admin-analytics-card">
                <div className="admin-analytics-card-header">
                  <div>
                    <h3 className="admin-analytics-card-title">
                      <Sparkles size={18} />
                      <span>In-Demand Skills & Tech Stacks</span>
                    </h3>
                    <p className="admin-analytics-card-subtitle">
                      Most requested and possessed competencies in the candidate pool
                    </p>
                  </div>
                  <span className="admin-count-pill">
                    {analyticsData.sortedSkills.length} Technologies
                  </span>
                </div>

                <div className="admin-analytics-skills-list">
                  {analyticsData.sortedSkills.length === 0 ? (
                    <div className="admin-empty-state small">
                      <Sparkles size={28} className="admin-empty-icon" />
                      <p>
                        Candidate skills will dynamically appear here as applications are received.
                      </p>
                    </div>
                  ) : (
                    analyticsData.sortedSkills.map((skill, idx) => (
                      <div key={skill.name} className="admin-skill-bar-row">
                        <div className="admin-skill-meta">
                          <div className="admin-skill-rank-badge">#{idx + 1}</div>
                          <span className="admin-skill-name">{skill.name}</span>
                          <span className="admin-skill-count">
                            {skill.count} profile{skill.count > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="admin-skill-track">
                          <div
                            className="admin-skill-fill"
                            style={{
                              width: `${Math.max(skill.pct, 12)}%`,
                              background:
                                idx === 0
                                  ? "linear-gradient(90deg, #1565d8, #00b8d9)"
                                  : idx === 1
                                  ? "linear-gradient(90deg, #10b981, #06b6d4)"
                                  : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="admin-analytics-footer-tip">
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>
                    Auto-parsed from candidate CV submissions & profile specializations.
                  </span>
                </div>
              </div>
            </div>

            {/* Split Grid: Experience Spectrum & Geographic Footprint */}
            <div className="admin-analytics-split-grid">
              {/* Experience Spectrum */}
              <div className="admin-analytics-card">
                <div className="admin-analytics-card-header">
                  <div>
                    <h3 className="admin-analytics-card-title">
                      <Clock size={18} />
                      <span>Talent Seniority & Experience Spectrum</span>
                    </h3>
                    <p className="admin-analytics-card-subtitle">
                      Candidate breakdown by years of professional industry experience
                    </p>
                  </div>
                  <span
                    className="admin-badge-count"
                    style={{ background: "rgba(21, 101, 216, 0.12)", color: "#1565d8" }}
                  >
                    Avg: {analyticsData.avgExperience} Yrs
                  </span>
                </div>

                <div className="admin-exp-spectrum-grid">
                  {Object.entries(analyticsData.expBrackets).map(([key, data]) => {
                    const pct =
                      analyticsData.totalCandidates > 0
                        ? Math.round((data.count / analyticsData.totalCandidates) * 100)
                        : 0;
                    return (
                      <div key={key} className="admin-exp-item">
                        <div className="admin-exp-top">
                          <span className="admin-exp-label">{data.label}</span>
                          <strong className="admin-exp-count">{data.count}</strong>
                        </div>
                        <div className="admin-exp-bar-wrap">
                          <div
                            className={`admin-exp-bar-fill exp-${key}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="admin-exp-pct">{pct}% of talent pool</span>
                      </div>
                    );
                  })}
                </div>

                <div className="admin-exp-summary-banner">
                  <Briefcase size={16} />
                  <span>
                    Talent pool has a balanced representation of early-career talent, specialists, and senior leaders.
                  </span>
                </div>
              </div>

              {/* Geographic Footprint */}
              <div className="admin-analytics-card">
                <div className="admin-analytics-card-header">
                  <div>
                    <h3 className="admin-analytics-card-title">
                      <MapPin size={18} />
                      <span>Geographic Talent & Client Footprint</span>
                    </h3>
                    <p className="admin-analytics-card-subtitle">
                      Candidate preferred working locations & regional hiring demand
                    </p>
                  </div>
                  <span className="admin-count-pill">Gujarat & Pan-India</span>
                </div>

                <div className="admin-geo-list">
                  {Object.entries(analyticsData.geoDistribution).map(([region, count], idx) => {
                    const pct =
                      analyticsData.totalCandidates > 0
                        ? Math.round((count / analyticsData.totalCandidates) * 100)
                        : 0;
                    return (
                      <div key={region} className="admin-geo-row">
                        <div className="admin-geo-header">
                          <span className="admin-geo-name">
                            <span className="admin-geo-dot" />
                            {region}
                          </span>
                          <span className="admin-geo-val">
                            <strong>{count}</strong> ({pct}%)
                          </span>
                        </div>
                        <div className="admin-geo-track">
                          <div
                            className="admin-geo-fill"
                            style={{
                              width: `${pct}%`,
                              background:
                                idx === 0
                                  ? "#1565d8"
                                  : idx === 1
                                  ? "#0284c7"
                                  : idx === 2
                                  ? "#0d9488"
                                  : "#64748b",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="admin-geo-footer-highlight">
                  <Building size={15} />
                  <span>
                    Headquartered in <strong>Surat</strong> with active candidate outreach across South Gujarat & Western Metros.
                  </span>
                </div>
              </div>
            </div>

            {/* Actionable Client Accounts & Inquiries Portfolio */}
            <div className="admin-table-card">
              <div className="admin-table-card-top">
                <div>
                  <h3 className="admin-analytics-card-title">
                    <Building size={18} />
                    <span>Client Hiring Accounts & Active Mandates</span>
                  </h3>
                  <p className="admin-analytics-card-subtitle">
                    Quick client engagement overview with 1-click WhatsApp outreach & current fulfillment status
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => {
                    setActiveTab("inquiries");
                    setStatusFilter("all");
                  }}
                >
                  <span>Manage All Inquiries ({inquiries.length})</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client / Company</th>
                      <th>Primary Requirement</th>
                      <th>Contact Details</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <div className="admin-empty-state">
                            <Inbox size={36} className="admin-empty-icon" />
                            <p>No client hiring inquiries received yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                              {inq.name}
                            </div>
                            {inq.company && (
                              <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                                🏢 {inq.company}
                              </div>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                background: "rgba(21, 101, 216, 0.08)",
                                color: "var(--blue)",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontWeight: 600,
                                fontSize: "0.82rem",
                              }}
                            >
                              {inq.requirement || "General Inquiry"}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: "0.82rem" }}>
                              <a href={`mailto:${inq.email}`} style={{ color: "var(--blue)" }}>
                                ✉ {inq.email}
                              </a>
                              {inq.phone && (
                                <div style={{ color: "var(--muted)", marginTop: "2px" }}>
                                  📞 {inq.phone}
                                </div>
                              )}
                            </div>
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
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {getClientWhatsAppUrl(inq) && (
                                <a
                                  href={getClientWhatsAppUrl(inq)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="admin-whatsapp-btn"
                                  title={`Chat on WhatsApp with ${inq.name}`}
                                >
                                  <WhatsAppIcon size={12} />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => {
                                  setSelectedItem(inq);
                                  setItemType("inquiry");
                                  setAdminNotes(inq.admin_notes || "");
                                }}
                                title="View details"
                              >
                                <FileText size={15} />
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
            className={`admin-detail-modal ${
              itemType === "candidate" ? "admin-candidate-split-modal" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-detail-header">
              <div>
                <h3 className="admin-detail-title">
                  {itemType === "inquiry"
                    ? "Client Inquiry Details"
                    : "Candidate Dossier & Resume Review"}
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
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {itemType === "inquiry" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                <div className="admin-detail-row" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <strong>Contact:</strong>{" "}
                  <a href={`mailto:${selectedItem.email}`} style={{ color: "var(--blue)" }}>
                    {selectedItem.email}
                  </a>{" "}
                  ·{" "}
                  <a href={`tel:${selectedItem.phone}`} style={{ color: "var(--blue)" }}>
                    {selectedItem.phone}
                  </a>
                  {getClientWhatsAppUrl(selectedItem) && (
                    <a
                      href={getClientWhatsAppUrl(selectedItem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-whatsapp-btn"
                      style={{ marginLeft: "6px" }}
                      title={`Chat on WhatsApp with ${selectedItem.name}`}
                    >
                      <WhatsAppIcon size={13} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}
                </div>
                <div className="admin-detail-box">
                  <strong>Message / Mandate Brief:</strong>
                  <p>{selectedItem.message}</p>
                </div>

                {/* Internal Admin Notes */}
                <div style={{ marginTop: "10px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Internal Admin Notes (Private):
                  </label>
                  <textarea
                    className="admin-notes-textarea"
                    placeholder="Add private recruiter notes, interview scheduling notes, or client feedback here..."
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
            ) : (
              /* Side-by-Side Split View for Candidates */
              <div className="admin-split-layout">
                {/* Left Column: Candidate Info & Recruiter Controls */}
                <div className="admin-split-left">
                  {/* Status Card with Instant Selector */}
                  <div className="admin-detail-box" style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ margin: 0, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
                        Application Status
                      </strong>
                      <span className={`admin-status-badge status-${selectedItem.status}`}>
                        {selectedItem.status.replace("_", " ")}
                      </span>
                    </div>
                    <select
                      className={`admin-status-select status-${selectedItem.status}`}
                      style={{ width: "100%", padding: "8px 12px", fontSize: "0.88rem" }}
                      value={selectedItem.status}
                      onChange={(e) => handleCandidateStatusChange(selectedItem.id, e.target.value)}
                    >
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offered">Offered</option>
                      <option value="placed">Placed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="admin-detail-row">
                    <strong>Full Name:</strong> {selectedItem.name}
                  </div>
                  <div className="admin-detail-row">
                    <strong>Target Role:</strong> {selectedItem.current_role} ({selectedItem.experience_years} years exp.)
                  </div>
                  <div className="admin-detail-row">
                    <strong>Location:</strong> {selectedItem.preferred_location || "Not specified"}
                  </div>

                  <div className="admin-detail-row" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <strong>Contact:</strong>{" "}
                    <a href={`mailto:${selectedItem.email}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.email}
                    </a>{" "}
                    ·{" "}
                    <a href={`tel:${selectedItem.phone}`} style={{ color: "var(--blue)" }}>
                      {selectedItem.phone}
                    </a>
                    {getCandidateWhatsAppUrl(selectedItem) && (
                      <a
                        href={getCandidateWhatsAppUrl(selectedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-whatsapp-btn"
                        style={{ marginLeft: "4px" }}
                        title={`Chat on WhatsApp with ${selectedItem.name}`}
                      >
                        <WhatsAppIcon size={13} />
                        <span>WhatsApp</span>
                      </a>
                    )}
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
                    <strong>Key Skills & Technologies:</strong>
                    <p style={{ marginTop: "4px" }}>{selectedItem.skills || "None specified"}</p>
                  </div>

                  {/* Internal Recruiter Notes */}
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                      Private Recruiter Evaluation Notes:
                    </label>
                    <textarea
                      className="admin-notes-textarea"
                      placeholder="Enter interview feedback, compensation expectations, technical review, or remarks..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-auth-btn"
                      style={{ width: "auto", marginTop: "8px", padding: "8px 18px", fontSize: "0.85rem" }}
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                    >
                      {savingNotes ? "Saving Notes..." : "Save Notes"}
                    </button>
                  </div>
                </div>

                {/* Right Column: In-Browser Resume / CV Previewer */}
                <div className="admin-split-right">
                  <div className="admin-resume-viewer-header">
                    <div className="admin-resume-viewer-title" title={selectedItem.resume_original_name || "Candidate CV"}>
                      <FileText size={16} />
                      <span>{selectedItem.resume_original_name || "Candidate_CV.pdf"}</span>
                    </div>
                    <div className="admin-resume-viewer-actions">
                      {selectedItem.resume_path && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (resumeBlobUrl) {
                                window.open(resumeBlobUrl, "_blank");
                              } else {
                                window.open(
                                  api.getResumeDownloadUrl(
                                    selectedItem.resume_path,
                                    adminKey,
                                    selectedItem.id
                                  ),
                                  "_blank"
                                );
                              }
                            }}
                            className="admin-resume-viewer-btn"
                            title="Open full PDF in new browser tab"
                          >
                            <ExternalLink size={13} />
                            <span>New Tab</span>
                          </button>
                          <a
                            href={
                              resumeBlobUrl ||
                              api.getResumeDownloadUrl(
                                selectedItem.resume_path,
                                adminKey,
                                selectedItem.id
                              )
                            }
                            download={selectedItem.resume_original_name || "Candidate_Resume.pdf"}
                            className="admin-resume-viewer-btn"
                            title="Download CV file"
                          >
                            <Download size={13} />
                            <span>Download</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="admin-resume-viewer-body">
                    {resumeLoading ? (
                      <div className="admin-resume-loading-state">
                        <div className="admin-resume-spinner" />
                        <p style={{ margin: 0, fontWeight: 600 }}>Loading Candidate Resume Preview...</p>
                        <span style={{ fontSize: "0.78rem", opacity: 0.7, marginTop: "4px" }}>
                          Rendering document for in-browser review
                        </span>
                      </div>
                    ) : resumeBlobUrl ? (
                      <iframe
                        src={resumeBlobUrl}
                        title={`Resume Preview - ${selectedItem.name}`}
                        className="admin-resume-iframe"
                      />
                    ) : resumeError ? (
                      <div className="admin-resume-empty-state">
                        <AlertCircle size={38} style={{ color: "#f59e0b", marginBottom: "12px" }} />
                        <p style={{ margin: "0 0 6px 0", fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}>
                          Resume File Unavailable
                        </p>
                        <p style={{ margin: "0 0 16px 0", fontSize: "0.85rem", maxWidth: "460px", color: "var(--muted)", lineHeight: 1.55 }}>
                          {resumeError}
                        </p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                          {getCandidateWhatsAppUrl(selectedItem) && (
                            <a
                              href={getCandidateWhatsAppUrl(selectedItem)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-whatsapp-btn"
                              style={{ padding: "8px 14px", fontSize: "0.84rem" }}
                            >
                              <WhatsAppIcon size={14} />
                              <span>WhatsApp {selectedItem.name.split(" ")[0]} for CV</span>
                            </a>
                          )}
                          <a
                            href={`mailto:${selectedItem.email}?subject=Oryenza%20Talent%20Services%20-%20Resume%20File%20Request&body=Hi%20${encodeURIComponent(selectedItem.name)},%0A%0AWe%20received%20your%20application%20for%20the%20${encodeURIComponent(selectedItem.current_role || "candidate")}%20position.%20Please%20reply%20with%20your%20latest%20PDF%20Resume/CV%20attached.%0A%0ABest%20regards,%0AOryenza%20Talent%20Services`}
                            className="admin-btn-outline"
                            style={{ padding: "6px 14px", fontSize: "0.84rem" }}
                          >
                            <span>✉ Email Candidate</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-resume-empty-state">
                        <FileText size={36} style={{ opacity: 0.4, marginBottom: "12px" }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>No Resume File Uploaded</p>
                        <span style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "4px" }}>
                          This candidate submitted an application without an attached CV file.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
