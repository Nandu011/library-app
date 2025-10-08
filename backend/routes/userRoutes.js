const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '2h'}
        );
        res.json({message: 'Login successful', token, role: user.rows[0],role});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

// Middleware to verify admin
function verifyAdmin(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({message: 'No token provided'});

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin'){
            return res.status(403).json({message: 'Access denied: Admins only'});
        }
        req.user = decoded;
        next();
    } catch (err){
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}