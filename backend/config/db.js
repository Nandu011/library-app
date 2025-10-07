const { Pool } = require('pg'); // PostgreSQL client

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'library_db',
  password: 'Sachin@sql',
  port: 5432,
});

// Check database connection
pool.connect()
  .then(() => console.log("Connected to PostgrSQL"))
  .catch(err => console.error('Connection error', err.stack));

  module.exports = pool