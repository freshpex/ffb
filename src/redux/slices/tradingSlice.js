import { createSlice } from '@reduxjs/toolkit';
import { mockMarketData, mockAssets, mockOrderTypes } from '../../services/mockTradingService';

// Initial state for the trading functionality
const initialState = {
  // Market data
  marketData: {
    prices: {},
    orderBook: {
      asks: [],
      bids: []
    },
    recentTrades: [],
    status: 'idle',
    error: null
  },
  
  // Chart data
  chartData: {
    timeframe: '1h',
    candlesticks: [],
    indicators: {
      enabled: {
        rsi: false,
        macd: false,
        ma: true,
        bollinger: false,
        volume: true
      },
      data: {
        rsi: [],
        macd: [],
        ma: [/* 9, 21, 50, 200 */],
        bollinger: [],
        volume: []
      }
    },
    status: 'idle',
    error: null
  },
  
  // Trading data
  trading: {
    selectedAsset: 'BTC/USD',
    orderType: 'limit', // market, limit, stop, stop-limit
    side: 'buy', // buy, sell
    amount: '',
    price: '',
    stopPrice: '',
    totalCost: 0,
    leverage: 1,
    status: 'idle',
    processing: false,
    error: null
  },
  
  // Portfolio data
  portfolio: {
    positions: [],
    balance: 0,
    marginAvailable: 0,
    marginUsed: 0,
    status: 'idle',
    error: null
  },
  
  // Orders data
  orders: {
    open: [],
    filled: [],
    canceled: [],
    status: 'idle',
    error: null
  },
  
  // Trading history
  history: {
    trades: [],
    deposits: [],
    withdrawals: [],
    totalProfit: 0,
    totalVolume: 0,
    status: 'idle',
    error: null
  },
  
  // Available assets and trading pairs
  availableAssets: mockAssets,
  orderTypes: mockOrderTypes,
  
  // Watchlist
  watchlist: [
    { symbol: 'BTC/USD', favorite: true },
    { symbol: 'ETH/USD', favorite: true },
    { symbol: 'LTC/USD', favorite: false },
    { symbol: 'XRP/USD', favorite: false },
    { symbol: 'ADA/USD', favorite: false }
  ],
  
  // Trading view preferences
  preferences: {
    theme: 'dark',
    chartType: 'candles', // candles, line, area, bars
    orderBookDepth: 'medium', // shallow, medium, deep
    notifications: {
      priceAlerts: true,
      orderFilled: true,
      marginCall: true
    }
  },
  
  // Trading Session
  session: {
    active: false,
    startTime: null,
    duration: 0,
    profitLoss: 0
  }
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    // Market data actions
    fetchMarketDataStart(state) {
      state.marketData.status = 'loading';
    },
    fetchMarketDataSuccess(state, action) {
      state.marketData.status = 'succeeded';
      state.marketData.prices = action.payload.prices || state.marketData.prices;
      state.marketData.orderBook = action.payload.orderBook || state.marketData.orderBook;
      state.marketData.recentTrades = action.payload.recentTrades || state.marketData.recentTrades;
    },
    fetchMarketDataFailure(state, action) {
      state.marketData.status = 'failed';
      state.marketData.error = action.payload;
    },
    
    // Update market prices (for WebSocket updates)
    updateMarketPrice(state, action) {
      const { symbol, price } = action.payload;
      if (state.marketData.prices[symbol]) {
        state.marketData.prices[symbol] = {
          ...state.marketData.prices[symbol],
          current: price,
          change: ((price - state.marketData.prices[symbol].previous) / state.marketData.prices[symbol].previous) * 100
        };
      } else {
        state.marketData.prices[symbol] = {
          current: price,
          previous: price,
          change: 0
        };
      }
    },
    
    // Order book updates
    updateOrderBook(state, action) {
      state.marketData.orderBook = action.payload;
    },
    
    // Recent trades updates
    addRecentTrade(state, action) {
      state.marketData.recentTrades = [
        action.payload,
        ...state.marketData.recentTrades.slice(0, 19) // Keep last 20 trades
      ];
    },
    
    // Chart data actions
    fetchChartDataStart(state) {
      state.chartData.status = 'loading';
    },
    fetchChartDataSuccess(state, action) {
      state.chartData.status = 'succeeded';
      state.chartData.candlesticks = action.payload.candlesticks;
      
      // Update any available indicators data
      if (action.payload.indicators) {
        Object.keys(action.payload.indicators).forEach(key => {
          if (state.chartData.indicators.data[key]) {
            state.chartData.indicators.data[key] = action.payload.indicators[key];
          }
        });
      }
    },
    fetchChartDataFailure(state, action) {
      state.chartData.status = 'failed';
      state.chartData.error = action.payload;
    },
    
    // Change chart timeframe
    setChartTimeframe(state, action) {
      state.chartData.timeframe = action.payload;
    },
    
    // Toggle chart indicators
    toggleChartIndicator(state, action) {
      const indicator = action.payload;
      if (state.chartData.indicators.enabled.hasOwnProperty(indicator)) {
        state.chartData.indicators.enabled[indicator] = !state.chartData.indicators.enabled[indicator];
      }
    },
    
    // Trading form actions
    updateTradingForm(state, action) {
      state.trading = {
        ...state.trading,
        ...action.payload
      };
      
      // Calculate total cost if we have both amount and price for limit orders
      if (state.trading.orderType === 'limit' || state.trading.orderType === 'stop-limit') {
        if (state.trading.amount && state.trading.price) {
          state.trading.totalCost = parseFloat(state.trading.amount) * parseFloat(state.trading.price);
        }
      } else if (state.trading.orderType === 'market') {
        // For market orders, use current price as estimate
        const currentPrice = state.marketData.prices[state.trading.selectedAsset]?.current;
        if (state.trading.amount && currentPrice) {
          state.trading.totalCost = parseFloat(state.trading.amount) * currentPrice;
        }
      }
    },
    
    // Select trading asset
    selectTradingAsset(state, action) {
      state.trading.selectedAsset = action.payload;
      // Reset the form when changing assets
      state.trading.amount = '';
      state.trading.price = '';
      state.trading.stopPrice = '';
      state.trading.totalCost = 0;
    },
    
    // Submitting an order
    submitOrderStart(state) {
      state.trading.status = 'loading';
      state.trading.processing = true;
      state.trading.error = null;
    },
    submitOrderSuccess(state, action) {
      state.trading.status = 'succeeded';
      state.trading.processing = false;
      
      // Add the new order to our open orders
      state.orders.open.unshift(action.payload);
      
      // Reset the form
      state.trading.amount = '';
      state.trading.price = '';
      state.trading.stopPrice = '';
      state.trading.totalCost = 0;
    },
    submitOrderFailure(state, action) {
      state.trading.status = 'failed';
      state.trading.processing = false;
      state.trading.error = action.payload;
    },
    
    // Portfolio/Positions actions
    fetchPortfolioStart(state) {
      state.portfolio.status = 'loading';
    },
    fetchPortfolioSuccess(state, action) {
      state.portfolio.status = 'succeeded';
      state.portfolio.positions = action.payload.positions;
      state.portfolio.balance = action.payload.balance;
      state.portfolio.marginAvailable = action.payload.marginAvailable;
      state.portfolio.marginUsed = action.payload.marginUsed;
    },
    fetchPortfolioFailure(state, action) {
      state.portfolio.status = 'failed';
      state.portfolio.error = action.payload;
    },
    
    // Update a single position (e.g., from WebSocket)
    updatePortfolioPosition(state, action) {
      const position = action.payload;
      const index = state.portfolio.positions.findIndex(p => p.id === position.id);
      if (index >= 0) {
        state.portfolio.positions[index] = position;
      } else {
        state.portfolio.positions.push(position);
      }
      
      // Update margin used and available
      state.portfolio.marginUsed = state.portfolio.positions.reduce(
        (total, pos) => total + pos.margin, 0
      );
      state.portfolio.marginAvailable = state.portfolio.balance - state.portfolio.marginUsed;
    },
    
    // Close a position
    closePositionStart(state, action) {
      const positionId = action.payload;
      const position = state.portfolio.positions.find(p => p.id === positionId);
      if (position) {
        position.closing = true;
      }
    },
    closePositionSuccess(state, action) {
      const { positionId, closedPosition } = action.payload;
      
      // Remove the position from open positions
      state.portfolio.positions = state.portfolio.positions.filter(p => p.id !== positionId);
      
      // Add to trading history
      state.history.trades.unshift(closedPosition);
      
      // Update total profit/loss
      state.history.totalProfit += closedPosition.profit;
      
      // Update margin used and available
      state.portfolio.marginUsed = state.portfolio.positions.reduce(
        (total, pos) => total + pos.margin, 0
      );
      state.portfolio.marginAvailable = state.portfolio.balance - state.portfolio.marginUsed;
    },
    closePositionFailure(state, action) {
      const { positionId, error } = action.payload;
      const position = state.portfolio.positions.find(p => p.id === positionId);
      if (position) {
        position.closing = false;
        position.error = error;
      }
    },
    
    // Orders actions
    fetchOrdersStart(state) {
      state.orders.status = 'loading';
    },
    fetchOrdersSuccess(state, action) {
      state.orders.status = 'succeeded';
      state.orders.open = action.payload.open;
      state.orders.filled = action.payload.filled;
      state.orders.canceled = action.payload.canceled;
    },
    fetchOrdersFailure(state, action) {
      state.orders.status = 'failed';
      state.orders.error = action.payload;
    },
    
    // Cancel an order
    cancelOrderStart(state, action) {
      const orderId = action.payload;
      const order = state.orders.open.find(o => o.id === orderId);
      if (order) {
        order.canceling = true;
      }
    },
    cancelOrderSuccess(state, action) {
      const orderId = action.payload;
      
      // Find the order
      const order = state.orders.open.find(o => o.id === orderId);
      
      // Remove from open orders
      state.orders.open = state.orders.open.filter(o => o.id !== orderId);
      
      // Add to canceled orders
      if (order) {
        state.orders.canceled.unshift({
          ...order,
          canceledAt: new Date().toISOString(),
          status: 'canceled'
        });
      }
    },
    cancelOrderFailure(state, action) {
      const { orderId, error } = action.payload;
      const order = state.orders.open.find(o => o.id === orderId);
      if (order) {
        order.canceling = false;
        order.error = error;
      }
    },
    
    // Update order status (e.g., from WebSocket)
    updateOrderStatus(state, action) {
      const { orderId, status, filledAmount, filledPrice } = action.payload;
      
      // Find the order in open orders
      const orderIndex = state.orders.open.findIndex(o => o.id === orderId);
      
      if (orderIndex >= 0) {
        const order = state.orders.open[orderIndex];
        
        if (status === 'filled' || status === 'partially_filled') {
          // Update the order
          const updatedOrder = {
            ...order,
            status,
            filledAmount: filledAmount || order.filledAmount,
            filledPrice: filledPrice || order.filledPrice,
            updatedAt: new Date().toISOString()
          };
          
          // If completely filled, remove from open and add to filled
          if (status === 'filled') {
            state.orders.open.splice(orderIndex, 1);
            state.orders.filled.unshift(updatedOrder);
          } else {
            // Otherwise just update it
            state.orders.open[orderIndex] = updatedOrder;
          }
        }
      }
    },
    
    // Trading history actions
    fetchTradingHistoryStart(state) {
      state.history.status = 'loading';
    },
    fetchTradingHistorySuccess(state, action) {
      state.history.status = 'succeeded';
      state.history.trades = action.payload.trades;
      state.history.deposits = action.payload.deposits;
      state.history.withdrawals = action.payload.withdrawals;
      state.history.totalProfit = action.payload.totalProfit;
      state.history.totalVolume = action.payload.totalVolume;
    },
    fetchTradingHistoryFailure(state, action) {
      state.history.status = 'failed';
      state.history.error = action.payload;
    },
    
    // Watchlist actions
    addToWatchlist(state, action) {
      const symbol = action.payload;
      if (!state.watchlist.some(item => item.symbol === symbol)) {
        state.watchlist.push({ symbol, favorite: false });
      }
    },
    removeFromWatchlist(state, action) {
      const symbol = action.payload;
      state.watchlist = state.watchlist.filter(item => item.symbol !== symbol);
    },
    toggleFavorite(state, action) {
      const symbol = action.payload;
      const item = state.watchlist.find(item => item.symbol === symbol);
      if (item) {
        item.favorite = !item.favorite;
      }
    },
    
    // Preferences actions
    updatePreferences(state, action) {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    },
    
    // Trading session actions
    startTradingSession(state) {
      state.session.active = true;
      state.session.startTime = new Date().toISOString();
      state.session.duration = 0;
      state.session.profitLoss = 0;
    },
    updateTradingSession(state, action) {
      if (state.session.active) {
        state.session.duration = action.payload.duration;
        state.session.profitLoss = action.payload.profitLoss;
      }
    },
    endTradingSession(state) {
      state.session.active = false;
    },
    
    // Reset the trading state
    resetTradingState: () => initialState
  }
});

export const {
  // Market data actions
  fetchMarketDataStart,
  fetchMarketDataSuccess,
  fetchMarketDataFailure,
  updateMarketPrice,
  updateOrderBook,
  addRecentTrade,
  
  // Chart data actions
  fetchChartDataStart,
  fetchChartDataSuccess,
  fetchChartDataFailure,
  setChartTimeframe,
  toggleChartIndicator,
  
  // Trading form actions
  updateTradingForm,
  selectTradingAsset,
  submitOrderStart,
  submitOrderSuccess,
  submitOrderFailure,
  
  // Portfolio actions
  fetchPortfolioStart,
  fetchPortfolioSuccess,
  fetchPortfolioFailure,
  updatePortfolioPosition,
  closePositionStart,
  closePositionSuccess,
  closePositionFailure,
  
  // Orders actions
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  cancelOrderStart,
  cancelOrderSuccess,
  cancelOrderFailure,
  updateOrderStatus,
  
  // Trading history actions
  fetchTradingHistoryStart,
  fetchTradingHistorySuccess,
  fetchTradingHistoryFailure,
  
  // Watchlist actions
  addToWatchlist,
  removeFromWatchlist,
  toggleFavorite,
  
  // Preferences actions
  updatePreferences,
  
  // Trading session actions
  startTradingSession,
  updateTradingSession,
  endTradingSession,
  
  // Reset state
  resetTradingState
} = tradingSlice.actions;

// Thunks
export const fetchMarketData = (symbol) => async (dispatch) => {
  try {
    dispatch(fetchMarketDataStart());
    
    // In a real app, this would be an API call
    const data = await mockMarketData(symbol);
    
    dispatch(fetchMarketDataSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchMarketDataFailure(error.message || 'Failed to fetch market data'));
    throw error;
  }
};

export const fetchChartData = (symbol, timeframe) => async (dispatch) => {
  try {
    dispatch(fetchChartDataStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate dummy candlestick data based on timeframe
    const periods = 100;
    const now = new Date();
    const candlesticks = [];
    
    let lastPrice = 50000 + (Math.random() * 5000);
    
    for (let i = 0; i < periods; i++) {
      const timestamp = new Date(now);
      
      // Adjust timestamp based on timeframe
      switch(timeframe) {
        case '1m':
          timestamp.setMinutes(now.getMinutes() - (periods - i));
          break;
        case '5m':
          timestamp.setMinutes(now.getMinutes() - (periods - i) * 5);
          break;
        case '15m':
          timestamp.setMinutes(now.getMinutes() - (periods - i) * 15);
          break;
        case '1h':
          timestamp.setHours(now.getHours() - (periods - i));
          break;
        case '4h':
          timestamp.setHours(now.getHours() - (periods - i) * 4);
          break;
        case '1d':
          timestamp.setDate(now.getDate() - (periods - i));
          break;
        case '1w':
          timestamp.setDate(now.getDate() - (periods - i) * 7);
          break;
        default:
          timestamp.setHours(now.getHours() - (periods - i));
      }
      
      // Generate a random candle
      const open = lastPrice;
      const close = open * (1 + (Math.random() * 0.04) - 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 100 + 50;
      
      candlesticks.push({
        timestamp: timestamp.toISOString(),
        open,
        high,
        low,
        close,
        volume
      });
      
      lastPrice = close;
    }
    
    // Generate some dummy indicators data
    const ma9 = candlesticks.map((candle, i, arr) => {
      if (i < 9) return null;
      const sum = arr.slice(i - 9, i).reduce((acc, c) => acc + c.close, 0);
      return { timestamp: candle.timestamp, value: sum / 9 };
    }).filter(Boolean);
    
    const ma21 = candlesticks.map((candle, i, arr) => {
      if (i < 21) return null;
      const sum = arr.slice(i - 21, i).reduce((acc, c) => acc + c.close, 0);
      return { timestamp: candle.timestamp, value: sum / 21 };
    }).filter(Boolean);
    
    dispatch(fetchChartDataSuccess({
      candlesticks,
      indicators: {
        ma: [ma9, ma21],
        volume: candlesticks.map(c => ({ timestamp: c.timestamp, value: c.volume }))
      }
    }));
  } catch (error) {
    dispatch(fetchChartDataFailure(error.message || 'Failed to fetch chart data'));
    throw error;
  }
};

export const submitOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(submitOrderStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock order response
    const orderResponse = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filledAmount: 0,
      filledPrice: null
    };
    
    dispatch(submitOrderSuccess(orderResponse));
    return orderResponse;
  } catch (error) {
    dispatch(submitOrderFailure(error.message || 'Failed to submit order'));
    throw error;
  }
};

export const fetchPortfolio = () => async (dispatch) => {
  try {
    dispatch(fetchPortfolioStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate mock portfolio data
    const positions = [
      {
        id: 'pos_1',
        symbol: 'BTC/USD',
        size: 0.5,
        entryPrice: 52000,
        currentPrice: 61000,
        openTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        pnl: 4500,
        pnlPercentage: 8.65,
        margin: 2600,
        leverage: 10,
        liquidationPrice: 47380,
        type: 'long'
      },
      {
        id: 'pos_2',
        symbol: 'ETH/USD',
        size: 2,
        entryPrice: 2800,
        currentPrice: 2950,
        openTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        pnl: 300,
        pnlPercentage: 5.36,
        margin: 560,
        leverage: 10,
        liquidationPrice: 2548,
        type: 'long'
      },
      {
        id: 'pos_3',
        symbol: 'XRP/USD',
        size: 1000,
        entryPrice: 0.75,
        currentPrice: 0.72,
        openTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        pnl: -30,
        pnlPercentage: -4.0,
        margin: 75,
        leverage: 10,
        liquidationPrice: 0.683,
        type: 'short'
      }
    ];
    
    const balance = 10000;
    const marginUsed = positions.reduce((total, pos) => total + pos.margin, 0);
    const marginAvailable = balance - marginUsed;
    
    dispatch(fetchPortfolioSuccess({
      positions,
      balance,
      marginUsed,
      marginAvailable
    }));
  } catch (error) {
    dispatch(fetchPortfolioFailure(error.message || 'Failed to fetch portfolio'));
    throw error;
  }
};

export const closePosition = (positionId) => async (dispatch) => {
  try {
    dispatch(closePositionStart(positionId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const closedPosition = {
      id: positionId,
      closedAt: new Date().toISOString(),
      profit: Math.random() > 0.5 ? Math.random() * 500 : -Math.random() * 500
    };
    
    dispatch(closePositionSuccess({ positionId, closedPosition }));
    return closedPosition;
  } catch (error) {
    dispatch(closePositionFailure({ 
      positionId, 
      error: error.message || 'Failed to close position'
    }));
    throw error;
  }
};

export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock orders data
    const openOrders = [
      {
        id: 'order_1',
        symbol: 'BTC/USD',
        type: 'limit',
        side: 'buy',
        price: 58000,
        amount: 0.2,
        filledAmount: 0,
        status: 'open',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'order_2',
        symbol: 'ETH/USD',
        type: 'stop',
        side: 'sell',
        price: 2700,
        stopPrice: 2750,
        amount: 1.5,
        filledAmount: 0,
        status: 'open',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];
    
    const filledOrders = [
      {
        id: 'order_3',
        symbol: 'ETH/USD',
        type: 'market',
        side: 'buy',
        price: null,
        amount: 2,
        filledAmount: 2,
        filledPrice: 2800,
        status: 'filled',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        filledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'order_4',
        symbol: 'XRP/USD',
        type: 'limit',
        side: 'sell',
        price: 0.75,
        amount: 1000,
        filledAmount: 1000,
        filledPrice: 0.75,
        status: 'filled',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        filledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const canceledOrders = [
      {
        id: 'order_5',
        symbol: 'BTC/USD',
        type: 'limit',
        side: 'sell',
        price: 65000,
        amount: 0.1,
        filledAmount: 0,
        status: 'canceled',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        canceledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    dispatch(fetchOrdersSuccess({
      open: openOrders,
      filled: filledOrders,
      canceled: canceledOrders
    }));
  } catch (error) {
    dispatch(fetchOrdersFailure(error.message || 'Failed to fetch orders'));
    throw error;
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(cancelOrderStart(orderId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(cancelOrderSuccess(orderId));
    return { success: true };
  } catch (error) {
    dispatch(cancelOrderFailure({ 
      orderId, 
      error: error.message || 'Failed to cancel order'
    }));
    throw error;
  }
};

export const fetchTradingHistory = () => async (dispatch) => {
  try {
    dispatch(fetchTradingHistoryStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // Generate mock trading history
    const trades = [
      {
        id: 'trade_1',
        symbol: 'BTC/USD',
        side: 'buy',
        price: 48000,
        amount: 0.5,
        cost: 24000,
        fee: 24,
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trade_2',
        symbol: 'ETH/USD',
        side: 'buy',
        price: 2500,
        amount: 3,
        cost: 7500,
        fee: 7.5,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trade_3',
        symbol: 'BTC/USD',
        side: 'sell',
        price: 52000,
        amount: 0.2,
        cost: 10400,
        fee: 10.4,
        profit: 800,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const deposits = [
      {
        id: 'deposit_1',
        currency: 'USD',
        amount: 10000,
        status: 'completed',
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const withdrawals = [
      {
        id: 'withdrawal_1',
        currency: 'USD',
        amount: 2000,
        fee: 25,
        status: 'completed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const totalVolume = trades.reduce((sum, trade) => sum + trade.cost, 0);
    
    dispatch(fetchTradingHistorySuccess({
      trades,
      deposits,
      withdrawals,
      totalProfit,
      totalVolume
    }));
  } catch (error) {
    dispatch(fetchTradingHistoryFailure(error.message || 'Failed to fetch trading history'));
    throw error;
  }
};

// Selectors
export const selectMarketData = (state) => state.trading?.marketData || initialState.marketData;
export const selectMarketPrices = (state) => state.trading?.marketData?.prices || {};
export const selectOrderBook = (state) => state.trading?.marketData?.orderBook || { asks: [], bids: [] };
export const selectRecentTrades = (state) => state.trading?.marketData?.recentTrades || [];

export const selectChartData = (state) => state.trading?.chartData || initialState.chartData;
export const selectCandlesticks = (state) => state.trading?.chartData?.candlesticks || [];
export const selectChartTimeframe = (state) => state.trading?.chartData?.timeframe || '1h';
export const selectChartIndicators = (state) => state.trading?.chartData?.indicators || { enabled: {}, data: {} };

export const selectTradingForm = (state) => state.trading?.trading || initialState.trading;
export const selectSelectedAsset = (state) => state.trading?.trading?.selectedAsset || 'BTC/USD';
export const selectOrderType = (state) => state.trading?.trading?.orderType || 'limit';
export const selectTradingSide = (state) => state.trading?.trading?.side || 'buy';

export const selectPortfolio = (state) => state.trading?.portfolio || initialState.portfolio;
export const selectPositions = (state) => state.trading?.portfolio?.positions || [];
export const selectAccountBalance = (state) => state.trading?.portfolio?.balance || 0;
export const selectMarginAvailable = (state) => state.trading?.portfolio?.marginAvailable || 0;
export const selectMarginUsed = (state) => state.trading?.portfolio?.marginUsed || 0;

export const selectOrders = (state) => state.trading?.orders || initialState.orders;
export const selectOpenOrders = (state) => state.trading?.orders?.open || [];
export const selectFilledOrders = (state) => state.trading?.orders?.filled || [];
export const selectCanceledOrders = (state) => state.trading?.orders?.canceled || [];

export const selectTradingHistory = (state) => state.trading?.history || initialState.history;
export const selectTrades = (state) => state.trading?.history?.trades || [];
export const selectDeposits = (state) => state.trading?.history?.deposits || [];
export const selectWithdrawals = (state) => state.trading?.history?.withdrawals || [];
export const selectTotalProfit = (state) => state.trading?.history?.totalProfit || 0;
export const selectTotalVolume = (state) => state.trading?.history?.totalVolume || 0;

export const selectAvailableAssets = (state) => state.trading?.availableAssets || [];
export const selectOrderTypes = (state) => state.trading?.orderTypes || [];
export const selectWatchlist = (state) => state.trading?.watchlist || [];
export const selectFavorites = (state) => state.trading?.watchlist.filter(item => item.favorite) || [];

export const selectPreferences = (state) => state.trading?.preferences || initialState.preferences;
export const selectTradingSession = (state) => state.trading?.session || initialState.session;

export default tradingSlice.reducer;
