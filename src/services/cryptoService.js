import axios from 'axios';
import { proxyService } from './apiService';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const cryptoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

// Helper function to handle errors
const handleError = (error, fallbackData = null) => {
  console.error('Crypto API Error:', error);
  if (fallbackData) {
    console.info('Using fallback data due to API error');
    return fallbackData;
  }
  throw error;
};

// Service for cryptocurrency data
const cryptoService = {
  getMarketChart: async (coinId, currency = 'usd', days = 7, interval = 'daily') => {
    try {
      const response = await cryptoApi.get(`/market/proxy/coingecko/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days,
          interval
        }
      });
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        return handleError(error, generateFallbackChartData(days));
      }
      return handleError(error);
    }
  },
  
  // Get current price data for coins
  getCoinsMarkets: async (currency = 'usd', ids = [], page = 1, perPage = 10) => {
    try {
      const response = await cryptoApi.get('/market/proxy/coingecko/coins/markets', {
        params: {
          vs_currency: currency,
          ids: ids.join(','),
          page,
          per_page: perPage,
          sparkline: false,
          price_change_percentage: '24h,7d'
        }
      });
      return response.data;
    } catch (error) {
      if (import.meta.VITE_ENVIRONMENT === 'development') {
        return handleError(error, generateFallbackCoinsData());
      }
      return handleError(error);
    }
  }
};

// Generate fallback chart data for development
const generateFallbackChartData = (days = 7) => {
  const now = Date.now();
  const dayInMs = 86400000;
  const prices = [];
  const volumes = [];
  const marketCaps = [];
  
  // Generate random data points
  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * dayInMs;
    const basePrice = 20000 + Math.random() * 10000;
    
    prices.push([timestamp, basePrice]);
    volumes.push([timestamp, basePrice * (Math.random() * 1000 + 100)]);
    marketCaps.push([timestamp, basePrice * 10000000]);
  }
  
  return { prices, volumes, market_caps: marketCaps };
};

// Generate fallback coins data for development
const generateFallbackCoinsData = () => {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 57000 + Math.random() * 3000,
      price_change_percentage_24h: (Math.random() * 10) - 5,
      price_change_percentage_7d_in_currency: (Math.random() * 20) - 10
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3000 + Math.random() * 500,
      price_change_percentage_24h: (Math.random() * 10) - 5,
      price_change_percentage_7d_in_currency: (Math.random() * 20) - 10
    }
  ];
};

export default cryptoService;

export const getMarketChart = async (coinId, days = 7, currency = 'usd') => {
  try {
    return await proxyService.getCoinGeckoData(`coins/${coinId}/market_chart`, {
      vs_currency: currency,
      days,
      interval: days > 30 ? 'daily' : undefined
    });
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    throw error;
  }
};
