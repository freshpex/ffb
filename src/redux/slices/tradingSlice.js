import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import {
  mockMarketData,
  getCandlestickData,
  generateOrderHistory,
  generatePortfolioData,
  mockAssets
} from '../../services/mockTradingService';

// Initial state
const initialState = {
  // Market data
  selectedAsset: 'BTC/USD',
  marketPrices: {},
  orderBook: { asks: [], bids: [] },
  recentTrades: [],
  
  // Chart data
  candlesticks: [],
  chartTimeframe: '1h',
  chartIndicators: {
    sma: true,
    volume: true,
  },
  
  // Trading form
  tradingForm: {
    orderType: 'market',
    side: 'buy',
    amount: '',
    price: '',
    stopPrice: '',
    total: 0,
    processing: false,
  },
  
  // Order history
  openOrders: [],
  orderHistory: [],
  positions: [],
  
  // User's portfolio
  portfolio: {
    balances: [],
    openPositions: [],
    tradingStats: {},
  },
  accountBalance: 25000,
  marginAvailable: 20000,
  
  // Status indicators
  status: {
    marketData: 'idle',
    chartData: 'idle',
    orderSubmit: 'idle',
    portfolio: 'idle',
    orderHistory: 'idle',
  },
  errors: {
    marketData: null,
    chartData: null,
    orderSubmit: null,
    portfolio: null,
    orderHistory: null,
  },
};

// Async thunks
export const fetchMarketData = createAsyncThunk(
  'trading/fetchMarketData',
  async (symbol = 'BTC/USD', { rejectWithValue }) => {
    try {
      const data = await mockMarketData(symbol);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'trading/fetchChartData',
  async ({ symbol, timeframe }, { rejectWithValue }) => {
    try {
      const data = await getCandlestickData(symbol, timeframe);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const userId = 'user123'; // Would come from auth state in real app
      const orders = generateOrderHistory(userId);
      
      // Separate open orders from order history
      const openOrders = orders.filter(order => order.status === 'open');
      const orderHistory = orders.filter(order => order.status !== 'open');
      
      return { openOrders, orderHistory };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'trading/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const userId = 'user123'; // Would come from auth state in real app
      const portfolioData = generatePortfolioData(userId);
      return portfolioData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitOrder = createAsyncThunk(
  'trading/submitOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new order
      const newOrder = {
        id: `order_${Date.now()}`,
        userId: 'user123',
        symbol: orderData.symbol,
        type: orderData.orderType,
        side: orderData.side,
        price: orderData.orderType === 'market' ? null : orderData.price,
        stopPrice: ['stop', 'stop_limit'].includes(orderData.orderType) ? orderData.stopPrice : null,
        quantity: orderData.amount,
        filled: 0,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'trading/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        orderId
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'trading/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new order
      const newOrderId = `order_${Date.now()}`;
      
      return {
        success: true,
        data: {
          id: newOrderId,
          status: 'open',
          symbol: orderData.symbol,
          type: orderData.type,
          side: orderData.side,
          amount: orderData.amount,
          price: orderData.price,
          stopPrice: orderData.stopPrice,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTradingHistory = createAsyncThunk(
  'trading/fetchTradingHistory',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate history for today
      const history = Array.from({ length: 20 }, (_, i) => ({
        id: `trade_${Date.now()}_${i}`,
        symbol: ['BTC/USD', 'ETH/USD', 'XRP/USD'][Math.floor(Math.random() * 3)],
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        price: 1000 + Math.random() * 50000,
        amount: Math.random() * 10,
        fee: Math.random() * 10,
        total: 0, // Will be calculated
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      // Calculate totals
      history.forEach(trade => {
        trade.total = trade.price * trade.amount;
      });
      
      return history;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMarketPrices = createAsyncThunk(
  'trading/updateMarketPrices',
  async (data, { rejectWithValue }) => {
    try {
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setSelectedPair = createAsyncThunk(
  'trading/setSelectedPair',
  async (symbol, { dispatch }) => {
    await dispatch(setSelectedAsset(symbol));
    return symbol;
  }
);

// Trading slice
const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    // Update trading form
    updateTradingForm: (state, action) => {
      state.tradingForm = {
        ...state.tradingForm,
        ...action.payload
      };
    },
    
    // Set selected asset
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    
    // Set chart timeframe
    setChartTimeframe: (state, action) => {
      state.chartTimeframe = action.payload;
    },
    
    // Toggle chart indicator
    toggleChartIndicator: (state, action) => {
      const indicator = action.payload;
      state.chartIndicators[indicator] = !state.chartIndicators[indicator];
    },
    
    // Reset trading form
    resetTradingForm: (state) => {
      state.tradingForm = initialState.tradingForm;
    },
    
    // Set account balance (for testing)
    setAccountBalance: (state, action) => {
      state.accountBalance = action.payload;
    },
    
    // Reset trading state
    resetTradingState: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch market data
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status.marketData = 'loading';
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status.marketData = 'succeeded';
        state.marketPrices = {
          ...state.marketPrices,
          ...action.payload.prices
        };
        state.orderBook = action.payload.orderBook;
        state.recentTrades = action.payload.recentTrades;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status.marketData = 'failed';
        state.errors.marketData = action.payload;
      })
      
      // Fetch chart data
      .addCase(fetchChartData.pending, (state) => {
        state.status.chartData = 'loading';
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.status.chartData = 'succeeded';
        state.candlesticks = action.payload.candles;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.status.chartData = 'failed';
        state.errors.chartData = action.payload;
      })
      
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.status.orderHistory = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status.orderHistory = 'succeeded';
        state.openOrders = action.payload.openOrders;
        state.orderHistory = action.payload.orderHistory;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status.orderHistory = 'failed';
        state.errors.orderHistory = action.payload;
      })
      
      // Fetch portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.status.portfolio = 'loading';
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status.portfolio = 'succeeded';
        state.portfolio = action.payload;
        
        // Update positions from portfolio data
        state.positions = action.payload.balances.map(balance => ({
          symbol: balance.asset,
          amount: balance.free,
          locked: balance.locked
        }));
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status.portfolio = 'failed';
        state.errors.portfolio = action.payload;
      })
      
      // Submit order
      .addCase(submitOrder.pending, (state) => {
        state.status.orderSubmit = 'loading';
        state.tradingForm.processing = true;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.status.orderSubmit = 'succeeded';
        state.openOrders.unshift(action.payload);
        state.tradingForm.processing = false;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status.orderSubmit = 'failed';
        state.errors.orderSubmit = action.payload;
        state.tradingForm.processing = false;
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.status.orderSubmit = 'loading';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status.orderSubmit = 'succeeded';
        state.openOrders = state.openOrders.filter(order => order.id !== action.payload.orderId);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status.orderSubmit = 'failed';
        state.errors.orderSubmit = action.payload;
      })
      
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.status.orderSubmit = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status.orderSubmit = 'succeeded';
        const newOrder = action.payload.data;
        state.openOrders.unshift({
          id: newOrder.id,
          symbol: newOrder.symbol,
          type: newOrder.type,
          side: newOrder.side,
          quantity: newOrder.amount,
          price: newOrder.price,
          stopPrice: newOrder.stopPrice,
          status: 'open',
          createdAt: newOrder.createdAt
        });
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status.orderSubmit = 'failed';
        state.errors.orderSubmit = action.payload;
      })
      
      // Update market prices
      .addCase(updateMarketPrices.fulfilled, (state, action) => {
        const { symbol, price, priceChange } = action.payload;
        if (state.marketPrices[symbol]) {
          state.marketPrices[symbol].current = price;
          state.marketPrices[symbol].change = priceChange;
        }
      });
  }
});

// Actions
export const {
  updateTradingForm,
  setSelectedAsset,
  setChartTimeframe,
  toggleChartIndicator,
  resetTradingForm,
  setAccountBalance,
  resetTradingState
} = tradingSlice.actions;

// Selectors
export const selectSelectedAsset = (state) => state.trading.selectedAsset;
export const selectMarketPrices = (state) => state.trading.marketPrices;
export const selectOrderBook = (state) => state.trading.orderBook;
export const selectRecentTrades = (state) => state.trading.recentTrades;
export const selectCandlesticks = (state) => state.trading.candlesticks;
export const selectChartTimeframe = (state) => state.trading.chartTimeframe;
export const selectChartIndicators = (state) => state.trading.chartIndicators;
export const selectTradingForm = (state) => state.trading.tradingForm;
export const selectOpenOrders = (state) => state.trading.openOrders;
export const selectOrderHistory = (state) => state.trading.orderHistory;
export const selectPositions = (state) => state.trading.positions;
export const selectPortfolio = (state) => state.trading.portfolio;
export const selectAccountBalance = (state) => state.trading.accountBalance;
export const selectMarginAvailable = (state) => state.trading.marginAvailable;
export const selectTradingStatus = (state) => state.trading.status;
export const selectTradingErrors = (state) => state.trading.errors;

export const selectTradeHistory = createSelector(
  [selectOrderHistory],
  (orderHistory) => orderHistory.filter(order => order.status === 'filled')
);

export const selectTradingPairs = () => mockAssets;
export const selectUserBalance = (state) => state.trading.accountBalance;
export const selectTradingError = (state) => state.trading.errors;

// Provide access to available assets
export const selectAvailableAssets = () => mockAssets;

export default tradingSlice.reducer;
