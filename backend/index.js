const express = require('express'); // import express
const app = express(); // create express app
const PORT = 5000; // port for server to listen on

app.use(express.json()); // Middleware to parse JSON bodies

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
    res.json(books);
});

// Get a single book by id
app.get('/books/:id', (req, res) =>{
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id ===bookId);

  if (book){
    res.json(book);
  }else{
    res.status(404).json({message: "Book not found"})
  }
});


// Add new book
app.post('/books', (req, res) =>  {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    available: req.body.available ?? true, // default true if not provided
  };

  books.push(newBook); // Add new array
  res.status(201).json(newBook); // return new book with status 201 (created)
});

// Update book
app.put('/books/:id', (req, res) =>{
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book){
    return res.status(404).json({message: 'Book not found'});
  }

  //Update only provided fields
  book.title = req.body.title ?? book.title;
  book.author = req.body.author ?? book.author;
  book.available = req.body.available ?? book.available;

  res.json({message: 'Book updated successfully', book})

});

// Delete book
app.delete('/books/:id', (req, res) =>{
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1){
    return res.status(404).json({message: 'Book not found'});
  }

  books.splice(bookIndex, 1);
  res.json({message: 'Book deleted successfully'});

});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
