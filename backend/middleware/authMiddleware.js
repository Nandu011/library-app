const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Attach user data to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

function verifyAdmin(req, res, next) {
    verifyUser(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
        next();
    });
}

module.exports = { verifyUser, verifyAdmin };
