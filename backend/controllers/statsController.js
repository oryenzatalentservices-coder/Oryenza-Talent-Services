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

// Health and DB status
exports.getHealth = async (req, res) => {
  const dbStatus = db.getStatus();
  return res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    service: "Oryenza Talent Services API",
    database: dbStatus,
  });
};
