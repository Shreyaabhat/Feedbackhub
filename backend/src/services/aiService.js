const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Analyze feedback items using Claude AI
   * @param {Array} feedbackItems - Array of feedback objects
   * @returns {Object} Analysis results
   */
  async analyzeFeedback(feedbackItems) {
    try {
      // Prepare feedback data for analysis
      const feedbackText = feedbackItems.map((item, index) => 
        `Feedback ${index + 1}:
Title: ${item.title}
Description: ${item.description}
Status: ${item.status}
Votes: ${item.votes}
---`
      ).join('\n\n');

      const prompt = `You are an AI assistant analyzing user feedback for a product management platform. 

Please analyze the following feedback items and provide:
1. A brief overall summary (2-3 sentences)
2. Top 5 key insights or patterns
3. Sentiment analysis for each feedback item (positive, neutral, negative, mixed)
4. Suggested categories for each item (Feature Request, Bug Report, UX, Performance, Design, Documentation, Security, Other)
5. Priority recommendations

Feedback to analyze:
${feedbackText}

Please respond in JSON format with this structure:
{
  "summary": "Overall summary here",
  "insights": ["insight 1", "insight 2", ...],
  "sentimentDistribution": {
    "positive": count,
    "neutral": count,
    "negative": count,
    "mixed": count
  },
  "itemAnalysis": [
    {
      "feedbackId": index,
      "sentiment": "positive|neutral|negative|mixed",
      "suggestedCategory": "category name",
      "priority": "low|medium|high|critical",
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Parse the response
      const responseText = message.content[0].text;
      
      // Try to extract JSON from the response
      let analysisResult;
      try {
        // Remove markdown code blocks if present
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                         responseText.match(/```\n([\s\S]*?)\n```/);
        
        const jsonText = jsonMatch ? jsonMatch[1] : responseText;
        analysisResult = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        // Fallback to a basic analysis structure
        analysisResult = {
          summary: responseText.substring(0, 300),
          insights: ['AI analysis completed but response format was unexpected'],
          sentimentDistribution: { positive: 0, neutral: 0, negative: 0, mixed: 0 },
          itemAnalysis: [],
          recommendations: []
        };
      }

      return {
        success: true,
        data: analysisResult,
        analyzedAt: new Date(),
        itemCount: feedbackItems.length
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Categorize a single feedback item
   * @param {Object} feedback - Feedback object
   * @returns {Object} Categorization result
   */
  async categorizeFeedback(feedback) {
    try {
      const prompt = `Analyze this feedback and categorize it:

Title: ${feedback.title}
Description: ${feedback.description}

Respond with JSON containing:
- category: one of (Feature Request, Bug Report, User Experience, Performance, Design, Documentation, Security, Other)
- sentiment: one of (positive, neutral, negative, mixed)
- priority: one of (low, medium, high, critical)
- keywords: array of relevant keywords (max 5)
- summary: brief one-sentence summary

Format: {"category": "", "sentiment": "", "priority": "", "keywords": [], "summary": ""}`;

      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Categorization Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate insights from feedback trends
   * @param {Object} stats - Feedback statistics
   * @returns {Object} Insights
   */
  async generateInsights(stats) {
    try {
      const prompt = `Based on these feedback statistics, provide 3-5 actionable insights:

Total Feedback: ${stats.total}
Open: ${stats.byStatus.open || 0}
In Progress: ${stats.byStatus['in-progress'] || 0}
Closed: ${stats.byStatus.closed || 0}

Provide insights in JSON format:
{
  "insights": ["insight 1", "insight 2", ...],
  "trends": ["trend 1", "trend 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { insights: [], trends: [], recommendations: [] };

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Insights Generation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mock AI analysis (for development without API key)
   * @param {Array} feedbackItems - Array of feedback objects
   * @returns {Object} Mock analysis results
   */
  mockAnalyze(feedbackItems) {
    const sentiments = ['positive', 'neutral', 'negative', 'mixed'];
    const categories = ['Feature Request', 'Bug Report', 'User Experience', 'Performance', 'Design'];
    const priorities = ['low', 'medium', 'high', 'critical'];

    return {
      success: true,
      data: {
        summary: `Analyzed ${feedbackItems.length} feedback items. Most common themes: user experience improvements, feature requests, and bug reports. Overall sentiment is balanced with users showing engagement.`,
        insights: [
          'Users are actively requesting mobile app improvements',
          'Performance concerns mentioned in 15% of feedback',
          'High satisfaction with recent dashboard updates',
          'Integration capabilities are frequently requested',
          'Documentation needs improvement according to new users'
        ],
        sentimentDistribution: {
          positive: Math.floor(feedbackItems.length * 0.4),
          neutral: Math.floor(feedbackItems.length * 0.35),
          negative: Math.floor(feedbackItems.length * 0.15),
          mixed: Math.floor(feedbackItems.length * 0.1)
        },
        itemAnalysis: feedbackItems.map((item, index) => ({
          feedbackId: index,
          sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
          suggestedCategory: categories[Math.floor(Math.random() * categories.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          keywords: item.title.split(' ').slice(0, 3)
        })),
        recommendations: [
          'Prioritize mobile app development based on user demand',
          'Address performance issues in high-traffic areas',
          'Continue enhancing dashboard features',
          'Consider building API integrations with popular tools',
          'Expand documentation for new user onboarding'
        ]
      },
      analyzedAt: new Date(),
      itemCount: feedbackItems.length,
      mock: true
    };
  }
}

module.exports = new AIService();