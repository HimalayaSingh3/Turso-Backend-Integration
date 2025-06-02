const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
dotenv.config();

const Db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const init = async () => {
  try {
    await Db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users table ensured in database.");
  } catch (err) {
    console.error("❌ Error creating users table:", err.message);
  }
};

const dbConnect = async () => {
  try {
    const result = await Db.execute("SELECT 1");
    if (result.rows.length > 0) {
      console.log("✅ Turso database connection established successfully.");
    } else {
      console.log("⚠️ Connected, but received empty response.");
    }
    await init(); // Ensure table creation after connection
  } catch (error) {
    console.error("❌ Failed to connect to the Turso database:", error.message);
  }
};

dbConnect();

module.exports = {
  Db,
};
