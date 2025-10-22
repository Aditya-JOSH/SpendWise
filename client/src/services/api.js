import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const baseAuthApi = axios.create({
  baseURL: process.env.REACT_BASE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => api.get('/budgets'),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (budgetData) => api.post('/budgets', budgetData),
  update: (id, budgetData) => api.put(`/budgets/${id}`, budgetData),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getWithoutBudget: (params = {}) => api.get('/transactions', { params }),
  getAll: (budgetId, params = {}) => api.get(`/budgets/${budgetId}/transactions`, { params }),
  getById: (budgetId, transactionId) => api.get(`/budgets/${budgetId}/transactions/${transactionId}`),
  create: (budgetId, transactionData) => api.post(`/budgets/${budgetId}/transactions`, transactionData),
  update: (budgetId, transactionId, transactionData) => 
    api.put(`/budgets/${budgetId}/transactions/${transactionId}`, transactionData),
  deleteWithoutBudget: (transactionId) => api.delete(`/transactions/${transactionId}`),
  delete: (budgetId, transactionId) => api.delete(`/budgets/${budgetId}/transactions/${transactionId}`),
};

// Analytics API
export const analyticsAPI = {
  getSpendingTrend: (params = {}) => api.get('/analytics/spending-trend', { params }),
  getCategoryBreakdown: (params = {}) => api.get('/analytics/category-breakdown', { params }),
  getBudgetPerformance: (params = {}) => api.get('/analytics/budget-performance', { params }),
  getMonthlyComparison: (params = {}) => api.get('/analytics/monthly-comparison', { params }),
};

export default api;
