const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { 
      status, 
      category, 
      priority, 
      sort = '-createdAt', 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const feedback = await Feedback.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedback.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: feedback
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email company')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res, next) => {
  try {
    const { title, description, user, category, priority, tags } = req.body;

    const feedback = await Feedback.create({
      title,
      description,
      user: user || req.user?.name || 'Anonymous',
      userId: req.user?.id,
      category,
      priority,
      tags,
      status: 'open'
    });

    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: feedback
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback
// @route   PATCH /api/feedback/:id
// @access  Private
exports.updateFeedback = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, assignedTo } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Update fields
    if (title) feedback.title = title;
    if (description) feedback.description = description;
    if (category) feedback.category = category;
    if (priority) feedback.priority = priority;
    if (assignedTo) feedback.assignedTo = assignedTo;
    
    if (status) {
      feedback.status = status;
      if (status === 'closed') {
        feedback.resolvedAt = new Date();
      }
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Vote on feedback
// @route   POST /api/feedback/:id/vote
// @access  Private
exports.voteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const userId = req.user.id;
    const hasVoted = feedback.votedBy.includes(userId);

    if (hasVoted) {
      await feedback.removeVote(userId);
    } else {
      await feedback.addVote(userId);
    }

    res.status(200).json({
      success: true,
      message: hasVoted ? 'Vote removed' : 'Vote added',
      data: {
        votes: feedback.votes,
        hasVoted: !hasVoted
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to feedback
// @route   POST /api/feedback/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.addComment(req.user.id, req.user.name, text);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: feedback
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await Feedback.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
};