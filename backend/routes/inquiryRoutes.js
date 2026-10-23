const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");
const { authenticateAdmin } = require("../middleware/auth");
const { submissionLimiter } = require("../middleware/rateLimiter");
const { sanitizeInputs } = require("../middleware/sanitize");

// Public Client Inquiry Submission (protected by submission rate limiter & input sanitization)
router.post("/", submissionLimiter, sanitizeInputs, inquiryController.createInquiry);

// Protected Admin Inquiry Endpoints (require admin authentication)
router.get("/", authenticateAdmin, inquiryController.getInquiries);
router.patch("/:id", authenticateAdmin, sanitizeInputs, inquiryController.updateInquiry);
router.delete("/:id", authenticateAdmin, inquiryController.deleteInquiry);

module.exports = router;
