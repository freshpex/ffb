import axios from 'axios';
import CryptoJS from 'crypto-js';

// Base URL is exposed to client, but keys are not
const apiUrl = import.meta.env.VITE_BINANCE_API_URL || 'https://api.binance.com';

// IMPORTANT: In a production environment, these API calls should be made through your backend
// This is a simplified version for demonstration purposes
// Your server should handle authentication and signing

const binanceService = {
  // Public endpoints that don't require authentication
  getExchangeInfo: async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v3/exchangeInfo`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      throw error;
    }
  },
  
  getTickerPrices: async (symbols = []) => {
    try {
      const endpoint = `${apiUrl}/api/v3/ticker/price`;
      const response = symbols.length > 0 
        ? await axios.get(`${endpoint}?symbols=${JSON.stringify(symbols)}`)
        : await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticker prices:', error);
      throw error;
    }
  },
  
  getMarketDepth: async (symbol, limit = 10) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v3/depth?symbol=${symbol}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching market depth for ${symbol}:`, error);
      throw error;
    }
  },
  
  get24hrStats: async (symbol) => {
    try {
      const endpoint = `${apiUrl}/api/v3/ticker/24hr`;
      const response = symbol 
        ? await axios.get(`${endpoint}?symbol=${symbol}`)
        : await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching 24hr stats:', error);
      throw error;
    }
  },
  
  getKlines: async (symbol, interval = '1h', limit = 500) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      // Format the response into OHLC format
      return response.data.map(kline => ({
        time: kline[0], // Open time
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));
    } catch (error) {
      console.error(`Error fetching klines for ${symbol}:`, error);
      throw error;
    }
  },
  
  // Get the recent trades for a symbol
  getRecentTrades: async (symbol, limit = 50) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v3/trades?symbol=${symbol}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent trades for ${symbol}:`, error);
      throw error;
    }
  },
  
  // Get the aggregate trades for a symbol
  getAggregateTrades: async (symbol, limit = 50) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching aggregate trades for ${symbol}:`, error);
      throw error;
    }
  },
  
  // Get all exchange symbols with min/max order values
  getTradingRules: async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v3/exchangeInfo`);
      // Extract trading rules for each symbol
      const tradingRules = {};
      response.data.symbols.forEach(symbol => {
        tradingRules[symbol.symbol] = {
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          status: symbol.status,
          filters: symbol.filters
        };
      });
      return tradingRules;
    } catch (error) {
      console.error('Error fetching trading rules:', error);
      throw error;
    }
  },
  
  // Get top traded assets by volume (24h)
  getTopTradedAssets: async (limit = 10) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v3/ticker/24hr`);
      // Sort by volume and limit
      const sortedByVolume = response.data
        .filter(ticker => ticker.symbol.endsWith('USDT')) // Filter for USDT pairs
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit);
      return sortedByVolume;
    } catch (error) {
      console.error('Error fetching top traded assets:', error);
      throw error;
    }
  },
};

export default binanceService;
