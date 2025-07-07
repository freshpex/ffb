import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tradingService from '../../services/tradingService';

// Async thunks for trading operations
export const fetchTradingPairs = createAsyncThunk(
  'trading/fetchTradingPairs',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetching TradingPairs");
      return await tradingService.getTradingPairs();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchMarketData = createAsyncThunk(
  'trading/fetchMarketData',
  async (symbol, { rejectWithValue }) => {
    try {
      console.log("fetching MarketData");
      return await tradingService.getMarketData(symbol);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchOrderbook = createAsyncThunk(
  'trading/fetchOrderbook',
  async (symbol, { rejectWithValue }) => {
    try {
      return await tradingService.getOrderbook(symbol);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchPortfolio = createAsyncThunk(
  'trading/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      return await tradingService.getPortfolio();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchOrders = createAsyncThunk(
  'trading/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      return await tradingService.getOrders(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchTradingHistory = createAsyncThunk(
  'trading/fetchTradingHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tradingService.getTradingHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const placeOrder = createAsyncThunk(
  'trading/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await tradingService.placeOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  'trading/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      return await tradingService.cancelOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchHistoricalData = createAsyncThunk(
  'trading/fetchHistoricalData',
  async (params, { rejectWithValue }) => {
    try {
      return await tradingService.getHistoricalData(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchChartData = createAsyncThunk(
  'trading/fetchChartData',
  async ({ symbol, timeframe }, { rejectWithValue }) => {
    try {
      const response = await tradingService.getChartData(symbol, timeframe);
      console.log("fetchChartData", response);
      return { data: response, symbol, timeframe };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Initial state
const initialState = {
  tradingPairs: [],
  favoriteSymbols: [],
  marketData: {},
  orderbook: {
    bids: [],
    asks: [],
  },
  portfolio: {
    positions: [],
    balances: {},
  },
  orders: {
    open: [],
    history: [],
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
    },
  },
  historicalData: [],
  candlesticks: [],
  chartData: {
    timeframe: '1h',
    indicators: {
      macd: false,
      rsi: false,
      bollingerBands: false,
      movingAverages: true,
    },
    loading: false,
    error: null,
  },
  selectedSymbol: 'BTC/USDT',
  selectedAsset: 'BTC/USDT',
  selectedTimeframe: '1d',
  orderType: 'market', // 'market', 'limit'
  orderSide: 'buy', // 'buy', 'sell'
  orderAmount: '',
  orderPrice: '',
  orderForm: {
    type: 'limit', // 'limit', 'market', 'stop'
    side: 'buy', // 'buy', 'sell'
    amount: '',
    price: '',
    stopPrice: '',
    total: '',
  },
  activeTab: 'positions', // 'positions', 'orders', 'history'
  marketSideTab: 'buy', // 'buy', 'sell'
  error: {
    tradingPairs: null,
    marketData: null,
    orderbook: null,
    portfolio: null,
    orders: null,
    history: null,
    placeOrder: null,
    cancelOrder: null,
    historicalData: null,
    chartData: null,
    orderFormError: '',
  },
  ui: {
    dropdownOpen: false,
    showSidebar: true,
    showAlert: false,
    alertMessage: { type: '', message: '' },
  },
  loading: {
    tradingPairs: false,
    marketData: false,
    orderbook: false,
    portfolio: false,
    orders: false,
    history: false,
    placeOrder: false,
    cancelOrder: false,
    historicalData: false,
    chartData: false,
  },
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  lastSuccessfulOrder: null,
  recentTrades: [],
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    toggleFavoriteSymbol: (state, action) => {
      const symbol = action.payload;
      const idx = state.favoriteSymbols.indexOf(symbol);
      if (idx >= 0) state.favoriteSymbols.splice(idx, 1);
      else state.favoriteSymbols.push(symbol);
    },
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    setSelectedTimeframe: (state, action) => {
      state.selectedTimeframe = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setOrderSide: (state, action) => {
      state.orderSide = action.payload;
    },
    setOrderAmount: (state, action) => {
      state.orderAmount = action.payload;
    },
    setOrderPrice: (state, action) => {
      state.orderPrice = action.payload;
    },
    resetOrderForm: (state) => {
      state.orderAmount = '';
      state.orderPrice = '';
    },
    clearOrderError: (state) => {
      state.error.placeOrder = null;
    },
    updateMarketPrice: (state, action) => {
      const { symbol, price } = action.payload;
      if (!state.marketData[symbol]) {
        state.marketData[symbol] = {};
      }
      state.marketData[symbol].lastPrice = price;
    },
    // New actions for trading form state
    updateOrderForm: (state, action) => {
      state.orderForm = {
        ...state.orderForm,
        ...action.payload,
      };

      // Auto-calculate total for limit and stop orders
      if (
        ('amount' in action.payload || 'price' in action.payload) &&
        (state.orderForm.type === 'limit' || state.orderForm.type === 'stop')
      ) {
        const amount = parseFloat(state.orderForm.amount) || 0;
        const price = parseFloat(state.orderForm.price) || 0;
        state.orderForm.total = (amount * price).toFixed(2);
      }
    },
    setOrderFormType: (state, action) => {
      state.orderForm.type = action.payload;
    },
    setOrderFormSide: (state, action) => {
      state.orderForm.side = action.payload;
    },
    resetEntireOrderForm: (state) => {
      state.orderForm = {
        ...state.orderForm,
        amount: '',
        price: '',
        stopPrice: '',
        total: '',
      };
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setMarketSideTab: (state, action) => {
      state.marketSideTab = action.payload;
    },
    setOrderFormError: (state, action) => {
      state.error.orderFormError = action.payload;
    },
    clearOrderFormError: (state) => {
      state.error.orderFormError = '';
    },
    toggleDropdown: (state) => {
      state.ui.dropdownOpen = !state.ui.dropdownOpen;
    },
    setDropdownOpen: (state, action) => {
      state.ui.dropdownOpen = action.payload;
    },
    setShowSidebar: (state, action) => {
      state.ui.showSidebar = action.payload;
    },
    toggleSidebar: (state) => {
      state.ui.showSidebar = !state.ui.showSidebar;
    },
    setShowAlert: (state, action) => {
      state.ui.showAlert = action.payload;
    },
    setAlertMessage: (state, action) => {
      state.ui.alertMessage = action.payload;
      state.ui.showAlert = true;
    },
    clearAlert: (state) => {
      state.ui.showAlert = false;
      state.ui.alertMessage = { type: '', message: '' };
    },
    setChartTimeframe: (state, action) => {
      state.chartData.timeframe = action.payload;
    },
    toggleChartIndicator: (state, action) => {
      const indicator = action.payload;
      state.chartData.indicators[indicator] =
        !state.chartData.indicators[indicator];
    },
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    updateCandlesticks: (state, action) => {
      state.candlesticks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradingPairs.pending, (state) => {
        state.loading.tradingPairs = true;
        state.error.tradingPairs = null;
      })
      .addCase(fetchTradingPairs.fulfilled, (state, action) => {
        state.tradingPairs = action.payload;
        state.loading.tradingPairs = false;
      })
      .addCase(fetchTradingPairs.rejected, (state, action) => {
        state.loading.tradingPairs = false;
        state.error.tradingPairs = action.payload;
      })

      // Handle fetchMarketData
      .addCase(fetchMarketData.pending, (state) => {
        state.loading.marketData = true;
        state.error.marketData = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        if (action.payload) {
          if (Array.isArray(action.payload)) {
            action.payload.forEach((item) => {
              if (item && item.symbol) {
                state.marketData[item.symbol] = item;
              }
            });
          } else if (action.payload.symbol) {
            state.marketData[action.payload.symbol] = action.payload;
          }
        }
        state.loading.marketData = false;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading.marketData = false;
        state.error.marketData = action.payload;
      })

      // Handle fetchOrderbook
      .addCase(fetchOrderbook.pending, (state) => {
        state.loading.orderbook = true;
        state.error.orderbook = null;
      })
      .addCase(fetchOrderbook.fulfilled, (state, action) => {
        state.orderbook = action.payload;
        state.loading.orderbook = false;
      })
      .addCase(fetchOrderbook.rejected, (state, action) => {
        state.loading.orderbook = false;
        state.error.orderbook = action.payload;
      })

      // Handle fetchPortfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading.portfolio = true;
        state.error.portfolio = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolio = action.payload;
        state.loading.portfolio = false;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading.portfolio = false;
        state.error.portfolio = action.payload;
      })

      // Handle fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders.open = action.payload.orders;
        state.orders.pagination = action.payload.pagination;
        state.loading.orders = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })

      // Handle fetchTradingHistory
      .addCase(fetchTradingHistory.pending, (state) => {
        state.loading.history = true;
        state.error.history = null;
      })
      .addCase(fetchTradingHistory.fulfilled, (state, action) => {
        state.orders.history = action.payload.trades;
        state.loading.history = false;
      })
      .addCase(fetchTradingHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error.history = action.payload;
      })

      // Handle placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading.placeOrder = true;
        state.error.placeOrder = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading.placeOrder = false;
        state.lastSuccessfulOrder = action.payload.data;

        if (action.payload.data.status === "open") {
          state.orders.open.unshift(action.payload.data);
        } else {
          // If it was executed immediately, update portfolio
          // Note: In a real app, you might want to dispatch fetchPortfolio instead
          if (state.portfolio.positions && action.payload.data.symbol) {
            const symbol = action.payload.data.symbol;
            const existingPosition = state.portfolio.positions.find(
              (p) => p.symbol === symbol,
            );

            if (existingPosition) {
              existingPosition.amount += action.payload.data.filledAmount || 0;
              existingPosition.value +=
                action.payload.data.filledAmount * action.payload.data.price ||
                0;
            } else if (action.payload.data.filledAmount > 0) {
              state.portfolio.positions.push({
                symbol,
                amount: action.payload.data.filledAmount,
                value:
                  action.payload.data.filledAmount * action.payload.data.price,
                averagePrice: action.payload.data.price,
              });
            }

            // Update balance
            const cost =
              action.payload.data.filledAmount * action.payload.data.price || 0;
            if (cost > 0) {
              const [assetSymbol, quoteSymbol] = symbol.split("/");
              if (state.portfolio.balances[quoteSymbol]) {
                state.portfolio.balances[quoteSymbol] -= cost;
              }
              if (state.portfolio.balances[assetSymbol] === undefined) {
                state.portfolio.balances[assetSymbol] =
                  action.payload.data.filledAmount;
              } else {
                state.portfolio.balances[assetSymbol] +=
                  action.payload.data.filledAmount;
              }
            }
          }
        }

        // Reset order form
        state.orderAmount = '';
        state.orderPrice = '';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading.placeOrder = false;
        state.error.placeOrder = action.payload;
      })

      // Handle cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading.cancelOrder = true;
        state.error.cancelOrder = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.cancelOrder = false;
        // Remove the canceled order from open orders
        state.orders.open = state.orders.open.filter(
          (order) => order.id !== action.payload.data.id,
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancelOrder = false;
        state.error.cancelOrder = action.payload;
      })

      // Handle fetchHistoricalData
      .addCase(fetchHistoricalData.pending, (state) => {
        state.loading.historicalData = true;
        state.error.historicalData = null;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.historicalData = action.payload;
        state.loading.historicalData = false;
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.loading.historicalData = false;
        state.error.historicalData = action.payload;
      })

      // Handle fetchChartData
      .addCase(fetchChartData.pending, (state) => {
        state.loading.chartData = true;
        state.error.chartData = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = {
          ...state.chartData,
          data: action.payload.data,
          symbol: action.payload.symbol,
          timeframe: action.payload.timeframe,
        };
        state.loading.chartData = false;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading.chartData = false;
        state.error.chartData = action.payload;
      });
  },
});

export const {
  setSelectedSymbol,
  setSelectedTimeframe,
  setOrderType,
  setOrderSide,
  setOrderAmount,
  setOrderPrice,
  resetOrderForm,
  clearOrderError,
  updateMarketPrice,
  toggleFavoriteSymbol,
  updateOrderForm,
  setOrderFormType,
  setOrderFormSide,
  resetEntireOrderForm,
  setActiveTab,
  setMarketSideTab,
  setOrderFormError,
  clearOrderFormError,
  toggleDropdown,
  setDropdownOpen,
  setShowSidebar,
  toggleSidebar,
  setShowAlert,
  setAlertMessage,
  clearAlert,
  setChartTimeframe,
  toggleChartIndicator,
  setSelectedAsset,
  updateCandlesticks,
} = tradingSlice.actions;

export default tradingSlice.reducer;

// Selector exports for components
export const selectTradingPairs = (state) => state.trading.tradingPairs;
export const selectMarketPrices = (state) => state.trading.marketData;
export const selectFavoriteSymbols = (state) => state.trading.favoriteSymbols;
export const selectSelectedSymbol = (state) => state.trading.selectedSymbol;
export const selectSelectedTimeframe = (state) =>
  state.trading.selectedTimeframe;
export const selectHistoricalData = (state) => state.trading.historicalData;
export const selectOrderType = (state) => state.trading.orderType;
export const selectOrderSide = (state) => state.trading.orderSide;
export const selectOrderAmount = (state) => state.trading.orderAmount;
export const selectOrderPrice = (state) => state.trading.orderPrice;
export const selectOrderBook = (state) => state.trading.orderbook;
export const selectPortfolio = (state) => state.trading.portfolio;
export const selectOpenOrders = (state) => state.trading.orders.open;
export const selectOrderForm = (state) => state.trading.orderForm;
export const selectActiveTab = (state) => state.trading.activeTab;
export const selectMarketSideTab = (state) => state.trading.marketSideTab;
export const selectOrderFormError = (state) =>
  state.trading.error.orderFormError;
export const selectDropdownOpen = (state) => state.trading.ui.dropdownOpen;
export const selectShowSidebar = (state) => state.trading.ui.showSidebar;
export const selectShowAlert = (state) => state.trading.ui.showAlert;
export const selectAlertMessage = (state) => state.trading.ui.alertMessage;
export const selectRecentTrades = (state) => state.trading.recentTrades;
export const selectTradingStatus = (state) => state.trading.status;
export const selectTradeHistory = (state) => state.trading.orders.history;
export const selectPositions = (state) => state.trading.portfolio.positions;
export const selectOrderHistory = (state) => state.trading.orders.history;
export const selectCandlesticks = (state) => state.trading.candlesticks;
export const selectSelectedAsset = (state) => state.trading.selectedAsset;
export const selectChartTimeframe = (state) =>
  state.trading.chartData.timeframe;
export const selectChartIndicators = (state) =>
  state.trading.chartData.indicators;
export const selectChartLoading = (state) => state.trading.loading.chartData;
