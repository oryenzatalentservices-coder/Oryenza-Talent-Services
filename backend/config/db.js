const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "oryenza_talent_db";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);

let pool = null;
let isMysqlActive = false;
let dbErrorDetails = null;

// Local JSON fallback store path
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const localDbPath = path.join(dataDir, "local_db.json");

// Initialize local JSON DB structure if missing
function getLocalDb() {
  if (!fs.existsSync(localDbPath)) {
    const initialData = {
      inquiries: [
        {
          id: 1,
          name: "Rajesh Sharma",
          email: "rajesh@techinnovations.in",
          company: "Tech Innovations India",
          phone: "+91 98765 43210",
          requirement: "Permanent recruitment",
          message:
            "Looking to hire 3 Senior Full-Stack React & Node.js Developers for our Surat & Pune engineering centers.",
          status: "in_progress",
          admin_notes: "Initial call scheduled for Monday 11 AM.",
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          name: "Meera Patel",
          email: "meera.patel@surattextiles.com",
          company: "Surat Premium Fabrics",
          phone: "+91 98250 12345",
          requirement: "Contract / project hiring",
          message:
            "Require 2 Supply Chain & Inventory Operations Managers for our Varachha distribution facility for a 6-month contract.",
          status: "new",
          admin_notes: null,
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],
      candidates: [
        {
          id: 1,
          name: "Anand Verma",
          email: "anand.verma@gmail.com",
          phone: "+91 99887 76655",
          current_role: "Lead Backend Engineer",
          experience_years: 6.5,
          preferred_location: "Surat / Remote",
          skills: "Node.js, Express, MySQL, PostgreSQL, Docker, AWS",
          resume_path: null,
          resume_original_name: "Anand_Verma_CV.pdf",
          portfolio_url: "https://github.com/anandverma",
          status: "screening",
          admin_notes:
            "Excellent backend architecture fundamentals. Shortlisted for client review.",
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      site_stats: [
        {
          id: 1,
          metric_key: "happy_clients",
          metric_value: 25,
          label: "Happy clients",
          suffix: "+",
        },
        {
          id: 2,
          metric_key: "industries_served",
          15: true,
          metric_value: 15,
          label: "Industries served",
          suffix: "+",
        },
        {
          id: 3,
          metric_key: "successful_placements",
          metric_value: 250,
          label: "Successful placements",
          suffix: "+",
        },
        {
          id: 4,
          metric_key: "retention_rate",
          metric_value: 96,
          label: "1-Year retention rate",
          suffix: "%",
        },
      ],
    };
    fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2), "utf8");
  }
  try {
    return JSON.parse(fs.readFileSync(localDbPath, "utf8"));
  } catch {
    return { inquiries: [], candidates: [], site_stats: [] };
  }
}

function saveLocalDb(data) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Attempt to connect to MySQL and bootstrap database & tables
 */
async function initDb() {
  console.log(
    `[Database] Attempting connection to MySQL server at ${DB_HOST}:${DB_PORT} as user '${DB_USER}'...`,
  );

  try {
    // 1. Connect without database first to ensure DB exists
    const rootConn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    console.log(
      `[Database] Connected to MySQL server. Ensuring database '${DB_NAME}' exists...`,
    );
    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
    await rootConn.end();

    // 2. Create the main application connection pool
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Create tables if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        company VARCHAR(150) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        requirement VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'in_progress', 'contacted', 'closed') DEFAULT 'new',
        admin_notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        current_role VARCHAR(150) DEFAULT NULL,
        experience_years DECIMAL(4, 1) DEFAULT 0.0,
        preferred_location VARCHAR(100) DEFAULT NULL,
        skills TEXT DEFAULT NULL,
        resume_path VARCHAR(255) DEFAULT NULL,
        resume_original_name VARCHAR(255) DEFAULT NULL,
        portfolio_url VARCHAR(255) DEFAULT NULL,
        status ENUM('applied', 'screening', 'interview', 'offered', 'placed', 'rejected') DEFAULT 'applied',
        admin_notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_candidate_status (status),
        INDEX idx_candidate_created (created_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metric_key VARCHAR(50) UNIQUE NOT NULL,
        metric_value INT NOT NULL,
        label VARCHAR(100) NOT NULL,
        suffix VARCHAR(10) DEFAULT '+',
        display_order INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Seed default stats if table is empty
    const [statsRows] = await pool.query(
      "SELECT COUNT(*) as count FROM site_stats",
    );
    if (statsRows[0].count === 0) {
      await pool.query(`
        INSERT INTO site_stats (metric_key, metric_value, label, suffix, display_order)
        VALUES 
          ('happy_clients', 25, 'Happy clients', '+', 1),
          ('industries_served', 15, 'Industries served', '+', 2),
          ('successful_placements', 250, 'Successful placements', '+', 3),
          ('retention_rate', 96, '1-Year retention rate', '%', 4);
      `);
      console.log("[Database] Seeded initial stats into MySQL.");
    }

    isMysqlActive = true;
    dbErrorDetails = null;
    console.log(
      `[Database] SUCCESS: Connected to MySQL database '${DB_NAME}' successfully!`,
    );
    return { success: true, mode: "mysql" };
  } catch (err) {
    isMysqlActive = false;
    dbErrorDetails = err.message;
    console.warn(`\n======================================================`);
    console.warn(`[MySQL Connection Notice]`);
    console.warn(
      `Unable to connect to MySQL (${err.code || "ERR"}: ${err.message}).`,
    );
    console.warn(
      `Check your credentials in server/.env (DB_PASSWORD / DB_USER).`,
    );
    console.warn(`>>> Resilient Fallback Mode is ACTIVE <<<`);
    console.warn(
      `All inquiries, candidates, and stats will automatically persist`,
    );
    console.warn(
      `in server/data/local_db.json without any disruption to the app.`,
    );
    console.warn(`======================================================\n`);

    // Ensure local DB exists
    getLocalDb();
    return { success: false, mode: "local_fallback", error: err.message };
  }
}

/**
 * Unified Database query / repository functions
 */
const db = {
  isMysql: () => isMysqlActive,
  getStatus: () => ({
    mode: isMysqlActive
      ? "MySQL (Live Connection)"
      : "Local File Persistence (Fallback)",
    isMysql: isMysqlActive,
    database: DB_NAME,
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    error: dbErrorDetails,
  }),

  // INQUIRIES
  async getInquiries(filter = {}) {
    if (isMysqlActive) {
      let sql = "SELECT * FROM inquiries";
      const params = [];
      if (filter.status && filter.status !== "all") {
        sql += " WHERE status = ?";
        params.push(filter.status);
      }
      sql += " ORDER BY created_at DESC";
      const [rows] = await pool.query(sql, params);
      return rows;
    } else {
      const data = getLocalDb();
      let list = [...data.inquiries];
      if (filter.status && filter.status !== "all") {
        list = list.filter((i) => i.status === filter.status);
      }
      return list.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    }
  },

  async createInquiry(inquiry) {
    if (isMysqlActive) {
      const sql = `
        INSERT INTO inquiries (name, email, company, phone, requirement, message, status)
        VALUES (?, ?, ?, ?, ?, ?, 'new')
      `;
      const [result] = await pool.query(sql, [
        inquiry.name,
        inquiry.email,
        inquiry.company || null,
        inquiry.phone || null,
        inquiry.requirement,
        inquiry.message,
      ]);
      return {
        id: result.insertId,
        ...inquiry,
        status: "new",
        created_at: new Date().toISOString(),
      };
    } else {
      const data = getLocalDb();
      const newId =
        data.inquiries.length > 0
          ? Math.max(...data.inquiries.map((i) => i.id)) + 1
          : 1;
      const record = {
        id: newId,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company || null,
        phone: inquiry.phone || null,
        requirement: inquiry.requirement,
        message: inquiry.message,
        status: "new",
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      data.inquiries.unshift(record);
      saveLocalDb(data);
      return record;
    }
  },

  async updateInquiry(id, updates) {
    if (isMysqlActive) {
      const fields = [];
      const params = [];
      if (updates.status) {
        fields.push("status = ?");
        params.push(updates.status);
      }
      if (updates.admin_notes !== undefined) {
        fields.push("admin_notes = ?");
        params.push(updates.admin_notes);
      }
      if (fields.length === 0) return null;
      params.push(id);
      await pool.query(
        `UPDATE inquiries SET ${fields.join(", ")} WHERE id = ?`,
        params,
      );
      const [rows] = await pool.query("SELECT * FROM inquiries WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } else {
      const data = getLocalDb();
      const item = data.inquiries.find((i) => i.id === parseInt(id, 10));
      if (!item) return null;
      if (updates.status) item.status = updates.status;
      if (updates.admin_notes !== undefined)
        item.admin_notes = updates.admin_notes;
      item.updated_at = new Date().toISOString();
      saveLocalDb(data);
      return item;
    }
  },

  async deleteInquiry(id) {
    if (isMysqlActive) {
      const [result] = await pool.query("DELETE FROM inquiries WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } else {
      const data = getLocalDb();
      const initialLen = data.inquiries.length;
      data.inquiries = data.inquiries.filter((i) => i.id !== parseInt(id, 10));
      saveLocalDb(data);
      return data.inquiries.length < initialLen;
    }
  },

  // CANDIDATES
  async getCandidates(filter = {}) {
    if (isMysqlActive) {
      let sql = "SELECT * FROM candidates";
      const params = [];
      if (filter.status && filter.status !== "all") {
        sql += " WHERE status = ?";
        params.push(filter.status);
      }
      sql += " ORDER BY created_at DESC";
      const [rows] = await pool.query(sql, params);
      return rows;
    } else {
      const data = getLocalDb();
      let list = [...data.candidates];
      if (filter.status && filter.status !== "all") {
        list = list.filter((c) => c.status === filter.status);
      }
      return list.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    }
  },

  async createCandidate(candidate) {
    if (isMysqlActive) {
      const sql = `
        INSERT INTO candidates (
          name, email, phone, current_role, experience_years, preferred_location,
          skills, resume_path, resume_original_name, portfolio_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'applied')
      `;
      const [result] = await pool.query(sql, [
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.current_role || null,
        candidate.experience_years
          ? parseFloat(candidate.experience_years)
          : 0.0,
        candidate.preferred_location || null,
        candidate.skills || null,
        candidate.resume_path || null,
        candidate.resume_original_name || null,
        candidate.portfolio_url || null,
      ]);
      return {
        id: result.insertId,
        ...candidate,
        status: "applied",
        created_at: new Date().toISOString(),
      };
    } else {
      const data = getLocalDb();
      const newId =
        data.candidates.length > 0
          ? Math.max(...data.candidates.map((c) => c.id)) + 1
          : 1;
      const record = {
        id: newId,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        current_role: candidate.current_role || null,
        experience_years: candidate.experience_years
          ? parseFloat(candidate.experience_years)
          : 0.0,
        preferred_location: candidate.preferred_location || null,
        skills: candidate.skills || null,
        resume_path: candidate.resume_path || null,
        resume_original_name: candidate.resume_original_name || null,
        portfolio_url: candidate.portfolio_url || null,
        status: "applied",
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      data.candidates.unshift(record);
      saveLocalDb(data);
      return record;
    }
  },

  async updateCandidate(id, updates) {
    if (isMysqlActive) {
      const fields = [];
      const params = [];
      if (updates.status) {
        fields.push("status = ?");
        params.push(updates.status);
      }
      if (updates.admin_notes !== undefined) {
        fields.push("admin_notes = ?");
        params.push(updates.admin_notes);
      }
      if (fields.length === 0) return null;
      params.push(id);
      await pool.query(
        `UPDATE candidates SET ${fields.join(", ")} WHERE id = ?`,
        params,
      );
      const [rows] = await pool.query("SELECT * FROM candidates WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } else {
      const data = getLocalDb();
      const item = data.candidates.find((c) => c.id === parseInt(id, 10));
      if (!item) return null;
      if (updates.status) item.status = updates.status;
      if (updates.admin_notes !== undefined)
        item.admin_notes = updates.admin_notes;
      item.updated_at = new Date().toISOString();
      saveLocalDb(data);
      return item;
    }
  },

  async deleteCandidate(id) {
    if (isMysqlActive) {
      const [result] = await pool.query("DELETE FROM candidates WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } else {
      const data = getLocalDb();
      const initialLen = data.candidates.length;
      data.candidates = data.candidates.filter(
        (c) => c.id !== parseInt(id, 10),
      );
      saveLocalDb(data);
      return data.candidates.length < initialLen;
    }
  },

  // STATS
  async getStats() {
    if (isMysqlActive) {
      const [rows] = await pool.query(
        "SELECT * FROM site_stats ORDER BY display_order ASC",
      );
      const [inquiryCount] = await pool.query(
        "SELECT COUNT(*) as count FROM inquiries",
      );
      const [candidateCount] = await pool.query(
        "SELECT COUNT(*) as count FROM candidates",
      );
      return {
        metrics: rows,
        summary: {
          totalInquiries: inquiryCount[0].count,
          totalCandidates: candidateCount[0].count,
        },
      };
    } else {
      const data = getLocalDb();
      return {
        metrics: data.site_stats || [],
        summary: {
          totalInquiries: data.inquiries.length,
          totalCandidates: data.candidates.length,
        },
      };
    }
  },
};

module.exports = {
  initDb,
  db,
};
