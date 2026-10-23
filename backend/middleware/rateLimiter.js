const rateLimit = require("express-rate-limit");

/**
 * Rate Limiters for Oryenza Talent Services API
 * Defends against Denial of Service (DoS), brute force, and automated spam.
 */

// 1. General API rate limiter (all routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes window
  standardHeaders: true, // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// 2. Strict Submission Limiter (for POST /api/inquiries and POST /api/candidates)
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Allow max 15 submissions per 15 mins per IP (prevents spam flooding)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Submission limit reached for this IP. Please wait a few minutes before submitting another request.",
  },
});

// 3. File Download Limiter (for resume downloads)
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Download rate limit reached. Please try again later.",
  },
});

module.exports = {
  apiLimiter,
  submissionLimiter,
  downloadLimiter,
};
