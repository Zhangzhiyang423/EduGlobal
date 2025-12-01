const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const fs = require('fs');
const path = require('path');

// Helper: Load programme code-to-name mapping from CSV
function loadProgrammeMap() {
  const csvPath = path.join(__dirname, '../data/ProgramRequirements_names_skeleton_v2.csv');
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split('\n');
  const map = {};
  lines.slice(1).forEach(line => {
    const cols = line.split(',');
    if (cols.length > 1) {
      map[cols[0]] = cols[1];
    }
  });
  return map;
}
const programmeMap = loadProgrammeMap();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ created_at: -1 });
    // Attach programme_name to each review
    const reviewsWithNames = reviews.map(r => ({
      ...r.toObject(),
      programme_name: programmeMap[r.programme_code] || r.programme_code
    }));
    res.json(reviewsWithNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post('/', async (req, res) => {
  const { programme_code, aspect, rating, comment_title, comment_text, user_id } = req.body;
  if (!programme_code || !aspect || !rating || !comment_title || !comment_text || !user_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const review = new Review({
      programme_code,
      aspect,
      rating,
      comment_title,
      comment_text,
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
