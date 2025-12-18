const Feedback = require('../models/Feedback');
const aiService = require('../services/aiService');

// @desc    Analyze multiple feedback items
// @route   POST /api/ai/analyze
// @access  Private
exports.analyzeFeedback = async (req, res, next) => {
  try {
    const { feedbackIds } = req.body;

    let feedbackItems;

    if (feedbackIds && feedbackIds.length > 0) {
      // Analyze specific feedback items
      feedbackItems = await Feedback.find({ _id: { $in: feedbackIds } });
    } else {
      // Analyze all recent feedback (last 50 items)
      feedbackItems = await Feedback.find()
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (feedbackItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No feedback items found to analyze'
      });
    }

    // Check if API key is available, otherwise use mock
    const useMock = !process.env.ANTHROPIC_API_KEY;
    
    let analysis;
    if (useMock) {
      console.log('Using mock AI analysis (no API key configured)');
      analysis = aiService.mockAnalyze(feedbackItems);
    } else {
      analysis = await aiService.analyzeFeedback(feedbackItems);
    }

    // Update feedback items with AI analysis
    if (analysis.success && analysis.data.itemAnalysis) {
      for (let i = 0; i < feedbackItems.length && i < analysis.data.itemAnalysis.length; i++) {
        const item = feedbackItems[i];
        const itemAnalysis = analysis.data.itemAnalysis[i];
        
        item.aiAnalysis = {
          summary: analysis.data.summary,
          keywords: itemAnalysis.keywords || [],
          suggestedCategory: itemAnalysis.suggestedCategory,
          confidenceScore: 0.85,
          analyzedAt: new Date()
        };
        
        if (itemAnalysis.sentiment) {
          item.sentiment = itemAnalysis.sentiment;
        }
        
        await item.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysis.data,
      meta: {
        itemsAnalyzed: feedbackItems.length,
        analyzedAt: analysis.analyzedAt,
        mock: useMock
      }
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    next(error);
  }
};

// @desc    Categorize single feedback item
// @route   POST /api/ai/categorize/:id
// @access  Private
exports.categorizeSingle = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if API key is available
    const useMock = !process.env.ANTHROPIC_API_KEY;
    
    let result;
    if (useMock) {
      // Mock categorization
      const categories = ['Feature Request', 'Bug Report', 'User Experience', 'Performance', 'Design'];
      const sentiments = ['positive', 'neutral', 'negative', 'mixed'];
      const priorities = ['low', 'medium', 'high', 'critical'];
      
      result = {
        success: true,
        data: {
          category: categories[Math.floor(Math.random() * categories.length)],
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          keywords: feedback.title.split(' ').slice(0, 3),
          summary: `${feedback.title.substring(0, 50)}...`
        }
      };
    } else {
      result = await aiService.categorizeFeedback(feedback);
    }

    if (result.success && result.data) {
      // Update feedback with categorization
      feedback.category = result.data.category || feedback.category;
      feedback.sentiment = result.data.sentiment || feedback.sentiment;
      feedback.priority = result.data.priority || feedback.priority;
      
      feedback.aiAnalysis = {
        summary: result.data.summary,
        keywords: result.data.keywords || [],
        suggestedCategory: result.data.category,
        confidenceScore: 0.85,
        analyzedAt: new Date()
      };

      await feedback.save();
    }

    res.status(200).json({
      success: true,
      message: 'Categorization completed',
      data: result.data,
      meta: {
        mock: useMock
      }
    });

  } catch (error) {
    console.error('Categorization Error:', error);
    next(error);
  }
};

// @desc    Get AI-powered insights
// @route   GET /api/ai/insights
// @access  Private
exports.getInsights = async (req, res, next) => {
  try {
    // Get feedback statistics
    const stats = await Feedback.getStatistics();

    // Check if API key is available
    const useMock = !process.env.ANTHROPIC_API_KEY;
    
    let insights;
    if (useMock) {
      // Mock insights
      insights = {
        success: true,
        data: {
          insights: [
            'User engagement is trending upward this month',
            'Feature requests are the most common feedback type',
            'Response time to feedback has improved by 25%',
            'Mobile-related feedback has increased significantly',
            'User satisfaction scores are above average'
          ],
          trends: [
            'Increased focus on mobile experience',
            'Growing interest in API integrations',
            'Performance optimization requests rising'
          ],
          recommendations: [
            'Prioritize mobile app development',
            'Consider implementing requested integrations',
            'Address performance bottlenecks',
            'Maintain current response time standards',
            'Continue collecting detailed user feedback'
          ]
        }
      };
    } else {
      insights = await aiService.generateInsights(stats);
    }

    res.status(200).json({
      success: true,
      data: insights.data,
      stats: stats,
      meta: {
        generatedAt: new Date(),
        mock: useMock
      }
    });

  } catch (error) {
    console.error('Insights Error:', error);
    next(error);
  }
};