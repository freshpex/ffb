import api from './apiService';
import { generateMockCandlesticks, generateMockOrderBook, generateMockTradingPairs } from '../utils/mockDataGenerator';
import { toast } from 'react-toastify';

// Helper function to handle API errors with toast notifications
const handleApiError = (error, fallbackData = null) => {
  const errorMessage = error.message || 'Unknown error occurred';
  console.error('API Error:', errorMessage);
  toast.error(`Error: ${errorMessage}`);
  
  if (fallbackData && import.meta.env.DEV) {
    return fallbackData;
  }
  throw error;
};

const tradingService = {
  getTradingPairs: async () => {
    try {
      const response = await api.get('/trading/market/pairs');
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get market data for a specific trading pair or all pairs
  getMarketData: async (symbol = null) => {
    try {
      if (symbol) {
        const response = await api.get(`/trading/market/price?symbol=${symbol}`);
        return response.data.data;
      } else {
        const response = await api.get('/trading/market/prices');
        return response.data.data;
      }
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get order book data for a specific trading pair
  getOrderbook: async (symbol) => {
    try {
      const [baseAsset, quoteAsset] = symbol.split('/');
      if (!baseAsset || !quoteAsset) {
        throw new Error(`Invalid symbol format: ${symbol}`);
      }
      
      const response = await api.get(`/trading/market/orderbook/${baseAsset}/${quoteAsset}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user's portfolio (positions and balances)
  getPortfolio: async () => {
    try {
      const response = await api.get('/trading/positions');
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user's open orders
  getOrders: async ({ symbol = null, status = null, page = 1, limit = 50 }) => {
    try {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      if (status) {
        if (Array.isArray(status)) {
          status.forEach(s => params.append('status', s));
        } else {
          params.append('status', status);
        }
      }
      params.append('page', page);
      params.append('limit', limit);

      const response = await api.get(`/trading/orders?${params.toString()}`);
      return {
        orders: response.data.data.orders || [],
        pagination: response.data.data.pagination || {
          page,
          limit,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user's order history and executed trades
  getTradingHistory: async ({ symbol = null, page = 1, limit = 50 }) => {
    try {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      params.append('page', page);
      params.append('limit', limit);
      params.append('status', 'filled,canceled,rejected');

      const response = await api.get(`/trading/orders?${params.toString()}`);
      return {
        trades: response.data.data.orders || [],
        pagination: response.data.data.pagination || {
          page,
          limit,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      return handleApiError(error, {
        trades: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }
  },

  // Place a new order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/trading/orders', orderData);
      return response.data;
    } catch (error) {      
      return handleApiError(error);
    }
  },

  // Cancel an existing order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/trading/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get historical price data for charts
  getHistoricalData: async ({ symbol, interval = "1d", limit = 100 }) => {
    try {
      const params = new URLSearchParams({
        symbol,
        interval,
        limit
      });
      
      const response = await api.get(`/trading/market/candlesticks?${params.toString()}`);
      return response.data.data.candlesticks;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get chart data for a symbol and timeframe
  getChartData: async (symbol, timeframe) => {
    try {
      const params = new URLSearchParams({
        symbol,
        interval: timeframe,
        limit: 100
      });
      
      const response = await api.get(`/trading/market/candlesticks?${params.toString()}`);
      return response.data.data.candlesticks;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get recently executed trades for a symbol
  getRecentTrades: async (symbol) => {
    try {
      const response = await api.get(`/trading/market/trades?symbol=${symbol}&limit=20`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get ticker information (24h statistics)
  getTicker: async (symbol) => {
    try {
      const response = await api.get(`/trading/market/price?symbol=${symbol}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default tradingService;
