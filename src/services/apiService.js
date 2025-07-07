import axios from "axios";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the real token, not any mock tokens
const getValidAuthToken = () => {
  const adminToken = localStorage.getItem("ffb_admin_token");
  if (adminToken && !adminToken.startsWith("mock_token_")) {
    return adminToken;
  }

  const token = localStorage.getItem("ffb_auth_token");
  if (token && token.startsWith("mock_token_")) {
    console.log("Found a mock token - this will never work with the backend");
    return null;
  }

  return token;
};

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = getValidAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      const publicEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/market/prices",
        "/dashboard",
      ];

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url.includes(endpoint),
      );

      if (isPublicEndpoint) {
        return config;
      }

      console.log(`No valid auth token available for request to ${config.url}`);
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Not authenticated with a valid token" },
        },
        isAuthError: true,
      });
    } catch (error) {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.isAuthError) {
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      console.error("API Error:", message);
    }
    return Promise.reject(error);
  },
);

// User endpoints
export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadKYC: (formData) =>
    api.post("/users/kyc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getBalanceHistory: (params) => api.get("/users/balance/history", { params }),
};

// Transaction endpoints
export const transactionService = {
  getDeposits: (params) => api.get("/transactions/deposits", { params }),
  getWithdrawals: (params) => api.get("/transactions/withdrawals", { params }),
  createDeposit: (data) => api.post("/transactions/deposit", data),
  createWithdrawal: (data) => api.post("/transactions/withdraw", data),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  cancelTransaction: (id) => api.post(`/transactions/${id}/cancel`),
};

// Investment endpoints
export const investmentService = {
  getInvestments: () => api.get("/investments"),
  createInvestment: (data) => api.post("/investments", data),
  getInvestment: (id) => api.get(`/investments/${id}`),
  withdrawInvestment: (id) => api.post(`/investments/${id}/withdraw`),
  getPlans: () => api.get("/investments/plans"),
};

// Trading endpoints
export const tradingService = {
  getMarketPrices: () => api.get("/trading/market/prices"),
  getMarketPrice: (symbol) => api.get(`/trading/market/price?symbol=${symbol}`),
  getOrderbook: (symbol) => api.get(`/trading/market/orderbook/${symbol}`),
  getCandlesticks: (symbol, interval, limit) => api.get(`/trading/market/candlesticks`, { 
    params: { symbol, interval, limit } 
  }),
  getTradingPairs: () => api.get("/trading/market/pairs"),
  getRecentTrades: (symbol) => api.get(`/trading/market/trades`, { params: { symbol } }),
  
  // Order endpoints
  getOrders: (params) => api.get("/trading/orders", { params }),
  placeOrder: (data) => api.post("/trading/orders", data),
  getOrder: (id) => api.get(`/trading/orders/${id}`),
  cancelOrder: (id) => api.delete(`/trading/orders/${id}`),
  getPositions: () => api.get("/trading/positions")
};

// Task endpoints
export const taskService = {
  getTasks: (params) => api.get("/tasks", { params }),
  getUserTasks: () => api.get("/tasks/user"),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  startTask: (taskId) => api.post(`/tasks/${taskId}/start`),
  updateTaskProgress: (taskId, data) => api.put(`/tasks/${taskId}/progress`, data),
  claimTaskReward: (taskId) => api.post(`/tasks/${taskId}/claim`),
  getTaskStatistics: () => api.get("/tasks/statistics"),
};

// Admin endpoints
export const adminService = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getPendingWithdrawals: () => api.get("/admin/withdrawals/pending"),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/${id}/approve`),
  rejectWithdrawal: (id, reason) =>
    api.post(`/admin/withdrawals/${id}/reject`, { reason }),
  getSystemStats: () => api.get("/admin/stats"),
  getKYCRequests: () => api.get("/admin/kyc/pending"),
  approveKYC: (userId, docType) =>
    api.post(`/admin/kyc/${userId}/approve`, { docType }),
  rejectKYC: (userId, docType, reason) =>
    api.post(`/admin/kyc/${userId}/reject`, { docType, reason }),
};

// Add proxy functions for external APIs
export const proxyService = {
  async getCoinGeckoData(endpoint, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/api/market/proxy/coingecko/${endpoint}${queryString ? `?${queryString}` : ""}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching CoinGecko data:", error);
      throw error;
    }
  },
};

const apiService = {
  ...api,
  ...userService,
  ...transactionService,
  ...investmentService,
  ...tradingService,
  ...taskService
};

export default apiService;
