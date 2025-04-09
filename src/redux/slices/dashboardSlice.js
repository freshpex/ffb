import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Fetch all dashboard data in a single request
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

// Fetch account summary
export const fetchAccountSummary = createAsyncThunk(
  'dashboard/fetchAccountSummary',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/dashboard/account-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch account summary');
    }
  }
);

// Fetch recent transactions
export const fetchRecentTransactions = createAsyncThunk(
  'dashboard/fetchRecentTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 5 } = params;
      
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const queryParams = new URLSearchParams({
        limit
      });
      
      const response = await fetch(`${API_URL}/dashboard/recent-transactions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recent transactions');
    }
  }
);

// Fetch financial highlights
export const fetchFinancialHighlights = createAsyncThunk(
  'dashboard/fetchFinancialHighlights',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/dashboard/financial-highlights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch financial highlights');
    }
  }
);

// Fetch market pulse data
export const fetchMarketPulse = createAsyncThunk(
  'dashboard/fetchMarketPulse',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/dashboard/market-pulse`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch market pulse data');
    }
  }
);

// Fetch market news
export const fetchMarketNews = createAsyncThunk(
  'dashboard/fetchMarketNews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 5 } = params;
      
      const response = await fetch(`${API_URL}/market-news/latest?limit=${limit}`);
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch market news');
    }
  }
);

// Price alerts actions

// Fetch user price alerts
export const fetchPriceAlerts = createAsyncThunk(
  'dashboard/fetchPriceAlerts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, active } = params;
      
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(active !== undefined && { active: active.toString() })
      });
      
      const response = await fetch(`${API_URL}/price-alerts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch price alerts');
    }
  }
);

// Create price alert
export const createPriceAlert = createAsyncThunk(
  'dashboard/createPriceAlert',
  async (alertData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/price-alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertData)
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create price alert');
    }
  }
);

export const addPriceAlert = createPriceAlert;

// Update price alert
export const updatePriceAlert = createAsyncThunk(
  'dashboard/updatePriceAlert',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/price-alerts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update price alert');
    }
  }
);

// Delete price alert
export const deletePriceAlert = createAsyncThunk(
  'dashboard/deletePriceAlert',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/price-alerts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      await handleApiError(response);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete price alert');
    }
  }
);

export const removePriceAlert = deletePriceAlert;

// Initial state
const initialState = {
  accountSummary: {
    availableBalance: 0,
    totalInvestments: 0,
    totalAssets: 0,
    projectedEarnings: 0,
    currency: 'USD',
    accountNumber: '',
    accountType: ''
  },
  recentTransactions: [],
  financialHighlights: {
    monthToDateDeposits: 0,
    monthToDateWithdrawals: 0,
    netFlow: 0,
    depositTrend: 0,
    withdrawalTrend: 0,
    currency: 'USD',
    periodLabel: ''
  },
  marketPulse: {
    indices: [],
    trendingAssets: [],
    marketMovers: {
      gainers: [],
      losers: []
    },
    marketSentiment: {
      fearGreedIndex: 0,
      volatilityIndex: 0,
      marketBreadth: {
        advancing: 0,
        declining: 0,
        unchanged: 0
      },
      tradingVolume: '',
      sentiment: ''
    },
    lastUpdated: null
  },
  marketNews: [],
  priceAlerts: {
    alerts: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    }
  },
  status: {
    dashboard: 'idle',
    accountSummary: 'idle',
    recentTransactions: 'idle',
    financialHighlights: 'idle',
    marketPulse: 'idle',
    marketNews: 'idle',
    priceAlerts: 'idle'
  },
  error: {
    dashboard: null,
    accountSummary: null,
    recentTransactions: null,
    financialHighlights: null,
    marketPulse: null,
    marketNews: null,
    priceAlerts: null
  },
  actionStatus: 'idle' // For create/update/delete actions
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state, action) => {
      const { source } = action.payload || {};
      if (source) {
        state.error[source] = null;
      } else {
        // Clear all errors if no source specified
        state.error = {
          dashboard: null,
          accountSummary: null,
          recentTransactions: null,
          financialHighlights: null,
          marketPulse: null,
          marketNews: null,
          priceAlerts: null
        };
      }
      state.actionStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.status.dashboard = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status.dashboard = 'succeeded';
        state.accountSummary = action.payload.accountSummary;
        state.recentTransactions = action.payload.recentTransactions;
        
        // Update the priceAlerts array (maintaining pagination structure)
        state.priceAlerts.alerts = action.payload.priceAlerts;
        
        // Update market news
        state.marketNews = action.payload.latestNews;
        
        state.error.dashboard = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status.dashboard = 'failed';
        state.error.dashboard = action.payload;
      })
      
      // Fetch account summary
      .addCase(fetchAccountSummary.pending, (state) => {
        state.status.accountSummary = 'loading';
      })
      .addCase(fetchAccountSummary.fulfilled, (state, action) => {
        state.status.accountSummary = 'succeeded';
        state.accountSummary = action.payload;
        state.error.accountSummary = null;
      })
      .addCase(fetchAccountSummary.rejected, (state, action) => {
        state.status.accountSummary = 'failed';
        state.error.accountSummary = action.payload;
      })
      
      // Fetch recent transactions
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.status.recentTransactions = 'loading';
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.status.recentTransactions = 'succeeded';
        state.recentTransactions = action.payload;
        state.error.recentTransactions = null;
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.status.recentTransactions = 'failed';
        state.error.recentTransactions = action.payload;
      })
      
      // Fetch financial highlights
      .addCase(fetchFinancialHighlights.pending, (state) => {
        state.status.financialHighlights = 'loading';
      })
      .addCase(fetchFinancialHighlights.fulfilled, (state, action) => {
        state.status.financialHighlights = 'succeeded';
        state.financialHighlights = action.payload;
        state.error.financialHighlights = null;
      })
      .addCase(fetchFinancialHighlights.rejected, (state, action) => {
        state.status.financialHighlights = 'failed';
        state.error.financialHighlights = action.payload;
      })
      
      // Fetch market pulse
      .addCase(fetchMarketPulse.pending, (state) => {
        state.status.marketPulse = 'loading';
      })
      .addCase(fetchMarketPulse.fulfilled, (state, action) => {
        state.status.marketPulse = 'succeeded';
        state.marketPulse = action.payload;
        state.error.marketPulse = null;
      })
      .addCase(fetchMarketPulse.rejected, (state, action) => {
        state.status.marketPulse = 'failed';
        state.error.marketPulse = action.payload;
      })
      
      // Fetch market news
      .addCase(fetchMarketNews.pending, (state) => {
        state.status.marketNews = 'loading';
      })
      .addCase(fetchMarketNews.fulfilled, (state, action) => {
        state.status.marketNews = 'succeeded';
        state.marketNews = action.payload;
        state.error.marketNews = null;
      })
      .addCase(fetchMarketNews.rejected, (state, action) => {
        state.status.marketNews = 'failed';
        state.error.marketNews = action.payload;
      })
      
      // Fetch price alerts
      .addCase(fetchPriceAlerts.pending, (state) => {
        state.status.priceAlerts = 'loading';
      })
      .addCase(fetchPriceAlerts.fulfilled, (state, action) => {
        state.status.priceAlerts = 'succeeded';
        state.priceAlerts = action.payload;
        state.error.priceAlerts = null;
      })
      .addCase(fetchPriceAlerts.rejected, (state, action) => {
        state.status.priceAlerts = 'failed';
        state.error.priceAlerts = action.payload;
      })
      
      // Create price alert
      .addCase(createPriceAlert.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(createPriceAlert.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.priceAlerts.alerts.unshift(action.payload);
        state.error.priceAlerts = null;
      })
      .addCase(createPriceAlert.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error.priceAlerts = action.payload;
      })
      
      // Update price alert
      .addCase(updatePriceAlert.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updatePriceAlert.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const index = state.priceAlerts.alerts.findIndex(alert => alert._id === action.payload._id);
        if (index !== -1) {
          state.priceAlerts.alerts[index] = action.payload;
        }
        state.error.priceAlerts = null;
      })
      .addCase(updatePriceAlert.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error.priceAlerts = action.payload;
      })
      
      // Delete price alert
      .addCase(deletePriceAlert.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(deletePriceAlert.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.priceAlerts.alerts = state.priceAlerts.alerts.filter(alert => alert._id !== action.payload);
        state.error.priceAlerts = null;
      })
      .addCase(deletePriceAlert.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error.priceAlerts = action.payload;
      });
  }
});

// Export actions
export const { clearDashboardError } = dashboardSlice.actions;

// Base selectors
const getDashboardState = state => state.dashboard;
const getAccountSummary = state => state.dashboard.accountSummary;
const getAccountActivity = state => state.dashboard.accountActivity;
const getRecentTransactions = state => state.dashboard.recentTransactions;
const getFinancialHighlights = state => state.dashboard.financialHighlights;
const getMarketOverview = state => state.dashboard.marketOverview;
const getMarketPulse = state => state.dashboard.marketPulse;
const getMarketNews = state => state.dashboard.marketNews;
const getPriceAlerts = state => state.dashboard.priceAlerts;

// Memoized selectors using createSelector to prevent unnecessary rerenders
export const selectAccountSummary = createSelector(
  [getAccountSummary],
  summary => summary?.data || null
);

export const selectAccountActivity = createSelector(
  [getAccountActivity],
  activity => activity?.data || []
);

export const selectAccountBalanceHistory = createSelector(
  [getDashboardState],
  dashboard => dashboard.accountBalanceHistory?.data || []
);

export const selectAccountOverview = createSelector(
  [getDashboardState],
  dashboard => dashboard.accountOverview?.data || null
);

export const selectRecentTransactions = createSelector(
  [getRecentTransactions],
  transactions => transactions?.data || []
);

export const selectFinancialHighlights = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data || null
);

export const selectMarketOverview = createSelector(
  [getMarketOverview],
  overview => overview?.data || null
);

export const selectMarketPulse = createSelector(
  [getMarketPulse],
  pulse => pulse?.data || null
);

export const selectMarketNews = createSelector(
  [getMarketNews],
  news => news?.data || []
);

export const selectPriceAlerts = createSelector(
  [getPriceAlerts],
  alerts => alerts?.data || []
);

export const selectAccountBalance = createSelector(
  [getAccountSummary],
  summary => summary?.data?.balance || 0
);

export const selectDashboardComponentStatus = createSelector(
  [getDashboardState, (_, component) => component],
  (dashboard, component) => dashboard.componentStatus?.[component] || 'idle'
);

export const selectTransactionCount = createSelector(
  [getRecentTransactions],
  transactions => transactions?.meta?.total || 0
);

export const selectTransactionsLoading = createSelector(
  [getDashboardState],
  dashboard => dashboard.status?.recentTransactions === 'loading'
);

export const selectTransactionsError = createSelector(
  [getDashboardState],
  dashboard => dashboard.error?.recentTransactions
);

export const selectDashboardLoading = createSelector(
  [getDashboardState, (_, section) => section],
  (dashboard, section) => dashboard.status[section] === 'loading'
);

export const selectDashboardError = createSelector(
  [getDashboardState, (_, section) => section],
  (dashboard, section) => dashboard.error[section]
);

export const selectDashboardStatus = createSelector(
  [getDashboardState, (_, section) => section],
  (dashboard, section) => dashboard.status[section]
);

export const selectActionStatus = createSelector(
  [getDashboardState],
  dashboard => dashboard.actionStatus
);

export const selectMarketPrices = createSelector(
  [getMarketOverview],
  overview => overview?.data?.prices || []
);

export const selectMarketIndices = createSelector(
  [getMarketOverview],
  overview => overview?.data?.indices || []
);

export const selectMarketCurrencies = createSelector(
  [getMarketOverview],
  overview => overview?.data?.currencies || []
);

export const selectMarketCommodities = createSelector(
  [getMarketOverview],
  overview => overview?.data?.commodities || []
);

export const selectMarketSentiment = createSelector(
  [getMarketPulse],
  pulse => pulse?.data?.sentiment || { overall: 'neutral', score: 50 }
);

export const selectMarketTrends = createSelector(
  [getMarketPulse],
  pulse => pulse?.data?.trends || []
);

export const selectMarketVolatility = createSelector(
  [getMarketPulse],
  pulse => pulse?.data?.volatilityIndex || 0
);

export const selectMarketCapitalization = createSelector(
  [getMarketPulse],
  pulse => pulse?.data?.marketCap || { total: 0, change: 0 }
);

export const selectLatestNews = createSelector(
  [getMarketNews],
  news => news?.data?.slice(0, 3) || []
);

export const selectNewsCategories = createSelector(
  [getMarketNews],
  news => news?.categories || []
);

export const selectNewsSources = createSelector(
  [getMarketNews],
  news => news?.sources || []
);

export const selectDepositStats = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data?.depositTotal || 0
);

export const selectWithdrawalStats = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data?.withdrawalTotal || 0
);

export const selectInvestmentStats = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data?.investmentTotal || 0
);

export const selectProfitLoss = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data?.profitLoss || 0
);

export const selectProfitLossPercentage = createSelector(
  [getFinancialHighlights],
  highlights => highlights?.data?.profitLossPercentage || 0
);

export const selectPriceAlertById = createSelector(
  [getPriceAlerts, (_, id) => id],
  (alerts, id) => alerts?.data?.find(alert => alert.id === id) || null
);

export const selectPriceAlertsStatus = createSelector(
  [getDashboardState],
  dashboard => dashboard.status.priceAlerts
);

export const selectAddPriceAlertStatus = createSelector(
  [getDashboardState],
  dashboard => dashboard.status.addPriceAlert
);

export const selectUpdatePriceAlertStatus = createSelector(
  [getDashboardState],
  dashboard => dashboard.status.updatePriceAlert
);

export const selectDeletePriceAlertStatus = createSelector(
  [getDashboardState],
  dashboard => dashboard.status.deletePriceAlert
);

export const selectPriceAlertsError = createSelector(
  [getDashboardState],
  dashboard => dashboard.error.priceAlerts
);

export default dashboardSlice.reducer;
