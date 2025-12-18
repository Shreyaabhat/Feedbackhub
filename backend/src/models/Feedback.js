const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  user: {
    type: String,
    required: [true, 'Please provide a user name'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional - can be anonymous feedback
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed', 'archived'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'Feature Request',
      'Bug Report',
      'User Experience',
      'Performance',
      'Design',
      'Documentation',
      'Security',
      'Other'
    ],
    default: 'Other'
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  votedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'mixed'],
    default: 'neutral'
  },
  aiAnalysis: {
    summary: String,
    keywords: [String],
    suggestedCategory: String,
    confidenceScore: Number,
    analyzedAt: Date
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  metadata: {
    browser: String,
    os: String,
    device: String,
    url: String,
    userAgent: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  archivedAt: Date
}, {
  timestamps: true
});

// Virtual for formatted date
FeedbackSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Method to update status
FeedbackSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'closed') {
    this.resolvedAt = new Date();
  }
  
  if (newStatus === 'archived') {
    this.archivedAt = new Date();
  }
  
  return this.save();
};

// Method to add vote
FeedbackSchema.methods.addVote = function(userId) {
  if (!this.votedBy.includes(userId)) {
    this.votedBy.push(userId);
    this.votes += 1;
  }
  return this.save();
};

// Method to remove vote
FeedbackSchema.methods.removeVote = function(userId) {
  const index = this.votedBy.indexOf(userId);
  if (index > -1) {
    this.votedBy.splice(index, 1);
    this.votes -= 1;
  }
  return this.save();
};

// Method to add comment
FeedbackSchema.methods.addComment = function(userId, userName, text) {
  this.comments.push({
    user: userId,
    userName,
    text,
    createdAt: new Date()
  });
  return this.save();
};

// Static method to get statistics
FeedbackSchema.statics.getStatistics = async function(userId) {
  const stats = await this.aggregate([
    ...(userId ? [{ $match: { userId: mongoose.Types.ObjectId(userId) } }] : []),
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await this.countDocuments(userId ? { userId } : {});
  
  return {
    total,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

// Indexes for better query performance
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ votes: -1 });
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Feedback', FeedbackSchema);