const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { initDb } = require("./config/db");
const inquiryRoutes = require("./routes/inquiryRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads if needed (resumes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/stats", statsRoutes);

// Root Health check
app.get("/", (req, res) => {
  res.json({
    name: "Oryenza Talent Services Backend API",
    status: "active",
    version: "1.0.0",
    endpoints: {
      inquiries: "/api/inquiries",
      candidates: "/api/candidates",
      stats: "/api/stats",
      health: "/api/stats/health",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  if (err.name === "MulterError") {
    return res
      .status(400)
      .json({ success: false, error: `Upload error: ${err.message}` });
  }
  return res
    .status(500)
    .json({ success: false, error: err.message || "Internal server error." });
});

// Start Server & Bootstrap Database
async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Oryenza Talent Services API Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/stats/health`);
    console.log(`======================================================\n`);
  });
}

startServer();
