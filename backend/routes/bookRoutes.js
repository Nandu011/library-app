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

module.exports = router;