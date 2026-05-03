// load environment variables from .env file
require('dotenv').config();

// import Pool from pg (PostgreSQL client)
const { Pool } = require('pg');

// create connection pool using env variables
const pool = new Pool({
  user: process.env.DB_USER,       // database username
  host: process.env.DB_HOST,       // database host (localhost)
  database: process.env.DB_NAME,   // database name
  password: process.env.DB_PASSWORD, // database password
  port: process.env.DB_PORT,       // database port (5432)
});

// test DB connection when server starts
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch(err => console.log("❌ DB connection error:", err));

// export pool so other files can use it
module.exports = pool;