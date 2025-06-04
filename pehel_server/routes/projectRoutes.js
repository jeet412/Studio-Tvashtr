// routes/projectroutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Search projects by title (minimum 3 characters)
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 3) return res.json([]);

    const regex = new RegExp(query, 'i'); // case-insensitive match
    const results = await Project.find({ title: regex });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
