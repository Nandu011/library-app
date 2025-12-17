const express = require('express');
const pool = require("../config/db");
const {verifyAdmin} = require('../middleware/authMiddleware');
const router = express.Router();


//Admin Dashboard stats
router.get('/dashboard', verifyAdmin, async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT
            (SELECT COUNT(*) FROM books) AS total_books,
            (SELECT COUNT(*) FROM book_copies) AS total_copies,
            (SELECT COUNT(*) FROM book_copies WHERE is_available = true) AS available_copies,
            (SELECT COUNT(*) FROM book_copies WHERE is_available = false) AS borrowed_copies,
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM borrowed_books WHERE returned = false) AS active_borrows,
            (
            SELECT COUNT(*) FROM borrowed_books
            WHERE returned = false AND due_date < CURRENT_DATE ) AS overdue_books`);

            res.json(stats.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// Get overdue books (Admin)
router.get('/overdue', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
            bb.id AS borrow_id,
            u.name,
            u.email,
            u.mobile,
            b.title,
            bc.unique_code,
            bb.borrow_date,
            bb.due_date,
            CURRENT_DATE - bb.due_date AS overdue_days
            FROM borrowed_books bb
            JOIN users u ON bb.user_id = u.id
            JOIN book_copies bc ON bb.book_copy_id = bc.id
            JOIN books b ON bc.book_id = b.id
            WHERE bb.returned = false
            AND bb.due_date < CURRENT_DATE
            ORDER BY overdue_days DESC`);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT id, name, email, role, created_at
            FROM users ORDER BY id`
        );
        res.json(users.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});


// Get all borrowed books
router.get('/borrowed', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
            bb.id AS borrow_id,
            u.name AS user_name,
            u.email,
            u.mobile,
            b.title, 
            bc.unique_code,
            bb.borrow_date,
            bb.due_date,
            bb.returned,
            bb.return_date,
            CASE 
            WHEN bb.returned = false AND bb.due_date < CURRENT_DATE
            THEN true
            ELSE false
            END AS is_overdue
            FROM borrowed_books bb
            JOIN users u ON bb.user_id = u.id
            JOIN book_copies bc ON bb.book_copy_id = bc.id
            JOIN books b ON bc.book_id = b.id
            ORDER BY bb.borrow_date DESC
            `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

//Force return a book
router.put('/force-return/:borrowId', verifyAdmin, async (req, res) => {
    const { borrowId } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Get borrow record
        const borrowResult = await client.query(`
            SELECT book_copy_id
            FROM borrowed_books
            WHERE id = $1 AND returned = false`,
        [borrowId]);

        if (borrowResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({message: "Record not found or already returned"});
        }

        const bookCopyId = borrowResult.rows[0].book_copy_id;

        // Mark borrow as returned
        await client.query(`
            UPDATE borrowed_books
            SET returned = true, return_date = NOW()
            WHERE id = $1`,
        [borrowId]);

        // Mark copy available
        await client.query(`
            UPDATE book_copies
            SET is_available = true
            WHERE id = $1
            `, [bookCopyId]);

            await client.query('COMMIT');

            res.json({message: 'Book force-returned successfully'});


    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({message: 'Server error'});
    } finally {
        client.release();
    }
});

module.exports = router;