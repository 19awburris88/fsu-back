const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM departments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single department with faculty
router.get('/:id', async (req, res) => {
    try {
        const deptResult = await pool.query('SELECT * FROM departments WHERE id = $1', [req.params.id]);
        if (deptResult.rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        const profResult = await pool.query('SELECT * FROM professors WHERE department_id = $1', [req.params.id]);
        res.json({ ...deptResult.rows[0], professors: profResult.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add department (protected)
router.post('/', authenticateToken, async (req, res) => {
    const { name, description, image_url, contact_info } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO departments (name, description, image_url, contact_info) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, image_url, contact_info]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update department (protected)
router.patch('/:id', authenticateToken, async (req, res) => {
    const { name, description, image_url, contact_info } = req.body;
    try {
        const result = await pool.query(
            'UPDATE departments SET name = COALESCE($1, name), description = COALESCE($2, description), image_url = COALESCE($3, image_url), contact_info = COALESCE($4, contact_info) WHERE id = $5 RETURNING *',
            [name, description, image_url, contact_info, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete department (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Department not found' });
        res.json({ message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
