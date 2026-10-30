import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Rocket,
  Target,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "../services/api";
import {
  extractTextFromClientFile,
  analyzeResumeClient,
} from "../utils/resumeAnalyzer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Sample Job Descriptions for quick testing
const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Full Stack Engineer",
    text: "Looking for a Full Stack Developer experienced in React, Node.js, Express, TypeScript, REST APIs, PostgreSQL, Docker, Git, and AWS. Must have experience with Agile/Scrum, CI/CD pipelines, unit testing with Jest, and building scalable microservices.",
  },
  {
    title: "Frontend React Specialist",
    text: "Seeking Senior Frontend Engineer with deep expertise in React.js, Next.js, TypeScript, Tailwind CSS, Redux, responsive web design, performance optimization, and Figma. Strong skills in UI/UX accessibility and cross-browser testing required.",
  },
  {
    title: "Data & Python Analyst",
    text: "We require a Data Analyst skilled in Python, SQL, Pandas, NumPy, Data Visualization with Power BI or Tableau, Excel modeling, and statistical analysis. Experience with Machine Learning and ETL pipelines is a strong plus.",
  },
];

export default function ResumeAtsModal({
  isOpen,
  onClose,
  initialMode = "analyze", // "analyze" or "ats"
  onApplyAsCandidate,
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(initialMode === "ats");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Sync initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setShowJdInput(initialMode === "ats");
      setErrorMsg("");
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isAnalyzing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isAnalyzing, onClose]);

  // Animated analysis progress ticker
  useEffect(() => {
    let timer;
    if (isAnalyzing) {
      setAnalysisStep(1);
      timer = setInterval(() => {
        setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 650);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  if (!isOpen) return null;

  // File handling & drag-drop
  const validateAndSetFile = (file) => {
    setErrorMsg("");
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".doc"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setErrorMsg(
        "Invalid file format. Please upload a verified PDF (.pdf) or Word document (.docx, .doc)."
      );
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File size exceeds 8MB. Please upload a smaller document.");
      return;
    }

    setResumeFile(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Run Resume / ATS Analysis
  const handleAnalyze = async () => {
    if (!resumeFile) {
      setErrorMsg("Please attach your resume file (.pdf, .docx) to proceed.");
      return;
    }

    setErrorMsg("");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      if (jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }
      if (targetRole.trim()) {
        formData.append("target_role", targetRole.trim());
      }

      // Try server-side analysis first
      try {
        const response = await api.analyzeResume(formData);
        if (response && response.success && response.data) {
          setResult(response.data);
          setIsAnalyzing(false);
          return;
        }
      } catch (backendErr) {
        console.warn("Backend analysis failed, utilizing client fallback engine:", backendErr.message);
      }

      // Seamless Client-Side Fallback: extracts text and analyzes locally
      const extractedText = await extractTextFromClientFile(resumeFile);
      const fallbackResult = analyzeResumeClient(
        extractedText,
        jobDescription,
        targetRole,
        resumeFile.name
      );
      setResult(fallbackResult);
    } catch (err) {
      console.error("Resume analysis execution error:", err);
      setErrorMsg(
        "An unexpected error occurred while analyzing the document. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset to analyze another resume
  const handleReset = () => {
    setResumeFile(null);
    setResult(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Copy missing keyword
  const handleCopyKeyword = (keyword) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKey(keyword);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Export ATS Report as PDF
  const handleDownloadPdf = () => {
    if (!result) return;
    setIsExportingPdf(true);

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;

      // Header Banner
      doc.setFillColor(11, 31, 58); // Oryenza Navy
      doc.rect(0, 0, pageWidth, 75, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ORYENZA TALENT SERVICES", margin, 35);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 184, 217); // Cyan
      doc.text("AI Resume & ATS Compatibility Audit Report", margin, 52);

      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc.setTextColor(180, 205, 237);
      doc.text(`Generated: ${dateStr}`, pageWidth - margin - 110, 45);

      // Score Callout Box
      let currentY = 95;
      doc.setFillColor(243, 247, 255);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 70, 6, 6, "F");
      doc.setDrawColor(207, 224, 246);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 70, 6, 6, "D");

      doc.setTextColor(11, 31, 58);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(`${result.overallScore} / 100`, margin + 20, currentY + 45);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 101, 216);
      doc.text(`ATS RATING: ${result.scoreTier.toUpperCase()} (${result.scoreLabel})`, margin + 140, currentY + 30);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(83, 98, 118);
      doc.text(`Keyword Match: ${result.keywordMatchPercentage}% | Words: ${result.metrics?.wordCount || 0} | File: ${result.filename || "Resume"}`, margin + 140, currentY + 48);

      currentY += 88;

      // Executive Summary
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 31, 58);
      doc.text("Executive Summary", margin, currentY);
      currentY += 14;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 72, 88);
      const splitSummary = doc.splitTextToSize(result.summary, pageWidth - margin * 2);
      doc.text(splitSummary, margin, currentY);
      currentY += splitSummary.length * 12 + 10;

      // Section Completeness Table
      const sectionTableRows = (result.sectionCompleteness || []).map((sec) => [
        sec.name,
        sec.status,
        sec.detail,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Resume Section", "Status", "ATS Evaluation Findings"]],
        body: sectionTableRows,
        theme: "striped",
        headStyles: { fillColor: [21, 101, 216], textColor: [255, 255, 255], fontStyle: "bold" },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8.5, cellPadding: 5 },
      });

      currentY = doc.lastAutoTable.finalY + 18;

      // Formatting Checks Table
      const formatRows = (result.formattingChecks || []).map((f) => [
        f.item,
        f.status,
        f.message,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Formatting & Readability Check", "Status", "Recommendation"]],
        body: formatRows,
        theme: "striped",
        headStyles: { fillColor: [16, 35, 60], textColor: [255, 255, 255], fontStyle: "bold" },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8.5, cellPadding: 5 },
      });

      currentY = doc.lastAutoTable.finalY + 18;

      // Actionable Recommendations
      if (currentY + 100 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        currentY = 40;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(11, 31, 58);
      doc.text("Key Actionable Recommendations", margin, currentY);
      currentY += 16;

      (result.recommendations || []).forEach((rec, idx) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(21, 101, 216);
        doc.text(`${idx + 1}. [${rec.category}] ${rec.title || ""}`, margin, currentY);
        currentY += 12;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 80, 95);
        const splitRec = doc.splitTextToSize(rec.text, pageWidth - margin * 2 - 15);
        doc.text(splitRec, margin + 12, currentY);
        currentY += splitRec.length * 11 + 6;
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(130, 145, 165);
        doc.text(
          "Oryenza Talent Services — Confidential Candidate ATS Evaluation | www.oryenza.in",
          margin,
          doc.internal.pageSize.getHeight() - 20
        );
        doc.text(
          `Page ${p} of ${totalPages}`,
          pageWidth - margin - 50,
          doc.internal.pageSize.getHeight() - 20
        );
      }

      const saveName = `Oryenza_ATS_Report_${result.filename ? result.filename.replace(/\.[^/.]+$/, "") : "Resume"}.pdf`;
      doc.save(saveName);
    } catch (pdfErr) {
      console.error("PDF generation error:", pdfErr);
      alert("Failed to generate PDF. Please try again or print the screen.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Switch modes inside modal
  const handleSwitchMode = (mode) => {
    setActiveMode(mode);
    if (mode === "ats") {
      setShowJdInput(true);
    }
    setErrorMsg("");
  };

  const stepLabels = [
    "Uploading document...",
    "Extracting text & formatting structure...",
    "Scanning industry keywords & core skills...",
    "Calculating ATS compatibility score...",
  ];

  return (
    <div
      className="ats-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isAnalyzing) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="atsModalTitle"
    >
      <div className="ats-modal-container" ref={modalRef}>
        {/* Modal Header */}
        <div className="ats-modal-header">
          <div className="ats-modal-title-group">
            <div className="ats-modal-badge">
              <Sparkles size={14} className="sparkle-anim" />
              <span>Oryenza AI Talent Intelligence</span>
            </div>
            <h2 id="atsModalTitle">
              {activeMode === "analyze" ? (
                <>
                  AI CV <span>Health & Analyzer</span>
                </>
              ) : (
                <>
                  ATS Compatibility <span>Score & Match</span>
                </>
              )}
            </h2>
          </div>

          <button
            type="button"
            className="ats-modal-close"
            onClick={onClose}
            disabled={isAnalyzing}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {!result && (
          <div className="ats-tab-switcher">
            <button
              type="button"
              className={`ats-tab-btn ${activeMode === "analyze" ? "active" : ""}`}
              onClick={() => handleSwitchMode("analyze")}
            >
              <Rocket size={17} />
              <span>Analyze My CV</span>
            </button>
            <button
              type="button"
              className={`ats-tab-btn ${activeMode === "ats" ? "active" : ""}`}
              onClick={() => handleSwitchMode("ats")}
            >
              <Target size={17} />
              <span>Check My ATS Score</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="ats-modal-body">
          {errorMsg && (
            <div className="ats-alert-box error">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIEW 1: UPLOAD & SETUP FORM */}
          {!result && (
            <div className="ats-input-section">
              <p className="ats-mode-desc">
                {activeMode === "analyze" ? (
                  <>
                    Upload your resume in <strong>PDF</strong> or <strong>DOCX</strong> format to receive an in-depth CV health check, ATS score out of 100, formatting analysis, and actionable quality improvement suggestions.
                  </>
                ) : (
                  <>
                    Test your resume against real-world recruiter Applicant Tracking Systems (ATS). Upload your resume and paste a target job description to reveal keyword matching %, missing skills, and section completeness.
                  </>
                )}
              </p>

              {/* Upload Drag & Drop Box */}
              <div
                className={`ats-dropzone ${isDragging ? "dragging" : ""} ${resumeFile ? "has-file" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: "none" }}
                  id="atsResumeFileInput"
                />

                {resumeFile ? (
                  <div className="ats-file-preview">
                    <div className="ats-file-icon">
                      <FileText size={32} />
                    </div>
                    <div className="ats-file-details">
                      <span className="ats-file-name">{resumeFile.name}</span>
                      <span className="ats-file-meta">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Audit
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ats-file-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="ats-dropzone-prompt">
                    <div className="ats-upload-icon-circle">
                      <Upload size={26} />
                    </div>
                    <h4>Drop your Resume / CV here or browse</h4>
                    <p>Supports PDF (.pdf) or Word documents (.docx, .doc) up to 8MB</p>
                    <span className="ats-browse-pill">Select Document</span>
                  </div>
                )}
              </div>

              {/* Target Role (Optional) */}
              <div className="ats-field-group">
                <label htmlFor="targetRoleInput">
                  Target Job Title / Domain <span>(Optional)</span>
                </label>
                <input
                  id="targetRoleInput"
                  type="text"
                  placeholder="e.g. Senior Frontend Developer, DevOps Engineer, Financial Analyst"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="ats-input"
                />
              </div>

              {/* Job Description Input (Always shown for ATS Score mode, toggleable for Analyze mode) */}
              <div className="ats-jd-wrapper">
                {activeMode === "analyze" ? (
                  <button
                    type="button"
                    className="ats-toggle-jd-btn"
                    onClick={() => setShowJdInput((prev) => !prev)}
                  >
                    <span>
                      {showJdInput ? "Hide Job Description matching" : "+ Match against a specific Job Description (Recommended)"}
                    </span>
                    {showJdInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                ) : (
                  <div className="ats-jd-header-label">
                    <label htmlFor="atsJdTextarea">
                      Paste Target Job Description <span>(Recommended for precise keyword match)</span>
                    </label>
                  </div>
                )}

                {showJdInput && (
                  <div className="ats-jd-box">
                    <div className="ats-sample-jd-row">
                      <span className="ats-sample-label">Quick sample:</span>
                      {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="ats-sample-pill"
                          onClick={() => {
                            setJobDescription(s.text);
                            if (!targetRole) setTargetRole(s.title);
                          }}
                        >
                          {s.title}
                        </button>
                      ))}
                    </div>

                    <textarea
                      id="atsJdTextarea"
                      rows={4}
                      className="ats-textarea"
                      placeholder="Paste the job description or role requirements here to check keyword matching percentage..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="ats-action-footer">
                <button
                  type="button"
                  className={`btn-ai-submit ${activeMode === "analyze" ? "primary-gradient" : "ats-target-btn"}`}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeFile}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={18} className="spin-icon" />
                      <span>{stepLabels[analysisStep - 1] || "Analyzing Resume..."}</span>
                    </>
                  ) : activeMode === "analyze" ? (
                    <>
                      <Rocket size={18} />
                      <span>Run AI CV Analysis</span>
                    </>
                  ) : (
                    <>
                      <Target size={18} />
                      <span>Generate ATS Compatibility Report</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust & Privacy notice */}
              <div className="ats-trust-banner">
                <ShieldCheck size={16} />
                <span>Private & Secure: Resumes analyzed in-memory. Never shared or sold.</span>
              </div>
            </div>
          )}

          {/* VIEW 2: COMPREHENSIVE ATS & CV AUDIT RESULTS */}
          {result && (
            <div className="ats-results-view">
              {/* Top Score Banner */}
              <div className="ats-score-banner">
                <div className="ats-score-gauge-box">
                  <div className="ats-circle-score" style={{ borderColor: result.scoreColor }}>
                    <div className="ats-circle-inner">
                      <span className="ats-score-num">{result.overallScore}</span>
                      <span className="ats-score-total">/ 100</span>
                    </div>
                  </div>
                  <div className="ats-score-badge" style={{ backgroundColor: `${result.scoreColor}18`, color: result.scoreColor }}>
                    {result.scoreTier} Score
                  </div>
                </div>

                <div className="ats-score-details">
                  <div className="ats-score-eyebrow">
                    <span>ATS Assessment for:</span>
                    <strong>{result.filename || "Uploaded Resume"}</strong>
                  </div>
                  <h3 className="ats-score-headline">{result.scoreLabel}</h3>
                  <p className="ats-summary-text">{result.summary}</p>

                  <div className="ats-quick-badges">
                    <div className="ats-quick-pill">
                      <Target size={14} />
                      <span>Keyword Match: <strong>{result.keywordMatchPercentage}%</strong></span>
                    </div>
                    <div className="ats-quick-pill">
                      <Layers size={14} />
                      <span>Technical Skills: <strong>{result.metrics?.technicalSkillsCount || 0}</strong></span>
                    </div>
                    <div className="ats-quick-pill">
                      <Clock size={14} />
                      <span>Length: <strong>{result.metrics?.wordCount || 0} words ({result.metrics?.estimatedPages || 1} pg)</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 KPI Metrics Grid */}
              <div className="ats-metrics-grid">
                <div className="ats-metric-card">
                  <div className="ats-metric-icon">
                    <FileText size={20} />
                  </div>
                  <div className="ats-metric-val">{result.metrics?.wordCount || 0}</div>
                  <div className="ats-metric-name">Word Count</div>
                  <div className="ats-metric-sub">
                    {result.metrics?.wordCount >= 350 && result.metrics?.wordCount <= 1000
                      ? "Optimal length"
                      : "Needs balance"}
                  </div>
                </div>

                <div className="ats-metric-card">
                  <div className="ats-metric-icon">
                    <BarChart3 size={20} />
                  </div>
                  <div className="ats-metric-val">{result.metrics?.bulletPointsCount || 0}</div>
                  <div className="ats-metric-name">Bullet Points</div>
                  <div className="ats-metric-sub">High scanability</div>
                </div>

                <div className="ats-metric-card">
                  <div className="ats-metric-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div className="ats-metric-val">{result.metrics?.actionVerbsCount || 0}</div>
                  <div className="ats-metric-name">Action Verbs</div>
                  <div className="ats-metric-sub">Impact driven</div>
                </div>

                <div className="ats-metric-card">
                  <div className="ats-metric-icon">
                    <Award size={20} />
                  </div>
                  <div className="ats-metric-val">{result.metrics?.quantifiedMetricsCount || 0}</div>
                  <div className="ats-metric-name">KPI Metrics</div>
                  <div className="ats-metric-sub">Measurable proof</div>
                </div>
              </div>

              {/* Section Completeness (Education, Experience, Skills, Projects, Certifications) */}
              <div className="ats-report-block">
                <div className="ats-block-header">
                  <BookOpen size={18} />
                  <h4>Section Completeness & Header Detection</h4>
                </div>
                <div className="ats-sections-grid">
                  {(result.sectionCompleteness || []).map((sec, idx) => (
                    <div
                      key={idx}
                      className={`ats-section-card ${sec.status.toLowerCase()}`}
                    >
                      <div className="ats-section-card-top">
                        <span className="ats-sec-name">{sec.name}</span>
                        {sec.status === "Passed" ? (
                          <span className="ats-status-badge passed">
                            <CheckCircle2 size={13} />
                            <span>Passed</span>
                          </span>
                        ) : sec.status === "Warning" ? (
                          <span className="ats-status-badge warning">
                            <AlertTriangle size={13} />
                            <span>Optional</span>
                          </span>
                        ) : (
                          <span className="ats-status-badge missing">
                            <AlertCircle size={13} />
                            <span>Missing</span>
                          </span>
                        )}
                      </div>
                      <p className="ats-sec-detail">{sec.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Match Analysis (Matched vs Missing) */}
              <div className="ats-report-block">
                <div className="ats-block-header">
                  <Target size={18} />
                  <h4>Skills & Keyword Match Analysis</h4>
                </div>

                <div className="ats-skills-comparison">
                  {/* Matched Keywords */}
                  <div className="ats-skills-column matched">
                    <div className="ats-col-head">
                      <CheckCircle2 size={16} />
                      <h5>
                        Detected Skills & Keywords ({result.skillsMatch?.detectedTechnical?.length || 0})
                      </h5>
                    </div>
                    <div className="ats-tags-cloud">
                      {(result.skillsMatch?.detectedTechnical || []).map((skill, i) => (
                        <span key={i} className="ats-skill-tag matched">
                          <Check size={12} />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords & Recommended */}
                  <div className="ats-skills-column missing">
                    <div className="ats-col-head">
                      <AlertTriangle size={16} />
                      <h5>
                        Missing Keywords & Recommended Skills ({result.skillsMatch?.missingKeywords?.length || 0})
                      </h5>
                    </div>
                    <p className="ats-col-hint">
                      Click any keyword to copy and paste into your resume:
                    </p>
                    <div className="ats-tags-cloud">
                      {(result.skillsMatch?.missingKeywords || []).map((skill, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`ats-skill-tag missing-btn ${copiedKey === skill ? "copied" : ""}`}
                          onClick={() => handleCopyKeyword(skill)}
                          title="Click to copy"
                        >
                          {copiedKey === skill ? <Check size={12} /> : <Copy size={12} />}
                          <span>{skill}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatting & Readability Checks */}
              <div className="ats-report-block">
                <div className="ats-block-header">
                  <CheckCircle2 size={18} />
                  <h4>Resume Formatting & Readability Checks</h4>
                </div>
                <div className="ats-checks-list">
                  {(result.formattingChecks || []).map((check, idx) => (
                    <div key={idx} className="ats-check-row">
                      <div className="ats-check-status-icon">
                        {check.status === "Passed" ? (
                          <CheckCircle2 size={18} className="color-passed" />
                        ) : (
                          <AlertTriangle size={18} className="color-warning" />
                        )}
                      </div>
                      <div className="ats-check-info">
                        <strong>{check.item}</strong>
                        <span>{check.message}</span>
                      </div>
                      <span className={`ats-check-pill ${check.status.toLowerCase()}`}>
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations to Improve Resume */}
              <div className="ats-report-block">
                <div className="ats-block-header">
                  <Sparkles size={18} />
                  <h4>Actionable Recommendations to Elevate Your Resume</h4>
                </div>
                <div className="ats-recommendations-list">
                  {(result.recommendations || []).map((rec, idx) => (
                    <div key={idx} className={`ats-recommendation-item ${rec.type}`}>
                      <div className="ats-rec-meta">
                        <span className={`ats-rec-pill ${rec.type}`}>
                          {rec.type === "high" ? "High Impact" : rec.type === "medium" ? "Medium Impact" : "Quick Win"}
                        </span>
                        <span className="ats-rec-category">{rec.category}</span>
                      </div>
                      <h5>{rec.title}</h5>
                      <p>{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="ats-results-footer">
                <button
                  type="button"
                  className="btn secondary ats-footer-btn"
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                >
                  <Download size={16} />
                  <span>{isExportingPdf ? "Generating PDF..." : "Download ATS Report (PDF)"}</span>
                </button>

                <button
                  type="button"
                  className="btn secondary ats-footer-btn"
                  onClick={handleReset}
                >
                  <RefreshCw size={16} />
                  <span>Analyze Another Resume</span>
                </button>

                {onApplyAsCandidate && (
                  <button
                    type="button"
                    className="btn primary ats-footer-btn"
                    onClick={() => {
                      onClose();
                      onApplyAsCandidate();
                    }}
                  >
                    <Briefcase size={16} />
                    <span>Apply to Oryenza Network</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

