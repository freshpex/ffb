import { generateMockCandlesticks, generateMockOrderBook, generateMockTradingPairs } from '../utils/mockDataGenerator';

// Helper function to simulate API delay
const simulateApiDelay = async () => {
  const delay = Math.random() * 300 + 100; // Random delay between 100-400ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock data
const mockTradingPairs = generateMockTradingPairs();

const mockMarketData = mockTradingPairs.reduce((acc, pair) => {
  acc[pair.symbol] = {
    symbol: pair.symbol,
    lastPrice: parseFloat((Math.random() * 100).toFixed(2)),
    change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    high24h: parseFloat((Math.random() * 120).toFixed(2)),
    low24h: parseFloat((Math.random() * 80).toFixed(2)),
    volume24h: parseFloat((Math.random() * 10000000).toFixed(2)),
    baseVolume: parseFloat((Math.random() * 1000).toFixed(2)),
    quoteVolume: parseFloat((Math.random() * 10000000).toFixed(2)),
  };
  return acc;
}, {});

const mockPortfolio = {
  balances: {
    BTC: 0.5,
    ETH: 5.2,
    USDT: 25000,
    SOL: 45.8,
    ADA: 1200,
  },
  positions: [
    { symbol: 'BTC/USDT', amount: 0.5, value: 15000, averagePrice: 30000 },
    { symbol: 'ETH/USDT', amount: 5.2, value: 10400, averagePrice: 2000 },
    { symbol: 'SOL/USDT', amount: 45.8, value: 4580, averagePrice: 100 },
    { symbol: 'ADA/USDT', amount: 1200, value: 600, averagePrice: 0.5 },
  ],
  totalValue: 55580,
  pnl: 5500,
  pnlPercentage: 10.2,
};

// Generate some mock open orders
const mockOpenOrders = [
  { 
    id: 'order1', 
    symbol: 'BTC/USDT', 
    type: 'limit', 
    side: 'buy', 
    amount: 0.1, 
    price: 28000, 
    filled: 0,
    status: 'open', 
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString() 
  },
  { 
    id: 'order2', 
    symbol: 'ETH/USDT', 
    type: 'limit', 
    side: 'sell', 
    amount: 2.5, 
    price: 2200, 
    filled: 0,
    status: 'open', 
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString() 
  },
];

// Generate order history
const generateMockOrderHistory = () => {
  const symbols = [
    // Crypto
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'ADA/USDT',
    // Stocks
    'AAPL/USD', 'MSFT/USD', 'GOOGL/USD', 'AMZN/USD', 'TSLA/USD',
    // Commodities
    'GOLD/USD', 'SILVER/USD', 'OIL/USD',
    // Forex
    'EUR/USD', 'GBP/USD', 'USD/JPY'
  ];
  
  const types = ['market', 'limit', 'stop', 'stop_limit'];
  const sides = ['buy', 'sell'];
  const statuses = ['filled', 'canceled', 'rejected'];
  
  const orders = [];
  
  // Generate 30 random historical orders
  for (let i = 0; i < 30; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate realistic prices based on asset type
    let price, amount;
    if (symbol.includes('BTC')) {
      price = 30000 + Math.random() * 5000;
      amount = 0.05 + Math.random() * 0.5;
    } else if (symbol.includes('ETH')) {
      price = 2000 + Math.random() * 300;
      amount = 0.5 + Math.random() * 2;
    } else if (symbol.includes('AAPL')) {
      price = 150 + Math.random() * 30;
      amount = 5 + Math.random() * 20;
    } else if (symbol.includes('GOLD')) {
      price = 1900 + Math.random() * 200;
      amount = 0.1 + Math.random() * 1;
    } else if (symbol.includes('EUR')) {
      price = 1.08 + Math.random() * 0.02;
      amount = 1000 + Math.random() * 5000;
    } else {
      price = 10 + Math.random() * 90;
      amount = 10 + Math.random() * 50;
    }
    
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    
    orders.push({
      id: `hist-${i + 1}`,
      symbol,
      type,
      side,
      amount: parseFloat(amount.toFixed(4)),
      price: parseFloat(price.toFixed(2)),
      filled: status === 'filled' ? parseFloat(amount.toFixed(4)) : 0,
      status,
      createdAt,
      filledAt: status === 'filled' ? createdAt : null,
      valueUSD: parseFloat((price * amount).toFixed(2)),
      assetType: getAssetTypeFromSymbol(symbol)
    });
  }
  
  // Sort by date, newest first
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Helper function to determine asset type from symbol
const getAssetTypeFromSymbol = (symbol) => {
  if (['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'XRP', 'BNB', 'LINK'].some(crypto => symbol.includes(crypto))) {
    return 'crypto';
  } else if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'].some(stock => symbol.includes(stock))) {
    return 'stock';
  } else if (['GOLD', 'SILVER', 'OIL', 'NAT.GAS', 'COPPER', 'WHEAT', 'CORN', 'COFFEE'].some(commodity => symbol.includes(commodity))) {
    return 'commodity';
  } else if (['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP'].includes(symbol)) {
    return 'forex';
  }
  return 'crypto'; // Default
};

// Generate order history using the function
const mockOrderHistory = generateMockOrderHistory();

// Hold active orders in memory for the mock service
let activeOrders = [...mockOpenOrders];

const tradingService = {
  // Get available trading pairs
  getTradingPairs: async () => {
    await simulateApiDelay();
    return mockTradingPairs;
  },

  // Get market data for a specific trading pair or all pairs
  getMarketData: async (symbol = null) => {
    await simulateApiDelay();
    if (symbol) {
      return mockMarketData[symbol] || null;
    }
    return Object.values(mockMarketData);
  },

  // Get order book data for a specific trading pair
  getOrderbook: async (symbol) => {
    await simulateApiDelay();
    return generateMockOrderBook(symbol);
  },

  // Get user's portfolio (positions and balances)
  getPortfolio: async () => {
    await simulateApiDelay();
    return mockPortfolio;
  },

  // Get user's open orders
  getOrders: async ({ symbol = null, status = null, page = 1, limit = 50 }) => {
    await simulateApiDelay();
    
    let filteredOrders = [...activeOrders];
    
    if (symbol) {
      filteredOrders = filteredOrders.filter(order => order.symbol === symbol);
    }
    
    if (status) {
      if (Array.isArray(status)) {
        filteredOrders = filteredOrders.filter(order => status.includes(order.status));
      } else {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    };
  },

  // Get user's order history and executed trades
  getTradingHistory: async ({ symbol = null, page = 1, limit = 50 }) => {
    await simulateApiDelay();
    
    let filteredHistory = [...mockOrderHistory];
    
    if (symbol) {
      filteredHistory = filteredHistory.filter(order => order.symbol === symbol);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
    
    return {
      trades: paginatedHistory,
      pagination: {
        page,
        limit,
        total: filteredHistory.length,
        pages: Math.ceil(filteredHistory.length / limit)
      }
    };
  },

  // Place a new order
  placeOrder: async (orderData) => {
    await simulateApiDelay();
    
    const newOrderId = `order-${Date.now()}`;
    const newOrder = {
      id: newOrderId,
      ...orderData,
      filled: 0,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    // For market orders, simulate immediate execution
    if (orderData.type === 'market') {
      newOrder.status = 'filled';
      newOrder.filled = orderData.amount;
      newOrder.filledAt = new Date().toISOString();
      
      // Add to order history instead of active orders
      mockOrderHistory.unshift(newOrder);
    } else {
      // For limit orders, add to active orders
      activeOrders.unshift(newOrder);
    }
    
    return {
      success: true,
      message: `Order ${newOrder.status === 'filled' ? 'executed' : 'placed'} successfully`,
      data: newOrder
    };
  },

  // Cancel an existing order
  cancelOrder: async (orderId) => {
    await simulateApiDelay();
    
    const orderIndex = activeOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const canceledOrder = {
      ...activeOrders[orderIndex],
      status: 'canceled',
      canceledAt: new Date().toISOString()
    };
    
    // Remove from active orders
    activeOrders.splice(orderIndex, 1);
    
    // Add to history
    mockOrderHistory.unshift(canceledOrder);
    
    return {
      success: true,
      message: 'Order canceled successfully',
      data: canceledOrder
    };
  },

  // Get historical price data for charts
  getHistoricalData: async ({ symbol, interval = '1d', limit = 100 }) => {
    await simulateApiDelay();
    return generateMockCandlesticks(symbol, interval, limit);
  },

  // Get chart data for a symbol and timeframe
  getChartData: async (symbol, timeframe) => {
    await simulateApiDelay();
    return generateMockCandlesticks(symbol, timeframe, 100);
  },

  // Get recently executed trades for a symbol
  getRecentTrades: async (symbol) => {
    await simulateApiDelay();
    
    const trades = [];
    const basePrice = mockMarketData[symbol]?.lastPrice || 1000;
    
    // Generate 20 recent trades
    for (let i = 0; i < 20; i++) {
      const price = basePrice * (1 + (Math.random() * 0.01 - 0.005));
      const amount = Math.random() * 2;
      trades.push({
        id: `trade-${Date.now()}-${i}`,
        symbol,
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(4)),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        time: new Date(Date.now() - i * 30000).toISOString()
      });
    }
    
    return trades;
  },

  // Get ticker information (24h statistics)
  getTicker: async (symbol) => {
    await simulateApiDelay();
    return mockMarketData[symbol] || null;
  },
};

export default tradingService;