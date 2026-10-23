import React, { useState } from "react";
import { api } from "../services/api";
import { X, Upload, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default function CandidateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
      setStatusType("success");
      setStatusMessage(
        res.message ||
          "Application submitted successfully! Our talent team will review your profile.",
      );
      setTimeout(() => {
        // Reset after success
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
      }, 3000);
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
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
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
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
        </div>
      </div>
    </div>
  );
}
