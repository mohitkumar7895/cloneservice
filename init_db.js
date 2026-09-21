const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'local.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true
  });

  try {
    const sql = fs.readFileSync(path.resolve(__dirname, 'database.sql'), 'utf-8');
    
    // Some MySQL versions/drivers have issues with multiple statements separated by semicolons if multipleStatements: true is not set, but we set it.
    console.log("Executing database.sql...");
    
    // We can also split by ';' and execute one by one to be safer.
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const stmt of statements) {
      if (stmt.trim()) {
         console.log("Executing statement:", stmt.substring(0, 50).replace(/\n/g, ' ') + "...");
         await pool.query(stmt);
      }
    }
    
    console.log("All tables created successfully!");

  } catch (err) {
    console.error("Error:", err.message);
  }
  
  await pool.end();
}
run();
