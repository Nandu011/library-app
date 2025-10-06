const express = require('express'); // import express
const { Pool } = require('pg'); // PostgreSQL client
const app = express(); // create express app
const PORT = 5000; // port for server to listen on

app.use(express.json()); // Middleware to parse JSON bodies

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

// sample books
// const books = [
//     { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
//     { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
//     { id: 3, title: "1984", author: "George Orwell", available: true },
// ];

// Route
app.get("/", (req, res) => {
  res.send("Library app connected to PostgreSQL 🚀");
});

// Get all books
app.get('/books', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
      res.json(result.rows);
    }
    catch(err) {
      console.error(err);
      res.status(500).json({message:'Database error'});
    }

});

// Get a single book by id
// app.get('/books/:id', (req, res) =>{
//   const bookId = parseInt(req.params.id);
//   const book = books.find(b => b.id ===bookId);

//   if (book){
//     res.json(book);
//   }else{
//     res.status(404).json({message: "Book not found"})
//   }
// });


// Add new book
app.post('/books', async (req, res) =>  {
  const {title, author, available} = req.body;
  try{
    const result = await pool.query(
      'INSERT INTO BOOKS (title, author, available) VALUES ($1, $2, $3) RETURNING *',
      [title, author, available ?? true]
    );
    res.status(201).json(result.rows[0]);
  }catch (err){
    console.error(err);
    res.status(500).json({message: 'Failed to add book'})
  }
  
});

// Update book
app.put('/books/:id', async (req, res) =>{
  const { id } = req.params;
  const { title, author, available } = req.body;
  try{
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *',
      [title, author, available, id]
    );
    if (result.rowCount === 0) return res.status(404).json({message: 'Book not found'});
    res.json(result.rows[0]);
  }catch (err){
    console.error(err);
    res.status(500).json({message: 'Update failed'});
  }
});

// Delete book
app.delete('/books/:id', async (req, res) =>{
  const {id} = req.params;
  try{
    const result = await pool.query(' DELETE FROM books WHERE id=$1', [id]);
    if(result.rowCount === 0) return res.status(404).json({message: "Book not found"});
    res.json({message: 'Book deleted successfully'});
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Delete failed'})
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
