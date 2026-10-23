const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { initDb } = require("./config/db");
const inquiryRoutes = require("./routes/inquiryRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");
const { sanitizeInputs } = require("./middleware/sanitize");

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable Express fingerprinting
app.disable("x-powered-by");

// Security: Comprehensive HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        frameSrc: ["'self'"], // Allows same-origin iframe (process_journey.html)
        connectSrc: [
          "'self'",
          "http://localhost:5000",
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "https://oryenza.in",
          "https://www.oryenza.in",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "sameorigin" }, // Protect against clickjacking while allowing same-origin iframe
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true, // Prevents MIME-type sniffing
    dnsPrefetchControl: { allow: false },
  })
);

// Security: Strict CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://oryenza.in",
  "https://www.oryenza.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or approved origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Access denied for this origin."));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key", "x-api-key"],
    credentials: true,
    maxAge: 86400, // Preflight cache for 24 hours
  })
);

// Security: Request payload size limits (prevents payload Denial of Service)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Security: Global API Rate Limiting & Input Sanitization
app.use("/api", apiLimiter);
app.use("/api", sanitizeInputs);

// API Routes
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/stats", statsRoutes);

// Root Service Verification
app.get("/", (req, res) => {
  res.json({
    service: "Oryenza Talent Services API",
    status: "active",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Centralized Secure Error Handling Middleware
app.use((err, req, res, _next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size exceeds the 8MB limit. Please upload a smaller document.",
      });
    }
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`,
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request payload too large (maximum 100KB allowed).",
    });
  }

  // Handle CORS rejection
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      error: err.message,
    });
  }

  console.error("Internal Server Error:", err);

  // Mask internal stack traces in production
  const isProd = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    error: isProd ? "Internal server error. Please try again later." : (err.message || "Internal server error."),
  });
});

// Start Server & Bootstrap Database
async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🔒 Oryenza Talent Services API Server (Secured)`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛡️  Security: Helmet, Rate Limiter, CORS, Admin Auth Enabled`);
    console.log(`======================================================\n`);
  });
}

startServer();
