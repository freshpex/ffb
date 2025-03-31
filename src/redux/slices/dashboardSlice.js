import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockApiService from '../../services/mockApiService';

// Add the missing fetchAccountSummary thunk
export const fetchAccountSummary = createAsyncThunk(
  'dashboard/fetchAccountSummary',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock account summary data
      return {
        accountNumber: 'XXXX-XXXX-7890',
        current: 45870.32,
        available: 42650.18,
        pending: 3220.14,
        activity: {
          deposits: 12,
          withdrawals: 5,
          trades: 38
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch account summary');
    }
  }
);

// Initial state for the dashboard
const initialState = {
  // Overall status for dashboard data loading
  status: 'idle',
  error: null,
  
  // Component-specific loading statuses
  components: {
    accountSummary: 'idle',
    financialHighlights: 'idle',
    marketOverview: 'idle',
    recentTransactions: 'idle',
    priceAlerts: 'idle',
    marketNews: 'idle',
    marketPulse: 'idle',
    notifications: 'idle'
  },
  
  // Dashboard data sections
  accountSummary: {
    incomingTotal: 12500.00,
    outgoingTotal: 4800.00,
    investmentsTotal: 15000.00,
    tradesCount: 23,
    lastUpdated: new Date().toISOString()
  },
  
  // Financial Highlights data
  financialHighlights: {
    period: 'September 2023',
    portfolioValue: {
      current: 42500.00,
      previous: 38200.00
    },
    portfolioPerformance: {
      changeAmount: 4300.00,
      changePercent: 11.26
    },
    assetAllocation: {
      stocks: 15000,
      crypto: 12500,
      forex: 8000,
      commodities: 7000
    }
  },
  
  // Market prices for displayed cryptocurrencies
  marketPrices: {
    BTC: { price: 64352.12, change: 2.45 },
    ETH: { price: 3450.78, change: -1.23 },
    LTC: { price: 78.34, change: 0.95 },
    XRP: { price: 0.67, change: 3.21 },
    ADA: { price: 0.48, change: -0.67 }
  },
  
  // Recent transactions
  recentTransactions: [
    {
      id: 'tx_1',
      type: 'deposit',
      description: 'Bank Deposit',
      amount: 5000.00,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'tx_2',
      type: 'withdrawal',
      description: 'Bank Withdrawal',
      amount: 1200.00,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'tx_3',
      type: 'trade',
      description: 'BTC/USD',
      amount: 2500.00,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'tx_4',
      type: 'deposit',
      description: 'Bitcoin Deposit',
      amount: 3200.00,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 'tx_5',
      type: 'investment',
      description: 'Growth Plan',
      amount: 5000.00,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }
  ],
  
  // Price alerts
  priceAlerts: [
    {
      id: 'alert_1',
      asset: 'BTC',
      condition: 'above',
      price: 65000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'alert_2',
      asset: 'ETH',
      condition: 'below',
      price: 3000,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  
  // Market News data
  marketNews: [
    {
      id: 'news_1',
      title: 'Federal Reserve Signals Potential Rate Cut in Upcoming Meeting',
      snippet: 'The Federal Reserve has indicated it may consider lowering interest rates in the next FOMC meeting, as inflation pressures ease and economic growth stabilizes.',
      source: 'Financial Times',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      category: 'economy'
    },
    {
      id: 'news_2',
      title: 'Bitcoin Surpasses $65,000 as Institutional Adoption Accelerates',
      snippet: 'The world\'s largest cryptocurrency has reached a new high for the year, driven by increased institutional investment and positive regulatory developments.',
      source: 'Crypto Daily',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      category: 'crypto'
    },
    {
      id: 'news_3',
      title: 'Tech Giants Report Strong Quarterly Earnings, Beat Market Expectations',
      snippet: 'Major technology companies have posted better-than-expected earnings for Q3, showing resilience despite broader economic concerns and supply chain issues.',
      source: 'Bloomberg',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      category: 'stocks'
    },
    {
      id: 'news_4',
      title: 'Oil Prices Stabilize Following OPEC+ Decision to Maintain Production Levels',
      snippet: 'Crude oil markets have responded positively after OPEC+ members agreed to continue with current production quotas for the next six months.',
      source: 'Reuters',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      category: 'commodities'
    },
    {
      id: 'news_5',
      title: 'New Regulatory Framework for Digital Assets Proposed by SEC',
      snippet: 'The Securities and Exchange Commission has unveiled a comprehensive proposal for regulating cryptocurrencies and other digital assets in the United States.',
      source: 'Wall Street Journal',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#',
      category: 'regulation'
    }
  ],
  
  // Market Pulse data
  marketPulse: {
    indices: [
      { symbol: 'SPX', name: 'S&P 500', value: 4582.64, change: 0.76, region: 'United States' },
      { symbol: 'DJI', name: 'Dow Jones', value: 36124.23, change: 0.45, region: 'United States' },
      { symbol: 'FTSE', name: 'FTSE 100', value: 7403.98, change: -0.25, region: 'United Kingdom' },
      { symbol: 'NIK', name: 'Nikkei 225', value: 33456.01, change: 1.12, region: 'Japan' }
    ],
    sentiment: {
      stocks: 68,
      crypto: 82,
      forex: 45
    },
    volatilityIndex: 15.6,
    updated: new Date().toISOString()
  },
  
  // Notifications
  notifications: [
    {
      id: 'notif_1',
      title: 'Deposit Confirmed',
      message: 'Your deposit of $5,000 has been confirmed and added to your account.',
      type: 'success',
      read: false,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_2',
      title: 'Price Alert Triggered',
      message: 'Bitcoin has reached your price target of $64,000.',
      type: 'info',
      read: true,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_3',
      title: 'Account Security',
      message: 'You have successfully enabled two-factor authentication.',
      type: 'info',
      read: false,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  
  // Account balance and activity
  accountBalance: {
    current: 0,
    available: 0,
    pending: 0
  },
  accountActivity: {
    deposits: 0,
    withdrawals: 0,
    trades: 0
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Set loading state for the entire dashboard
    fetchDashboardStart: (state) => {
      state.status = 'loading';
      // Set all components to loading
      Object.keys(state.components).forEach(component => {
        state.components[component] = 'loading';
      });
    },
    fetchDashboardSuccess: (state, action) => {
      state.status = 'succeeded';
      // Update all data from action payload
      state.accountSummary = action.payload.accountSummary;
      state.financialHighlights = action.payload.financialHighlights;
      state.marketPrices = action.payload.marketPrices;
      state.recentTransactions = action.payload.recentTransactions;
      state.priceAlerts = action.payload.priceAlerts;
      state.marketNews = action.payload.marketNews;
      state.marketPulse = action.payload.marketPulse;
      state.notifications = action.payload.notifications;
      
      // Set all components to succeeded
      Object.keys(state.components).forEach(component => {
        state.components[component] = 'succeeded';
      });
    },
    fetchDashboardFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      
      // Set all components to failed
      Object.keys(state.components).forEach(component => {
        state.components[component] = 'failed';
      });
    },
    
    // Individual component updates for partial loading
    fetchComponentStart: (state, action) => {
      state.components[action.payload] = 'loading';
    },
    fetchComponentSuccess: (state, action) => {
      state.components[action.payload.component] = 'succeeded';
      
      // Update the specific component data
      if (action.payload.data) {
        state[action.payload.component] = action.payload.data;
      }
    },
    fetchComponentFailure: (state, action) => {
      state.components[action.payload.component] = 'failed';
    },
    
    // Price alerts
    addPriceAlert: (state, action) => {
      state.priceAlerts.unshift(action.payload);
    },
    removePriceAlert: (state, action) => {
      state.priceAlerts = state.priceAlerts.filter(alert => alert.id !== action.payload);
    },
    
    // Notifications
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(notif => notif.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotification: (state, action) => {
      state.notifications = state.notifications.filter(notif => notif.id !== action.payload);
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notif => {
        notif.read = true;
      });
    },
    
    // Reset dashboard state
    resetDashboardState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccountSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accountBalance = {
          current: action.payload.current,
          available: action.payload.available,
          pending: action.payload.pending
        };
        state.accountActivity = action.payload.activity;
      })
      .addCase(fetchAccountSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchComponentStart,
  fetchComponentSuccess,
  fetchComponentFailure,
  addPriceAlert,
  removePriceAlert,
  markNotificationAsRead,
  clearNotification,
  markAllNotificationsAsRead,
  resetDashboardState
} = dashboardSlice.actions;

// Thunk for fetching dashboard data
export const fetchDashboardData = () => async (dispatch) => {
  try {
    dispatch(fetchDashboardStart());
    
    // Simulate API calls with different loading times
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'accountSummary',
        data: initialState.accountSummary
      }));
    }, 800);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'financialHighlights',
        data: initialState.financialHighlights
      }));
    }, 1100);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'marketOverview',
        data: initialState.marketPrices
      }));
    }, 1200);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'recentTransactions',
        data: initialState.recentTransactions
      }));
    }, 1500);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'priceAlerts',
        data: initialState.priceAlerts
      }));
    }, 900);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'marketNews',
        data: initialState.marketNews
      }));
    }, 1300);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'marketPulse',
        data: initialState.marketPulse
      }));
    }, 1400);
    
    setTimeout(() => {
      dispatch(fetchComponentSuccess({
        component: 'notifications',
        data: initialState.notifications
      }));
      
      dispatch(fetchDashboardSuccess({
        accountSummary: initialState.accountSummary,
        financialHighlights: initialState.financialHighlights,
        marketPrices: initialState.marketPrices,
        recentTransactions: initialState.recentTransactions,
        priceAlerts: initialState.priceAlerts,
        marketNews: initialState.marketNews,
        marketPulse: initialState.marketPulse,
        notifications: initialState.notifications
      }));
    }, 2000);
    
    return true;
  } catch (error) {
    dispatch(fetchDashboardFailure(error.message || 'Failed to fetch dashboard data'));
    throw error;
  }
};

// Selectors
export const selectDashboardStatus = (state) => state.dashboard?.status || 'idle';
export const selectDashboardError = (state) => state.dashboard?.error || null;
export const selectDashboardComponentStatus = (state, component) => 
  state.dashboard?.components?.[component] || 'idle';

export const selectDashboardData = (state) => state.dashboard?.accountSummary || {};
export const selectFinancialHighlights = (state) => state.dashboard?.financialHighlights || {};
export const selectMarketPrices = (state) => state.dashboard?.marketPrices || {};
export const selectRecentTransactions = (state) => state.dashboard?.recentTransactions || [];
export const selectPriceAlerts = (state) => state.dashboard?.priceAlerts || [];
export const selectMarketNews = (state) => state.dashboard?.marketNews || [];
export const selectMarketPulse = (state) => state.dashboard?.marketPulse || null;
export const selectNotifications = (state) => state.dashboard?.notifications || [];
export const selectUnreadNotificationsCount = (state) => 
  state.dashboard?.notifications?.filter(notif => !notif.read).length || 0;
export const selectAccountBalance = (state) => state.dashboard.accountBalance;
export const selectAccountActivity = (state) => state.dashboard.accountActivity;

export default dashboardSlice.reducer;
