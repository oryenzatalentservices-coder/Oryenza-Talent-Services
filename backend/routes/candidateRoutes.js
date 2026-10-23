const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const candidateController = require("../controllers/candidateController");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "resume-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .doc, and .docx resume files are allowed."));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Candidate routes
router.post("/", upload.single("resume"), candidateController.createCandidate);
router.get("/", candidateController.getCandidates);
router.patch("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);
router.get("/resume/:filename", candidateController.downloadResume);

module.exports = router;
