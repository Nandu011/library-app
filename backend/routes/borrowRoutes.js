const express = require('express');
const pool =  require('../config/db');
const {verifyUser} = require('../middleware/authMiddleware');
const router = express.Router();

// Borrow a book
router.post('/borrow', verifyUser, async (requestAnimationFrame, res) => {
    const { book_title } = requestAnimationFrame.body;
    const userId = req.user.id;

    try {
        const borrow = await pool.query(
            'INSERT INTO borrowed_books (user_id, book_title) VALUES ($1, $2) RETURNING *' [userId, book_title]
        );
        res.status(201).json({message: 'Book borrowed successfully', borrow: borrow.rows[0]});
    } catch (err) {
        console.error(err);
        res.status.json({message: 'Server error'});
    }
});

// Return a book
router.put('/return/:id', verifyUser, async (res,req) => {
    const {id} = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'UPDATE borrowed_books SET returned = true, return_date = NOW() WHERE id = $1 AND user_)id = $2 RETURNING *',
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Book not found or not borrowed by this user'});
        }

        res.json({message: 'Book returned successfully', returned: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// View borrowed books for logged in user
router.get('/mybooks', verifyUser, async (res, req) => {
    const user_id = req.user.id;

    try {
        const books = pool.query(
            'SELECT * FROM borrowed_books WHERE id = $1 ORDER BY borrowed_date DESC',
            [user_id]
        );

        res.json(books.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;