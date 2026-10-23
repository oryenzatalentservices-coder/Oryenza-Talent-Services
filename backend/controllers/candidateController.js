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

    let resume_path = null;
    let resume_original_name = null;

    if (req.file) {
      resume_path = req.file.filename;
      resume_original_name = req.file.originalname;
    }

    const newCandidate = await db.createCandidate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      current_role: current_role ? current_role.trim() : null,
      experience_years: experience_years ? parseFloat(experience_years) : 0,
      preferred_location: preferred_location ? preferred_location.trim() : null,
      skills: skills ? skills.trim() : null,
      portfolio_url: portfolio_url ? portfolio_url.trim() : null,
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

// Download / view resume file
exports.downloadResume = (req, res) => {
  try {
    const { filename } = req.params;
    const sanitized = path.basename(filename);
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "resumes",
      sanitized,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, error: "Resume file not found." });
    }

    return res.download(filePath);
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
