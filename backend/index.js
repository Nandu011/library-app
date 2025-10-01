const express = require('express'); // import express
const app = express(); // create express app
const PORT = 5000; // port for server to listen on

// sample books
const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
    { id: 3, title: "1984", author: "George Orwell", available: true },
];

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, Library App! 🚀");
});

// Books route
app.get('/books', (req, res) => {
    res.json(books)
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
