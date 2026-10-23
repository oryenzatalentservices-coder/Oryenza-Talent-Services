const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function seed() {
  console.log(
    `Connecting to MySQL database '${process.env.DB_NAME}' at ${process.env.DB_HOST}:${process.env.DB_PORT}...`,
  );

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "oryenza_talent_db",
    port: parseInt(process.env.DB_PORT || "3306", 10),
  });

  console.log("Connected! Checking existing records...");

  // 1. Seed Inquiries if empty
  const [inqRows] = await connection.query(
    "SELECT COUNT(*) as count FROM inquiries",
  );
  if (inqRows[0].count === 0) {
    console.log("Seeding initial inquiries...");
    await connection.query(`
      INSERT INTO inquiries (name, email, company, phone, requirement, message, status, admin_notes)
      VALUES 
        ('Rajesh Sharma', 'rajesh@techinnovations.in', 'Tech Innovations India', '+91 98765 43210', 'Permanent recruitment', 'Looking to hire 3 Senior Full-Stack React & Node.js Developers for our Surat & Pune engineering centers.', 'in_progress', 'Initial discovery call scheduled for Monday 11:00 AM.'),
        ('Meera Patel', 'meera.patel@surattextiles.com', 'Surat Premium Fabrics', '+91 98250 12345', 'Contract / project hiring', 'Require 2 Supply Chain & Inventory Operations Managers for our Varachha distribution facility for a 6-month contract.', 'new', NULL),
        ('Karan Mehta', 'karan@fintechgujarat.org', 'Gujarat FinTech Hub', '+91 98980 55667', 'Talent sourcing & screening', 'Need a pipeline of 10 junior and mid-level Golang & Cloud backend engineers.', 'contacted', 'Shared introductory profile deck with client.')
    `);
    console.log("Seeded 3 inquiries into MySQL.");
  } else {
    console.log(
      `Inquiries table already contains ${inqRows[0].count} record(s).`,
    );
  }

  // 2. Seed Candidates if empty
  const [candRows] = await connection.query(
    "SELECT COUNT(*) as count FROM candidates",
  );
  if (candRows[0].count === 0) {
    console.log("Seeding initial candidates...");
    await connection.query(`
      INSERT INTO candidates (name, email, phone, current_role, experience_years, preferred_location, skills, resume_original_name, status, admin_notes)
      VALUES 
        ('Anand Verma', 'anand.verma@gmail.com', '+91 99887 76655', 'Lead Backend Engineer', 6.5, 'Surat / Remote', 'Node.js, Express, MySQL, PostgreSQL, Docker, AWS', 'Anand_Verma_Lead_CV.pdf', 'screening', 'Excellent backend fundamentals. High offer acceptance probability.'),
        ('Pooja Shah', 'pooja.shah@techmail.com', '+91 98112 33445', 'Senior Frontend Developer', 4.0, 'Surat / Hybrid', 'React, TypeScript, Next.js, Redux, Tailwind CSS', 'Pooja_Shah_Frontend.pdf', 'interview', 'Scheduled technical round with client engineering manager.'),
        ('Vikram Rathod', 'vikram.rathod@enterprise.in', '+91 97234 56789', 'Plant Operations Specialist', 8.0, 'Surat, Gujarat', 'Lean Manufacturing, Supply Chain, Six Sigma, Team Leadership', 'Vikram_Rathod_Ops.pdf', 'placed', 'Placed with Surat Manufacturing client with 96% retention benchmark.')
    `);
    console.log("Seeded 3 candidate talent profiles into MySQL.");
  } else {
    console.log(
      `Candidates table already contains ${candRows[0].count} record(s).`,
    );
  }

  await connection.end();
  console.log("Database seed finished successfully!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
