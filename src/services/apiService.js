import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// User endpoints
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadKYC: (formData) => api.post('/users/kyc', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getBalanceHistory: (params) => api.get('/users/balance/history', { params }),
};

// Transaction endpoints
export const transactionService = {
  getDeposits: (params) => api.get('/transactions/deposits', { params }),
  getWithdrawals: (params) => api.get('/transactions/withdrawals', { params }),
  createDeposit: (data) => api.post('/transactions/deposit', data),
  createWithdrawal: (data) => api.post('/transactions/withdraw', data),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  cancelTransaction: (id) => api.post(`/transactions/${id}/cancel`),
};

// Investment endpoints
export const investmentService = {
  getInvestments: () => api.get('/investments'),
  createInvestment: (data) => api.post('/investments', data),
  getInvestment: (id) => api.get(`/investments/${id}`),
  withdrawInvestment: (id) => api.post(`/investments/${id}/withdraw`),
  getPlans: () => api.get('/investments/plans'),
};

// Trading endpoints
export const tradingService = {
  getOrders: (params) => api.get('/trading/orders', { params }),
  createOrder: (data) => api.post('/trading/orders', data),
  cancelOrder: (id) => api.delete(`/trading/orders/${id}`),
  getOrderbook: (symbol) => api.get(`/market/orderbook/${symbol}`),
  getAccountInfo: () => api.get('/trading/account'),
  getPositions: () => api.get('/trading/positions'),
};

// Admin endpoints
export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id, reason) => api.post(`/admin/withdrawals/${id}/reject`, { reason }),
  getSystemStats: () => api.get('/admin/stats'),
  getKYCRequests: () => api.get('/admin/kyc/pending'),
  approveKYC: (userId, docType) => api.post(`/admin/kyc/${userId}/approve`, { docType }),
  rejectKYC: (userId, docType, reason) => api.post(`/admin/kyc/${userId}/reject`, { docType, reason }),
};

// Add proxy functions for external APIs
export const proxyService = {
  async getCoinGeckoData(endpoint, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/api/market/proxy/coingecko/${endpoint}${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching CoinGecko data:', error);
      throw error;
    }
  },
};

export default api;
