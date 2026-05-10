import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Vocabulary API
export const vocabularyApi = {
  getAll: (params = {}) => api.get('/vocabulary', { params }),
  getById: (id) => api.get(`/vocabulary/${id}`),
  create: (data) => api.post('/vocabulary', data),
  update: (id, data) => api.put(`/vocabulary/${id}`, data),
  delete: (id) => api.delete(`/vocabulary/${id}`),
};

// Progress API
export const progressApi = {
  getBySession: (sessionId, params = {}) => api.get(`/progress/${sessionId}`, { params }),
  getSummary: (sessionId) => api.get(`/progress/${sessionId}/summary`),
  recordAnswer: (data) => api.post('/progress', data),
  clearProgress: (sessionId) => api.delete(`/progress/${sessionId}`),
};

export default api;
