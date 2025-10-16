const express = require('express');
const pool = require('../config/db');
const { verifyAdmin, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new book (admin only)
router.post('/add', verifyAdmin, async (req, res) =>{
    const { title, author, synopsis, image_url, shelf_no } = req.body;
    try {
        const newBook = await pool.query(
            ` INSERT INTO books (title, author, sysnopsis, image_url, shelf_no) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, author, synopsis, image_url, shelf_no]
        );
        res.status(201).json({message: 'Book added', book: newBook.rows[0]});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

//Add a copy to existing book.
router.post('/:bookId/add-copy', verifyAdmin, async (req,res) => {
    const {bookId} = req.params;
    const {unique_code} = req.body;

    try{
        const copy = await pool.query(
            'INSERT INTO book_copies (book_id, unique_code) VALUES ($1, $2) RETURNING *',
            [bookId, unique_code]
        );

        res.status(201).json({message: "Copy added", copy: copy.rows[0]});

    } catch (err) {
        res.status(500).json({message: "Server error"});
    }
});



module.exports = router;