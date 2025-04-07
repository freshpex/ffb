import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Fetch analytics overview for dashboard
export const fetchAnalyticsOverview = createAsyncThunk(
  'adminAnalytics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/analytics/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch analytics overview');
    }
  }
);

// Fetch user growth analytics
export const fetchUserGrowthAnalytics = createAsyncThunk(
  'adminAnalytics/fetchUserGrowth',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { period = 'month', start, end } = params;
      
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        period,
        ...(start && { start }),
        ...(end && { end })
      });
      
      const response = await fetch(`${API_URL}/admin/analytics/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user growth analytics');
    }
  }
);

// Fetch financial analytics
export const fetchFinancialAnalytics = createAsyncThunk(
  'adminAnalytics/fetchFinancial',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { period = 'month', start, end, currency = 'USD' } = params;
      
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        period,
        currency,
        ...(start && { start }),
        ...(end && { end })
      });
      
      const response = await fetch(`${API_URL}/admin/analytics/financial?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch financial analytics');
    }
  }
);

// Fetch transaction analytics
export const fetchTransactionAnalytics = createAsyncThunk(
  'adminAnalytics/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { period = 'day', limit = 30 } = params;
      
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        period,
        limit
      });
      
      const response = await fetch(`${API_URL}/admin/analytics/transactions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transaction analytics');
    }
  }
);

// Fetch performance analytics
export const fetchPerformanceAnalytics = createAsyncThunk(
  'adminAnalytics/fetchPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/analytics/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch performance analytics');
    }
  }
);

// Initial state
const initialState = {
  overview: null,
  userGrowth: null,
  financial: null,
  transactions: null,
  performance: null,
  status: {
    overview: 'idle',
    userGrowth: 'idle',
    financial: 'idle',
    transactions: 'idle',
    performance: 'idle'
  },
  error: {
    overview: null,
    userGrowth: null,
    financial: null,
    transactions: null,
    performance: null
  },
  lastFetched: {
    overview: null,
    userGrowth: null,
    financial: null,
    transactions: null,
    performance: null
  }
};

const adminAnalyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state, action) => {
      const { section } = action.payload || {};
      if (section && state.error[section]) {
        state.error[section] = null;
      } else {
        state.error = {
          overview: null,
          userGrowth: null,
          financial: null,
          transactions: null,
          performance: null
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch analytics overview
      .addCase(fetchAnalyticsOverview.pending, (state) => {
        state.status.overview = 'loading';
      })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.status.overview = 'succeeded';
        state.overview = action.payload;
        state.error.overview = null;
        state.lastFetched.overview = new Date().toISOString();
      })
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => {
        state.status.overview = 'failed';
        state.error.overview = action.payload;
      })
      
      // Fetch user growth analytics
      .addCase(fetchUserGrowthAnalytics.pending, (state) => {
        state.status.userGrowth = 'loading';
      })
      .addCase(fetchUserGrowthAnalytics.fulfilled, (state, action) => {
        state.status.userGrowth = 'succeeded';
        state.userGrowth = action.payload;
        state.error.userGrowth = null;
        state.lastFetched.userGrowth = new Date().toISOString();
      })
      .addCase(fetchUserGrowthAnalytics.rejected, (state, action) => {
        state.status.userGrowth = 'failed';
        state.error.userGrowth = action.payload;
      })
      
      // Fetch financial analytics
      .addCase(fetchFinancialAnalytics.pending, (state) => {
        state.status.financial = 'loading';
      })
      .addCase(fetchFinancialAnalytics.fulfilled, (state, action) => {
        state.status.financial = 'succeeded';
        state.financial = action.payload;
        state.error.financial = null;
        state.lastFetched.financial = new Date().toISOString();
      })
      .addCase(fetchFinancialAnalytics.rejected, (state, action) => {
        state.status.financial = 'failed';
        state.error.financial = action.payload;
      })
      
      // Fetch transaction analytics
      .addCase(fetchTransactionAnalytics.pending, (state) => {
        state.status.transactions = 'loading';
      })
      .addCase(fetchTransactionAnalytics.fulfilled, (state, action) => {
        state.status.transactions = 'succeeded';
        state.transactions = action.payload;
        state.error.transactions = null;
        state.lastFetched.transactions = new Date().toISOString();
      })
      .addCase(fetchTransactionAnalytics.rejected, (state, action) => {
        state.status.transactions = 'failed';
        state.error.transactions = action.payload;
      })
      
      // Fetch performance analytics
      .addCase(fetchPerformanceAnalytics.pending, (state) => {
        state.status.performance = 'loading';
      })
      .addCase(fetchPerformanceAnalytics.fulfilled, (state, action) => {
        state.status.performance = 'succeeded';
        state.performance = action.payload;
        state.error.performance = null;
        state.lastFetched.performance = new Date().toISOString();
      })
      .addCase(fetchPerformanceAnalytics.rejected, (state, action) => {
        state.status.performance = 'failed';
        state.error.performance = action.payload;
      });
  }
});

// Export actions
export const { clearAnalyticsError } = adminAnalyticsSlice.actions;

// Export selectors
export const selectAnalyticsOverview = state => state.adminAnalytics.overview;
export const selectUserGrowthAnalytics = state => state.adminAnalytics.userGrowth;
export const selectFinancialAnalytics = state => state.adminAnalytics.financial;
export const selectTransactionAnalytics = state => state.adminAnalytics.transactions;
export const selectPerformanceAnalytics = state => state.adminAnalytics.performance;

export const selectAnalyticsStatus = (state, section) => state.adminAnalytics.status[section];
export const selectAnalyticsError = (state, section) => state.adminAnalytics.error[section];
export const selectAnalyticsLastFetched = (state, section) => state.adminAnalytics.lastFetched[section];

export default adminAnalyticsSlice.reducer;
