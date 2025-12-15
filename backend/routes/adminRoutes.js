const express = require('express');
const pool = require("../config/db");
const {verifyAdmin} = require('../middleware/authMiddleware');
const router = express.Router();

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

// Create new users (Admin only)

router.post("/users/add", verifyAdmin, async (req, res) => {
    const {name, mobile, email, password, role} = req.body;

    try {
        const exists = await pool.query(` SELECT id FROM users WHERE mobile=$1`, [mobile]);
        if (exists.rows.length > 0) {
            return res.status(400).json({message: "User with this mobile already exists"});
        }

        const newUser =  await pool.query(
            `INSERT INTO users (name, mobile, email, password, role)
            VALUES ($1,$2, $3, $4, $5)`,
            [name, mobile, email, password, role ?? "user"]
        );

        res.status(201).json({ message: "User created", user: newUser.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error"});
    }
});

// Get all borrowed books
router.get("/borrowed", verifyAdmin, async (req, res) => {
    try {
        const borrowed =  await pool.query(`
            SELECT bb.id, u.name AS username, u.mobile,
            b.title, c.unique_code,
            bb.borrowed_date, bb.return_date, bb.returned
            FROM borrowed_books bb
            JOIN users u ON bb.user_id = u.id
            JOIN book_copies c ON bb.copy_id = c.id
            JOIN books b ON c.book_id= b.id
            ORDER BY bb.borrowed_date DESC
            `);

            res.json(borrowed.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

//Force return a book
router.put("/force-return/:borrowId", verifyAdmin, async (req, res) => {
    const {borrowId} = req.params;

    try {
        //Mark as returned
        const updated = await pool.query(`
            UPDATE borrowed_books
            SET returned = TRUE, return_date = NOW()
            WHERE id = $1 AND returned = FALSE
            RETURNING copy_id`, 
        [borrowId]
    );

    if (updated.rows.length === 0) 
        return res.status(404).json({message: 'Record not found or already returned'});

    //Mark copy as available
    await pool.query(
        `UPDATE book_copies SET is_borrrowed =  FALSE WHERE id = $1`,
        [updated.rows[0].copy_id]
    );

    res.json({ message: "Book force-returned successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;