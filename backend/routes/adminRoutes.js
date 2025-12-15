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
