import React, { useState, useEffect } from 'react';
import { BarChart3, MessageSquare, Sparkles, Users, Settings, LogOut, Menu, X, Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Mock AI Analysis Function
const analyzeWithAI = async (feedbackItems) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const sentiments = ['positive', 'neutral', 'negative'];
  const categories = ['Feature Request', 'Bug Report', 'User Experience', 'Performance', 'Design'];
  
  return {
    summary: `Analyzed ${feedbackItems.length} feedback items. Key themes: ${categories.slice(0, 3).join(', ')}. Overall sentiment is trending ${sentiments[Math.floor(Math.random() * sentiments.length)]}.`,
    insights: [
      'Users are requesting mobile app improvements',
      'Performance issues mentioned in 15% of feedback',
      'High satisfaction with new dashboard design',
      'Integration requests with popular tools trending up'
    ],
    categorization: feedbackItems.map(item => ({
      ...item,
      category: categories[Math.floor(Math.random() * categories.length)],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
    }))
  };
};

// Authentication Component
const AuthScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'John Doe',
      email: formData.email,
      company: formData.company || 'My Company'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FeedbackHub</h1>
          <p className="text-gray-600">AI-Powered Feedback Management</p>
        </div>

        <div className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedback, setFeedback] = useState([
    { id: 1, title: 'Add dark mode', description: 'Would love to see a dark mode option', user: 'Sarah M.', date: '2024-12-14', status: 'open', votes: 24 },
    { id: 2, title: 'Mobile app needed', description: 'Please create a mobile version', user: 'Mike R.', date: '2024-12-13', status: 'in-progress', votes: 18 },
    { id: 3, title: 'Export to CSV broken', description: 'Getting error when exporting', user: 'Lisa K.', date: '2024-12-12', status: 'closed', votes: 5 },
  ]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewFeedback, setShowNewFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ title: '', description: '', user: '' });

  const handleAIAnalysis = async () => {
    setLoading(true);
    const insights = await analyzeWithAI(feedback);
    setAiInsights(insights);
    setLoading(false);
  };

  const handleAddFeedback = () => {
    if (newFeedback.title && newFeedback.description) {
      setFeedback([
        {
          id: feedback.length + 1,
          ...newFeedback,
          date: new Date().toISOString().split('T')[0],
          status: 'open',
          votes: 0
        },
        ...feedback
      ]);
      setNewFeedback({ title: '', description: '', user: '' });
      setShowNewFeedback(false);
    }
  };

  const stats = [
    { label: 'Total Feedback', value: feedback.length, icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Open Items', value: feedback.filter(f => f.status === 'open').length, icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'In Progress', value: feedback.filter(f => f.status === 'in-progress').length, icon: Clock, color: 'bg-purple-500' },
    { label: 'Resolved', value: feedback.filter(f => f.status === 'closed').length, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-indigo-600">FeedbackHub</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
            { id: 'insights', icon: Sparkles, label: 'AI Insights' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
                <div className="space-y-3">
                  {feedback.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.user} • {item.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'feedback' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">All Feedback</h3>
                <button
                  onClick={() => setShowNewFeedback(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Feedback
                </button>
              </div>

              {showNewFeedback && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">New Feedback</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Feedback title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={newFeedback.title}
                      onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                    />
                    <textarea
                      placeholder="Description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows="3"
                      value={newFeedback.description}
                      onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="User name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={newFeedback.user}
                      onChange={(e) => setNewFeedback({...newFeedback, user: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddFeedback}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setShowNewFeedback(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {feedback.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span>{item.user}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.votes} votes</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'insights' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                  <button
                    onClick={handleAIAnalysis}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {loading ? 'Analyzing...' : 'Generate Insights'}
                  </button>
                </div>

                {aiInsights ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Summary</h4>
                      <p className="text-indigo-700">{aiInsights.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                      <ul className="space-y-2">
                        {aiInsights.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Click "Generate Insights" to analyze your feedback with AI</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue={user.company}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <AuthScreen onLogin={setUser} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
};

export default App;