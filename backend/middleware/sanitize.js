/**
 * Input Sanitization & Anti-Injection Middleware
 * Cleans request bodies, query strings, and parameters.
 * Blocks XSS vectors, script injection, and prototype pollution.
 */

function sanitizeString(val) {
  if (typeof val !== "string") return val;

  // Protect against huge payload string explosion
  const maxLen = 10000;
  let str = val.length > maxLen ? val.slice(0, maxLen) : val;

  return str
    .replace(/\0/g, "") // Remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove <iframe> tags
    .replace(/<[^>]+>/g, "") // Strip any HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: pseudo-protocol
    .replace(/data:\s*text\/html/gi, "") // Remove data:text/html protocol
    .trim();
}

function deepSanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item));
  }

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    // Prototype pollution prevention
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    if (typeof val === "string") {
      clean[key] = sanitizeString(val);
    } else if (typeof val === "object" && val !== null) {
      clean[key] = deepSanitize(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = deepSanitize(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = deepSanitize(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = deepSanitize(req.params);
  }
  next();
}

module.exports = {
  sanitizeInputs,
  sanitizeString,
};
