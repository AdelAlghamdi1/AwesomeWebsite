const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS message (
      name TEXT,
      email TEXT,
      Message TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Error initializing database:", err);
    } else {
      console.log("Database initialized successfully.");
    }
  });
});

module.exports = db;
