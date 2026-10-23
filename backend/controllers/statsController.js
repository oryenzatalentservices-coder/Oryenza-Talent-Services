const { db } = require("../config/db");

// Get public website stats and KPI counters
exports.getStats = async (req, res) => {
  try {
    const statsData = await db.getStats();
    return res.json({ success: true, data: statsData });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch statistics." });
  }
};

// Safe Health and Service Status (no sensitive credential disclosure)
exports.getHealth = async (req, res) => {
  try {
    const dbStatus = db.getStatus();
    return res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      service: "Oryenza Talent Services API",
      database: {
        healthy: true,
        mode: dbStatus.mode,
        isMysql: dbStatus.isMysql,
      },
    });
  } catch (err) {
    console.error("Health check error:", err);
    return res.status(500).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      service: "Oryenza Talent Services API",
    });
  }
};
