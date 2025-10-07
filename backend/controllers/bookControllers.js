const pool = require('../config/db');

// Get all books
exports.getBooks =  async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
      res.json(result.rows);
    }
    catch(err) {
      console.error(err);
      res.status(500).json({message:'Database error'});
    }

};

// Get a single book by id
exports.getBookById = async (req, res) =>{
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if(result.rowCount === 0) return res.status(404).json({message: "Book not found"});
        res.json(result.rows[0]);
    } catch (err){
        console.error(err);
        res.status(500).json({message: "Error fetching book"});
    }
}

// Add new book
exports.addBook = async (req, res) =>  {
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
  
};

// Update book
exports.updateBook =  async (req, res) =>{
  const { id } = req.params;
  const { title, author, available } = req.body;
  try{
    // Fetch existing book
    const existing = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if(existing.rowCount === 0) return res.status(404).json({message: 'Book not found'});

    const oldBook = existing.rows[0];

    const updateTitle = title ?? oldBook.title;
    const updateAuthor = author ?? oldBook.author;
    const updateAvailable = available ?? oldBook.available;

    const result = await pool.query('UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *',
      [updateTitle, updateAuthor, updateAvailable, id]
    );
    res.json(result.rows[0]);
    
  }catch (err){
    console.error(err);
    res.status(500).json({message: 'Update failed'});
  }
};

// Delete book
exports.deleteBook = async (req, res) =>{
  const {id} = req.params;
  try{
    const result = await pool.query(' DELETE FROM books WHERE id=$1', [id]);
    if(result.rowCount === 0) return res.status(404).json({message: "Book not found"});
    res.json({message: 'Book deleted successfully'});
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Delete failed'})
  }
};