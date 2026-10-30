const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const resumeController = require("../controllers/resumeController");

// Use memory storage for ephemeral analysis (fast, private, does not store files indefinitely)
const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(mime);

  if (isExtValid || isMimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only PDF (.pdf) and Word documents (.docx, .doc) up to 8MB are accepted."
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB limit
    files: 1,
  },
  fileFilter: fileFilter,
});

// POST /api/resume/analyze
router.post("/analyze", upload.single("resume"), resumeController.analyzeResume);

module.exports = router;

