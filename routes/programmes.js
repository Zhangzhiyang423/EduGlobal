const express = require('express');
const router = express.Router();
const { getProgrammes } = require('../controllers/programmesController');

// GET /api/programmes (mounted at /api, so use '/' not '/programmes')
router.get('/', getProgrammes);

module.exports = router;
