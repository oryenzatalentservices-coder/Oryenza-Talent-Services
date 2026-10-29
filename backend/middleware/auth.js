const crypto = require("crypto");

/**
 * Authentication Middleware for Oryenza Admin Endpoints
 * Protects candidate PII (resumes, contact details, applications)
 * and client hiring inquiries from unauthorized public access and scraping.
 */
function authenticateAdmin(req, res, next) {
  const configuredSecret =
    process.env.ADMIN_SECRET_KEY ||
    process.env.ADMIN_API_KEY ||
    "OryenzaTalentServices@132026";

  // Check possible header/query authentication methods
  const apiKeyHeader = req.headers["x-admin-key"] || req.headers["x-api-key"];
  const authHeader = req.headers["authorization"];
  const queryApiKey = req.query ? req.query.admin_key : null;

  let providedToken = null;

  if (apiKeyHeader && typeof apiKeyHeader === "string") {
    providedToken = apiKeyHeader.trim();
  } else if (authHeader && typeof authHeader === "string") {
    if (authHeader.startsWith("Bearer ")) {
      providedToken = authHeader.substring(7).trim();
    } else {
      providedToken = authHeader.trim();
    }
  } else if (queryApiKey && typeof queryApiKey === "string") {
    providedToken = queryApiKey.trim();
  }

  if (!providedToken) {
    return res.status(401).json({
      success: false,
      error: "Authentication required: Missing x-admin-key or Authorization header.",
    });
  }

  // Constant-time comparison to prevent timing attacks
  const tokenBuffer = Buffer.from(providedToken);
  const secretBuffer = Buffer.from(configuredSecret);

  if (
    tokenBuffer.length !== secretBuffer.length ||
    !crypto.timingSafeEqual(tokenBuffer, secretBuffer)
  ) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Invalid admin credentials provided.",
    });
  }

  next();
}

module.exports = {
  authenticateAdmin,
};
