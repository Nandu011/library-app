const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {verifyUser, verifyAdmin} = require('../middleware/authMiddleware');

// Add a review for a specific book
router.post('/:book_id', verifyUser, async (req, res) => {
    const {book_id} = req.params;
    const { rating, comment} = req.boody;
    const user_id = req.user.id; 

    try {
        const result = await pool.query(
            `INSERT INTO review (user_id, book_id, rating, comment)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, book_id, rating, comment]
        );

        res.status(201).json({
            message: 'Review added successfully',
            review: result.rows[0],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

//Get all reviews for a specific book
router.get('/:book_id', async (req, res) => {
    const {book_id} = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.name AS reviewer_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.book_id = $1
            ORDER BY r.created_at DESC`,
            [book_id]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error'});
    }
});

// Delete a review (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    const {id} = req.params;

    try {
        await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.json({message: 'Review deleted successfully'});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;