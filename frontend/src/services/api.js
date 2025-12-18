import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  logout: () => api.post('/auth/logout'),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  getOne: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.patch(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
  vote: (id) => api.post(`/feedback/${id}/vote`),
  addComment: (id, data) => api.post(`/feedback/${id}/comment`, data),
  getStats: () => api.get('/feedback/stats'),
};

// AI API
export const aiAPI = {
  analyze: (data) => api.post('/ai/analyze', data),
  categorize: (id) => api.post(`/ai/categorize/${id}`),
  getInsights: () => api.get('/ai/insights'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
};

export default api;