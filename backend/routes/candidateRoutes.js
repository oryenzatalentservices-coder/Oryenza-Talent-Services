const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const candidateController = require("../controllers/candidateController");
const { authenticateAdmin } = require("../middleware/auth");
const { submissionLimiter, downloadLimiter } = require("../middleware/rateLimiter");
const { sanitizeInputs } = require("../middleware/sanitize");

// Ensure upload directory exists safely
const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

// Configure secure multer storage with cryptographically random naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const randomHex = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume_${Date.now()}_${randomHex}${ext}`);
  },
});

// Strict MIME type and extension validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(mime);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only verified PDF (.pdf) and Word documents (.doc, .docx) up to 8MB are accepted."
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB limit
    files: 1, // Only 1 file per upload
  },
  fileFilter: fileFilter,
});

// Public candidate application endpoint (protected by submission rate limiter & sanitizer)
router.post(
  "/",
  submissionLimiter,
  upload.single("resume"),
  sanitizeInputs,
  candidateController.createCandidate
);

// Protected Admin Candidate Endpoints (require admin authentication)
router.get("/", authenticateAdmin, candidateController.getCandidates);
router.patch("/:id", authenticateAdmin, sanitizeInputs, candidateController.updateCandidate);
router.delete("/:id", authenticateAdmin, candidateController.deleteCandidate);

// Protected Resume File Download Endpoint (rate limited & requires admin credentials)
router.get(
  "/resume/:filename",
  downloadLimiter,
  authenticateAdmin,
  candidateController.downloadResume
);

module.exports = router;
