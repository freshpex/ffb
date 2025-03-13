import axios from 'axios';

// Instead of directly exposing Binance API, this service will communicate with your backend
// which will securely handle the API keys and signing process
const API_BASE_URL = '/api'; // This would point to your backend proxy

const secureApiService = {
  // Market data methods (public)
  getMarketData: async (symbol) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  },
  
  // Account methods (authenticated)
  getAccountBalance: async () => {
    try {
      // This would call your backend that handles authentication
      const response = await axios.get(`${API_BASE_URL}/account/balance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  },
  
  // Trading methods
  placeOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trade/order`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },
  
  // For fallback client-side implementation
  getBinancePublicData: async (endpoint, params = {}) => {
    const url = `https://api.binance.com/api/v3/${endpoint}`;
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from Binance API (${endpoint}):`, error);
      throw error;
    }
  }
};

export default secureApiService;
