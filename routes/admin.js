const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Configure rate limiting
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

// Store valid tokens
let validTokens = [];

// Register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO admins (username, password, email) VALUES ($1, $2, $3) RETURNING id, username',
            [username, hashedPassword, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login route with rate limiting
router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        const admin = result.rows[0];

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in the validTokens array
        validTokens.push(token);

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout route to invalidate the token
router.post('/logout', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(400).json({ message: 'Token not provided' });
    }

    // Remove the token from the validTokens array
    validTokens = validTokens.filter(validToken => validToken !== token);

    res.json({ message: 'Logged out successfully' });
});

// Middleware to check if the token is valid
const isValidToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    if (!validTokens.includes(token)) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // If the token is invalid, remove it from the validTokens array
            validTokens = validTokens.filter(validToken => validToken !== token);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = router;
