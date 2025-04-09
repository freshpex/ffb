import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Async thunk to fetch user referrals
export const fetchReferrals = createAsyncThunk(
  'referral/fetchReferrals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/referrals');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch referrals');
    }
  }
);

// Async thunk to fetch commission history
export const fetchCommissionHistory = createAsyncThunk(
  'referral/fetchCommissionHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/referrals/commissions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commission history');
    }
  }
);

// Async thunk to generate a new referral link
export const generateNewReferralLink = createAsyncThunk(
  'referral/generateNewReferralLink',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/referrals/generate-link');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate new referral link');
    }
  }
);

// Initial state
const initialState = {
  referrals: [],
  commissionHistory: [],
  referralLink: '',
  referralCode: '',
  statistics: {
    totalReferrals: 0,
    totalEarnings: 0,
    pendingCommissions: 0,
    activeReferrals: 0
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

// Create the referral slice
const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    // Reset referral state
    resetReferralState: (state) => {
      state = initialState;
    },
    
    // Update pagination
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchReferrals
      .addCase(fetchReferrals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.referrals = action.payload.data.referrals || [];
        state.referralLink = action.payload.data.referralLink || '';
        state.referralCode = action.payload.data.referralCode || '';
        state.statistics = {
          totalReferrals: action.payload.data.totalReferrals || 0,
          totalEarnings: action.payload.data.totalEarnings || 0,
          pendingCommissions: action.payload.data.pendingCommissions || 0,
          activeReferrals: action.payload.data.activeReferrals || 0
        };
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle fetchCommissionHistory
      .addCase(fetchCommissionHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCommissionHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.commissionHistory = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.totalItems || 0,
          itemsPerPage: action.payload.itemsPerPage || 10
        };
      })
      .addCase(fetchCommissionHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle generateNewReferralLink
      .addCase(generateNewReferralLink.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateNewReferralLink.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.referralLink = action.payload.data.referralLink || '';
        state.referralCode = action.payload.data.referralCode || '';
      })
      .addCase(generateNewReferralLink.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions from the slice
export const { resetReferralState, setCurrentPage } = referralSlice.actions;

// Selectors
export const selectReferrals = state => state.referral.referrals;
export const selectCommissionHistory = state => state.referral.commissionHistory;
export const selectReferralLink = state => state.referral.referralLink;
export const selectReferralCode = state => state.referral.referralCode;
export const selectReferralStatistics = state => state.referral.statistics;
export const selectReferralStatus = state => state.referral.status;
export const selectReferralError = state => state.referral.error;
export const selectReferralPagination = state => state.referral.pagination;

export default referralSlice.reducer;
