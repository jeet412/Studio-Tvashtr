const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects (with optional category and subcategory filters)
router.get('/', async (req, res) => {
  try {
    const { category, subcategory } = req.query;

    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (subcategory && subcategory !== 'All') {
      filter.subcategory = subcategory;
    }

    const projects = await Project.find(filter);
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// SEARCH projects by title (case-insensitive, min 3 chars)
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 3) return res.json([]);

    const regex = new RegExp(query, 'i'); // case-insensitive
    const results = await Project.find({ title: regex });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch 3 projects per major category
router.get('/category-preview', async (req, res) => {
  try {
    const categories = ['Architecture', 'Urban Planning', 'Interior', 'Landscape'];
    const previews = {};

    for (const category of categories) {
      const projects = await Project.find({ category }).limit(3);
      previews[category] = projects;
    }

    res.json(previews);
  } catch (err) {
    console.error('Error fetching category previews:', err);
    res.status(500).json({ error: 'Failed to fetch category previews' });
  }
});

module.exports = router;
