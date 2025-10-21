const express = require('express'); // import express
const app = express(); // create express app
const PORT = 5000; // port for server to listen on
const bookRoutes = require('./routes/bookRoutes'); // Book Routes
const userRoute = require('./routes/userRoutes');
require('./config/db')// connect to DB


app.use(express.json()); // Middleware to parse JSON bodies

//Routes
app.use('/api/users', userRoute)
app.use('/api/borrow', require('./routes/borrowRoutes'));
app.get("/", (req, res) =>   res.send("Library app connected to PostgreSQL 🚀"));// Base Route


app.use('/api/books', bookRoutes)// Book Routes
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
