const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify any logged-in user

function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message: 'No token provided'});
    
    const token = authHeader.splice(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token "});
    }
}

// Middleware to verify admin only

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({message: 'No token provided'});

    const token = authHeader.splice(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({message: "Access denied: Admins only"});
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}

module.exports = { verifyUser, verifyAdmin};