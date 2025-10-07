require('dotenv').config(); // load environment variables
const { Pool } = require('pg'); // PostgreSQL client

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Check database connection
pool.connect()
  .then(() => console.log("Connected to PostgrSQL"))
  .catch(err => console.error('Connection error', err.stack));

  module.exports = pool