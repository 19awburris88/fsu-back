const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get all professors
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT p.*, d.name AS department_name FROM professors p LEFT JOIN departments d ON p.department_id = d.id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single professor
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT p.*, d.name AS department_name FROM professors p LEFT JOIN departments d ON p.department_id = d.id WHERE p.id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Professor not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add professor
router.post('/', authenticateToken, async (req, res) => {
    const { name, bio, profile_image_url, email, department_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO professors (name, bio, profile_image_url, email, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, bio, profile_image_url, email, department_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update professor
router.patch('/:id', authenticateToken, async (req, res) => {
    const { name, bio, profile_image_url, email, department_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE professors SET name = COALESCE($1, name), bio = COALESCE($2, bio), profile_image_url = COALESCE($3, profile_image_url), email = COALESCE($4, email), department_id = COALESCE($5, department_id) WHERE id = $6 RETURNING *',
            [name, bio, profile_image_url, email, department_id, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Professor not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete professor
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM professors WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Professor not found' });
        res.json({ message: 'Professor deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
