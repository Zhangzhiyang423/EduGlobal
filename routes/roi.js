const express = require('express');
const router = express.Router();
const { calculateROI } = require('../controllers/roiController');

// POST /api/roi/calculate
router.post('/calculate', calculateROI);

module.exports = router;
