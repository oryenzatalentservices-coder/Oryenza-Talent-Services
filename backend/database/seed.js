const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function seed() {
  console.log(
    `Database ready. No dummy seed data to insert — holding only authentic entries.`
  );
}
  console.log("Database seed finished successfully!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
