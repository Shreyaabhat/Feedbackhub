const express = require('express');
const router = express.Router();
const { analyzeFeedback, categorizeSingle, getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes are protected
router.post('/analyze', protect, analyzeFeedback);
router.post('/categorize/:id', protect, categorizeSingle);
router.get('/insights', protect, getInsights);

module.exports = router;