const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  voteFeedback,
  addComment,
  getStatistics
} = require('../controllers/feedbackController');
const { protect, optionalAuth } = require('../middleware/auth');

// Statistics route (should come before :id routes)
router.get('/stats', protect, getStatistics);

// Main CRUD routes
router.route('/')
  .get(protect, getAllFeedback)
  .post(optionalAuth, createFeedback);

router.route('/:id')
  .get(protect, getFeedback)
  .patch(protect, updateFeedback)
  .delete(protect, deleteFeedback);

// Vote and comment routes
router.post('/:id/vote', protect, voteFeedback);
router.post('/:id/comment', protect, addComment);

module.exports = router;