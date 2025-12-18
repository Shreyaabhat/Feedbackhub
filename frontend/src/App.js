import React, { useState, useEffect } from 'react';
import { BarChart3, MessageSquare, Sparkles, Users, Settings, LogOut, Menu, X, Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';

const STORAGE_KEYS = {
  USER: 'feedbackhub_user',
  FEEDBACK: 'feedbackhub_feedback',
  USERS: 'feedbackhub_users'
};

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

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }
};

const AuthScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', company: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    if (isSignUp && !formData.name) {
      setError('Name is required for sign up');
      return;
    }
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    if (isSignUp) {
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
        setError('User already exists with this email');
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company || 'My Company',
        role: users.length === 0 ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      storage.set(STORAGE_KEYS.USERS, users);
      storage.set(STORAGE_KEYS.USER, newUser);
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (!user) {
        setError('Invalid email or password');
        return;
      }
      storage.set(STORAGE_KEYS.USER, user);
      onLogin(user);
    }
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required={isSignUp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Acme Inc." value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="you@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewFeedback, setShowNewFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ title: '', description: '', user: '' });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [settings, setSettings] = useState(() => {
    const savedSettings = storage.get(`settings_${user.id}`) || {
      companyName: user.company,
      email: user.email,
      notifications: true,
      emailDigest: 'weekly',
      theme: 'light',
      language: 'en'
    };
    return savedSettings;
  });
  const [votedItems, setVotedItems] = useState(() => storage.get(`voted_${user.id}`) || []);

  useEffect(() => { loadFeedback(); }, []);

  useEffect(() => {
    let result = [...feedback];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.user.toLowerCase().includes(query));
    }
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }
    setFilteredFeedback(result);
  }, [searchQuery, filterStatus, feedback]);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const loadFeedback = () => {
    const savedFeedback = storage.get(STORAGE_KEYS.FEEDBACK);
    if (savedFeedback && savedFeedback.length > 0) {
      setFeedback(savedFeedback);
      setFilteredFeedback(savedFeedback);
    } else {
      const initialFeedback = [
        { id: '1', title: 'Add dark mode', description: 'Would love to see a dark mode option', user: 'Sarah M.', userId: 'sample1', date: '2024-12-14', status: 'open', votes: 24 },
        { id: '2', title: 'Mobile app needed', description: 'Please create a mobile version', user: 'Mike R.', userId: 'sample2', date: '2024-12-13', status: 'in-progress', votes: 18 },
        { id: '3', title: 'Export to CSV broken', description: 'Getting error when exporting', user: 'Lisa K.', userId: 'sample3', date: '2024-12-12', status: 'closed', votes: 5 },
      ];
      setFeedback(initialFeedback);
      setFilteredFeedback(initialFeedback);
      storage.set(STORAGE_KEYS.FEEDBACK, initialFeedback);
    }
  };

  const saveFeedback = (updatedFeedback) => {
    storage.set(STORAGE_KEYS.FEEDBACK, updatedFeedback);
    setFeedback(updatedFeedback);
  };

  const handleAIAnalysis = async () => {
    setLoading(true);
    const insights = await analyzeWithAI(feedback);
    setAiInsights(insights);
    setLoading(false);
  };

  const handleAddFeedback = () => {
    if (!newFeedback.title || !newFeedback.description) {
      alert('Please fill in title and description');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      title: newFeedback.title,
      description: newFeedback.description,
      user: newFeedback.user || user.name,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
      votes: 0
    };
    const updatedFeedback = [newItem, ...feedback];
    saveFeedback(updatedFeedback);
    setNewFeedback({ title: '', description: '', user: '' });
    setShowNewFeedback(false);
  };

  const handleEditFeedback = (item) => {
    setEditingFeedback({ id: item.id, title: item.title, description: item.description, user: item.user });
  };

  const handleSaveEdit = () => {
    if (!editingFeedback.title || !editingFeedback.description) {
      alert('Please fill in title and description');
      return;
    }
    const updatedFeedback = feedback.map(item => item.id === editingFeedback.id ? { ...item, title: editingFeedback.title, description: editingFeedback.description, user: editingFeedback.user } : item);
    saveFeedback(updatedFeedback);
    setEditingFeedback(null);
  };

  const handleDeleteFeedback = (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      const updatedFeedback = feedback.filter(item => item.id !== id);
      saveFeedback(updatedFeedback);
    }
  };

  const handleVote = (id) => {
    if (votedItems.includes(id)) {
      alert('You have already voted for this feedback!');
      return;
    }
    const updatedFeedback = feedback.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item);
    saveFeedback(updatedFeedback);
    const newVotedItems = [...votedItems, id];
    setVotedItems(newVotedItems);
    storage.set(`voted_${user.id}`, newVotedItems);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedFeedback = feedback.map(item => item.id === id ? { ...item, status: newStatus } : item);
    saveFeedback(updatedFeedback);
  };

  const handleSaveSettings = () => {
    const updatedUser = { ...user, company: settings.companyName, email: settings.email };
    storage.set(STORAGE_KEYS.USER, updatedUser);
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    storage.set(STORAGE_KEYS.USERS, updatedUsers);
    storage.set(`settings_${user.id}`, settings);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    storage.remove(STORAGE_KEYS.USER);
    onLogout();
  };

  const stats = [
    { label: 'Total Feedback', value: feedback.length, icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Open Items', value: feedback.filter(f => f.status === 'open').length, icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'In Progress', value: feedback.filter(f => f.status === 'in-progress').length, icon: Clock, color: 'bg-purple-500' },
    { label: 'Resolved', value: feedback.filter(f => f.status === 'closed').length, icon: CheckCircle, color: 'bg-green-500' },
  ];

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">FeedbackHub</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5 dark:text-gray-300" /> : <Menu className="w-5 h-5 dark:text-gray-300" />}
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
            <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeView === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.name} {isAdmin && <span className="text-indigo-600 dark:text-indigo-400">(Admin)</span>}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSearch(!showSearch)} className={`p-2 rounded-lg transition-colors ${showSearch ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}>
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setShowFilter(!showFilter)} className={`p-2 rounded-lg transition-colors ${showFilter ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'}`}>
                <Filter className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          {showSearch && (
            <div className="mt-4">
              <input type="text" placeholder="Search feedback by title, description, or user..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          )}
          {showFilter && (
            <div className="mt-4">
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="w-6 h-6 text-white" /></div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Feedback</h3>
                <div className="space-y-3">
                  {feedback.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.user} • {item.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : item.status === 'in-progress' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{filteredFeedback.length} Feedback Items{searchQuery && ` (filtered by search)`}{filterStatus !== 'all' && ` (${filterStatus})`}</h3>
                <button onClick={() => setShowNewFeedback(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />Add Feedback
                </button>
              </div>
              {showNewFeedback && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">New Feedback</h4>
                  <div className="space-y-4">
                    <input type="text" placeholder="Feedback title" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={newFeedback.title} onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})} />
                    <textarea placeholder="Description" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="3" value={newFeedback.description} onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})} />
                    <input type="text" placeholder="User name (optional)" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={newFeedback.user} onChange={(e) => setNewFeedback({...newFeedback, user: e.target.value})} />
                    <div className="flex gap-2">
                      <button onClick={handleAddFeedback} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit</button>
                      <button onClick={() => setShowNewFeedback(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                      {editingFeedback && editingFeedback.id === item.id ? (
                        <div className="space-y-4">
                          <input type="text" placeholder="Feedback title" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" value={editingFeedback.title} onChange={(e) => setEditingFeedback({...editingFeedback, title: e.target.value})} />
                          <textarea placeholder="Description" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="3" value={editingFeedback.description} onChange={(e) => setEditingFeedback({...editingFeedback, description: e.target.value})} />
                          <div className="flex gap-2">
                            <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
                            <button onClick={() => setEditingFeedback(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{item.user}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                              <span>•</span>
                              <button onClick={() => handleVote(item.id)} disabled={votedItems.includes(item.id)} className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors font-medium ${votedItems.includes(item.id) ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}`} title={votedItems.includes(item.id) ? 'You already voted' : 'Vote for this feedback'}>
                                <TrendingUp className="w-3 h-3" />{item.votes} votes
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {isAdmin ? (
                              <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${item.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : item.status === 'in-progress' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="closed">Closed</option>
                              </select>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : item.status === 'in-progress' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>{item.status}</span>
                            )}
                            <button onClick={() => handleEditFeedback(item)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit feedback">
                              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button onClick={() => handleDeleteFeedback(item.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete feedback">
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No feedback items found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'insights' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Insights</h3>
                  <button onClick={handleAIAnalysis} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    <Sparkles className="w-4 h-4" />{loading ? 'Analyzing...' : 'Generate Insights'}
                  </button>
                </div>
                {aiInsights ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-400 mb-2">Summary</h4>
                      <p className="text-indigo-700 dark:text-indigo-300">{aiInsights.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Insights</h4>
                      <ul className="space-y-2">
                        {aiInsights.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Click "Generate Insights" to analyze your feedback with AI</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'users' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.company}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full">{isAdmin ? 'Admin' : 'User'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Feedback Created</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{feedback.filter(f => f.userId === user.id).length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(storage.get(STORAGE_KEYS.USERS) || []).length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Since</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">All Registered Users</h4>
                    <div className="space-y-2">
                      {(storage.get(STORAGE_KEYS.USERS) || []).map((u, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">{u.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{u.company}</span>
                            {u.role === 'admin' && (<span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">Admin</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Profile Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                      <input type="text" value={settings.companyName} onChange={(e) => setSettings({...settings, companyName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">Notification Preferences</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about feedback activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({...settings, notifications: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Digest Frequency</label>
                      <select value={settings.emailDigest} onChange={(e) => setSettings({...settings, emailDigest: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">Appearance</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                      <select value={settings.theme} onChange={(e) => setSettings({...settings, theme: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                      <select value={settings.language} onChange={(e) => setSettings({...settings, language: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSaveSettings} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = storage.get(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

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