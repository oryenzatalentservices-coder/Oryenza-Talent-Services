import React, { useState } from "react";
import { api } from "../services/api";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
} from "lucide-react";

// WhatsApp SVG Icon Component
function WhatsAppIcon({ size = 18, className = "" }) {
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

export default function CandidateModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    current_role: "",
    experience_years: "",
    preferred_location: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setStatusType("error");
      setStatusMessage("Only .pdf, .doc, and .docx resume files are accepted.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatusType("error");
      setStatusMessage("File size exceeds 8MB. Please upload a smaller document.");
      return;
    }
    setStatusMessage(null);
    setResumeFile(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setStatusType("error");
      setStatusMessage(
        "Please attach your Resume/CV (.pdf, .doc, .docx) before submitting.",
      );
      return;
    }
    setLoading(true);
    setStatusMessage(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      data.append("resume", resumeFile);

      const res = await api.submitCandidate(data);

      // Persist true candidate entry to localStorage as backup (clean metadata without huge blobs)
      try {
        const trueCandidate = {
          id: (res && res.data && res.data.id) || "cand_" + Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          current_role: formData.current_role,
          experience_years: formData.experience_years,
          preferred_location: formData.preferred_location,
          skills: formData.skills,
          resume_path: (res && res.data && res.data.resume_path) || (resumeFile ? resumeFile.name : null),
          resume_original_name: resumeFile ? resumeFile.name : null,
          status: "applied",
          created_at: (res && res.data && res.data.created_at) || new Date().toISOString(),
        };

        const currentList = JSON.parse(
          localStorage.getItem("oryenza_true_candidates") || "[]"
        );
        // Clean out any legacy base64 blobs that could cause QuotaExceededError
        const sanitizedList = currentList.map(({ resume_data, resume_data_url, ...rest }) => rest);
        const exists = sanitizedList.some((c) => String(c.id) === String(trueCandidate.id));
        if (!exists) {
          sanitizedList.unshift(trueCandidate);
        }
        localStorage.setItem(
          "oryenza_true_candidates",
          JSON.stringify(sanitizedList)
        );
      } catch (storageErr) {
        console.warn("Storage sync notice:", storageErr);
      }

      setStatusType("success");
      setStatusMessage(
        res.message ||
          "Application submitted successfully! Our talent team will review your profile.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        current_role: "",
        experience_years: "",
        preferred_location: "",
        skills: "",
      });
      setResumeFile(null);
    } catch (err) {
      console.error("Candidate submission error:", err);
      setStatusType("error");
      setStatusMessage(
        err.message ||
          "Failed to submit application. Please try again or email jobs@oryenza.in.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatusType("");
    setStatusMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Candidate Intake & CV Submission</h3>
            <p className="modal-subheading">
              "People are more than a résumé." Join our active talent pool.
            </p>
          </div>
          <button
            className="modal-close-btn"
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {statusType === "success" ? (
            <div className="candidate-success-view">
              <div className="candidate-success-icon-wrap">
                <CheckCircle2 size={44} />
              </div>
              <h3 className="candidate-success-title">Application Submitted!</h3>
              <p className="candidate-success-desc">
                {statusMessage ||
                  "Your profile and resume have been securely received. Our talent consultants will review your qualifications."}
              </p>

              {/* Dedicated WhatsApp Community Invitation Card */}
              <div className="candidate-whatsapp-invite-box">
                <div className="candidate-whatsapp-header">
                  <span className="candidate-whatsapp-pill">
                    <WhatsAppIcon size={14} /> WhatsApp Community • Priority Job Alerts
                  </span>
                </div>
                <h4 className="candidate-whatsapp-headline">
                  Join Our WhatsApp Community for Direct Job Alerts
                </h4>
                <p className="candidate-whatsapp-text">
                  Stay updated with exclusive openings, priority recruiter screenings, and walk-in hiring drives before they are posted anywhere else!
                </p>
                <a
                  href="https://chat.whatsapp.com/LWswD7SeIf22btGoNETsLw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="candidate-whatsapp-join-btn"
                >
                  <WhatsAppIcon size={20} />
                  <span>Join WhatsApp Community Now</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>

              <div className="candidate-success-actions">
                <button
                  type="button"
                  className="btn candidate-reset-btn"
                  onClick={() => {
                    setStatusType("");
                    setStatusMessage(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      current_role: "",
                      experience_years: "",
                      preferred_location: "",
                      skills: "",
                    });
                    setResumeFile(null);
                  }}
                >
                  Submit Another Profile
                </button>
                <button
                  type="button"
                  className="btn candidate-close-btn"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            <label>
              Full name *
              <input
                name="name"
                placeholder="Enter your full name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email address *
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                maxLength={100}
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Phone number *
              <input
                name="phone"
                placeholder="Enter contact number"
                required
                maxLength={30}
                value={formData.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              Current / Target Role *
              <input
                name="current_role"
                placeholder="e.g. Senior Full-Stack Engineer"
                required
                maxLength={100}
                value={formData.current_role}
                onChange={handleChange}
              />
            </label>

            <label>
              Years of experience *
              <input
                name="experience_years"
                type="number"
                step="0.5"
                min="0"
                max="50"
                placeholder="e.g. 5"
                required
                value={formData.experience_years}
                onChange={handleChange}
              />
            </label>

            <label>
              Preferred Location *
              <input
                name="preferred_location"
                placeholder="e.g. Surat, Ahmedabad, Remote, Hybrid"
                required
                maxLength={100}
                value={formData.preferred_location}
                onChange={handleChange}
              />
            </label>

            <label className="full">
              Key Skills & Tech Stack *
              <input
                name="skills"
                placeholder="e.g. React, Node.js, MySQL, Python, Operations, Sales..."
                required
                maxLength={500}
                value={formData.skills}
                onChange={handleChange}
              />
            </label>

            <div className="full">
              <label style={{ marginBottom: "8px" }}>
                Attach Resume / CV (.pdf, .doc, .docx) *
              </label>
              <div
                className={`file-upload-box ${dragOver ? "dragover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resumeInput").click()}
              >
                <input
                  id="resumeInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div className="file-upload-icon">
                  {resumeFile ? <FileText size={22} /> : <Upload size={22} />}
                </div>
                {resumeFile ? (
                  <div>
                    <strong className="file-upload-name">
                      {resumeFile.name}
                    </strong>
                    <span className="file-upload-subtext">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click to
                      change file
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="file-upload-highlight">
                      Click to browse
                    </span>{" "}
                    or drag and drop your resume
                    <div
                      className="file-upload-subtext"
                      style={{ marginTop: "4px" }}
                    >
                      PDF, DOC, or DOCX (Max 8MB) * Required
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="full" style={{ marginTop: "12px" }}>
              <button
                className="btn primary"
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "14px" }}
              >
                {loading
                  ? "Uploading & Submitting Application..."
                  : "Submit Profile & Resume"}
              </button>

              {statusMessage && (
                <div className={`form-alert ${statusType}`}>
                  {statusType === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
