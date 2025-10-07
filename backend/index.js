const express = require('express'); // import express
const app = express(); // create express app
const PORT = 5000; // port for server to listen on
const bookRoutes = require('./routes/bookRoutes'); // Book Routes
require('./config/db')// connect to DB

app.use(express.json()); // Middleware to parse JSON bodies


// Base Route
app.get("/", (req, res) =>   res.send("Library app connected to PostgreSQL 🚀"));

// Book Routes
app.use('/books', bookRoutes)
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
