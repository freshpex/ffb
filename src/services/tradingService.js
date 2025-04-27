import api from './apiService';
import { generateMockCandlesticks, generateMockOrderBook, generateMockTradingPairs } from '../utils/mockDataGenerator';

// Helper function to handle API errors more gracefully
const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error.message || 'Unknown error');
  if (fallbackData) {
    console.warn('Using fallback data instead');
    return fallbackData;
  }
  throw error;
};

const tradingService = {
  getTradingPairs: async () => {
    try {
      const response = await api.get('/trading/market/pairs');
      console.log("trading pairs", response);
      return response.data.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Using mock trading pairs due to API error');
        return generateMockTradingPairs();
      }
      throw error;
    }
  },

  // Get market data for a specific trading pair or all pairs
  getMarketData: async (symbol = null) => {
    try {
      if (symbol) {
        const response = await api.get(`/trading/market/price?symbol=${symbol}`);
        console.log("Market data", response);
        return response.data.data;
      } else {
        const response = await api.get('/trading/market/prices');
        return response.data.data;
      }
    } catch (error) {
      return handleApiError(error, symbol ? { symbol, price: 0, timestamp: Date.now() } : []);
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
      return handleApiError(error, generateMockOrderBook(symbol));
    }
  },

  // Get user's portfolio (positions and balances)
  getPortfolio: async () => {
    try {
      const response = await api.get('/trading/positions');
      return response.data.data;
    } catch (error) {
      return handleApiError(error, { positions: [], balances: {} });
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
      return handleApiError(error, {
        orders: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
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
      throw error;
    }
  },

  // Cancel an existing order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/trading/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
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
      return handleApiError(error, generateMockCandlesticks(symbol, interval, limit));
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
      console.log("Chart Data", response);
      return response.data.data.candlesticks;
    } catch (error) {
      return handleApiError(error, generateMockCandlesticks(symbol, timeframe, 100));
    }
  },

  // Get recently executed trades for a symbol
  getRecentTrades: async (symbol) => {
    try {
      const response = await api.get(`/trading/market/trades?symbol=${symbol}&limit=20`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },

  // Get ticker information (24h statistics)
  getTicker: async (symbol) => {
    try {
      const response = await api.get(`/trading/market/price?symbol=${symbol}`);
      console.log("Ticker", response);
      return response.data.data;
    } catch (error) {
      return handleApiError(error, {
        symbol,
        lastPrice: 0,
        change24h: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0
      });
    }
  },
};

export default tradingService;
