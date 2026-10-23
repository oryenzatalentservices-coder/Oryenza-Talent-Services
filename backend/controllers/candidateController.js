const { db } = require("../config/db");
const path = require("path");
const fs = require("fs");

// Create a new candidate application
exports.createCandidate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      current_role,
      experience_years,
      preferred_location,
      skills,
      portfolio_url,
    } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Full name is required." });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }
    if (!phone || !phone.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Contact phone number is required." });
    }
    if (!current_role || !current_role.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Current / target role is required." });
    }
    if (
      experience_years === undefined ||
      experience_years === null ||
      experience_years === ""
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Years of experience is required." });
    }
    if (!preferred_location || !preferred_location.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Preferred location is required." });
    }
    if (!skills || !skills.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Key skills & tech stack is required.",
        });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Please attach your Resume / CV file.",
        });
    }

    // Length and URL scheme verification
    if (name.length > 150) {
      return res.status(400).json({ success: false, error: "Full name is too long (max 150 characters)." });
    }
    if (email.length > 150) {
      return res.status(400).json({ success: false, error: "Email address is too long." });
    }
    if (phone.length > 50) {
      return res.status(400).json({ success: false, error: "Phone number is too long." });
    }
    if (skills.length > 1500) {
      return res.status(400).json({ success: false, error: "Skills field is too long (max 1500 characters)." });
    }

    let sanitizedPortfolioUrl = null;
    if (portfolio_url && portfolio_url.trim()) {
      const trimmedUrl = portfolio_url.trim();
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        return res.status(400).json({
          success: false,
          error: "Portfolio/LinkedIn link must begin with http:// or https://",
        });
      }
      sanitizedPortfolioUrl = trimmedUrl.slice(0, 500);
    }

    let resume_path = null;
    let resume_original_name = null;

    if (req.file) {
      resume_path = path.basename(req.file.filename);
      resume_original_name = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9_.\-\s()]/g, "");
    }

    const newCandidate = await db.createCandidate({
      name: name.trim().slice(0, 150),
      email: email.trim().toLowerCase().slice(0, 150),
      phone: phone.trim().slice(0, 50),
      current_role: current_role ? current_role.trim().slice(0, 150) : null,
      experience_years: experience_years ? parseFloat(experience_years) : 0,
      preferred_location: preferred_location ? preferred_location.trim().slice(0, 150) : null,
      skills: skills ? skills.trim().slice(0, 1500) : null,
      portfolio_url: sanitizedPortfolioUrl,
      resume_path,
      resume_original_name,
    });

    return res.status(201).json({
      success: true,
      message:
        "Your profile and application have been submitted successfully! The Oryenza talent team will review your profile.",
      data: newCandidate,
    });
  } catch (err) {
    console.error("Error creating candidate:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to submit candidate profile." });
  }
};

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const { status } = req.query;
    const candidates = await db.getCandidates({ status });
    return res.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch candidates." });
  }
};

// Update candidate status or admin notes
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = [
      "applied",
      "screening",
      "interview",
      "offered",
      "placed",
      "rejected",
    ];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid candidate status." });
    }

    const updated = await db.updateCandidate(id, { status, admin_notes });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Candidate not found." });
    }

    return res.json({
      success: true,
      message: "Candidate status updated.",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating candidate:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update candidate." });
  }
};

// Download / view resume file (Hardened against path traversal and MIME spoofing)
exports.downloadResume = (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ success: false, error: "Filename is required." });
    }

    // Strip any path traversal characters and directory parts
    const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9_.-]/g, "");
    const baseUploadDir = path.resolve(__dirname, "..", "uploads", "resumes");
    const filePath = path.resolve(baseUploadDir, sanitizedFilename);

    // Verify filePath is strictly within baseUploadDir (canonical path traversal defense)
    if (!filePath.startsWith(baseUploadDir)) {
      return res.status(403).json({ success: false, error: "Access denied." });
    }

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, error: "Resume file not found." });
    }

    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.download(filePath, sanitizedFilename);
  } catch (err) {
    console.error("Error downloading resume:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to download file." });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteCandidate(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Candidate not found." });
    }
    return res.json({
      success: true,
      message: "Candidate removed successfully.",
    });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete candidate." });
  }
};
