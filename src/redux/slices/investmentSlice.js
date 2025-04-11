import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Initial state
const initialState = {
  investmentPlans: {
    data: [],
    status: 'idle',
    error: null
  },
  userInvestments: {
    active: [],
    history: [],
    status: 'idle',
    error: null
  },
  statistics: {
    data: {
      totalInvested: 0,
      totalReturns: 0,
      activeInvestments: 0,
      completedInvestments: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    },
    status: 'idle',
    error: null
  },
  selectedPlan: null,
  successModal: {
    isOpen: false,
    investmentData: null
  },
  status: {
    fetchPlans: 'idle',
    fetchInvestments: 'idle',
    investmentOperation: 'idle',
    withdrawal: 'idle',
    cancellation: 'idle',
    statistics: 'idle'
  },
  error: {
    fetchPlans: null,
    fetchInvestments: null,
    investmentOperation: null,
    withdrawal: null,
    cancellation: null,
    statistics: null
  },
  investmentForm: {
    planId: null,
    amount: 0,
    duration: 0,
    paymentMethod: null,
    agreedToTerms: false
  }
};

// Async thunks
export const fetchInvestmentPlans = createAsyncThunk(
  'investments/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/investments/plans');
      console.log('Investment plans response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching investment plans:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch investment plans');
    }
  }
);

export const fetchUserInvestments = createAsyncThunk(
  'investments/fetchUserInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/investments/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user investments:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user investments');
    }
  }
);

export const makeInvestment = createAsyncThunk(
  'investments/makeInvestment',
  async (investmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/investments', investmentData);
      return response.data.data || response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Failed to make investment. Please try again later.'
      );
    }
  }
);

export const cancelInvestment = createAsyncThunk(
  'investments/cancelInvestment',
  async (investmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/investments/${investmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling investment:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel investment');
    }
  }
);

export const withdrawInvestment = createAsyncThunk(
  'investments/withdrawInvestment',
  async (investmentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/investments/${investmentId}/withdraw`);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing investment:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw investment');
    }
  }
);

export const fetchInvestmentStatistics = createAsyncThunk(
  'investments/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/investments/user/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching investment statistics:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch investment statistics');
    }
  }
);

// Create the investment slice
const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    resetInvestmentStatus: (state, action) => {
      const operation = action.payload;
      if (operation) {
        state.status[operation] = 'idle';
        state.error[operation] = null;
      } else {
        // Reset all statuses if no operation specified
        Object.keys(state.status).forEach(key => {
          state.status[key] = 'idle';
          state.error[key] = null;
        });
      }
    },
    openSuccessModal: (state, action) => {
      state.successModal = {
        isOpen: true,
        investmentData: action.payload
      };
    },
    closeSuccessModal: (state) => {
      state.successModal = {
        isOpen: false,
        investmentData: null
      };
    },
    // Add updateInvestmentForm reducer
    updateInvestmentForm: (state, action) => {
      state.investmentForm = {
        ...state.investmentForm,
        ...action.payload
      };
    },
    // Add resetInvestmentForm reducer for convenience
    resetInvestmentForm: (state) => {
      state.investmentForm = initialState.investmentForm;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchInvestmentPlans
    builder
      .addCase(fetchInvestmentPlans.pending, (state) => {
        state.status.fetchPlans = 'loading';
      })
      .addCase(fetchInvestmentPlans.fulfilled, (state, action) => {
        state.investmentPlans.data = action.payload;
        state.status.fetchPlans = 'succeeded';
        state.error.fetchPlans = null;
      })
      .addCase(fetchInvestmentPlans.rejected, (state, action) => {
        state.status.fetchPlans = 'failed';
        state.error.fetchPlans = action.payload;
      })

      // Handle fetchUserInvestments
      .addCase(fetchUserInvestments.pending, (state) => {
        state.status.fetchInvestments = 'loading';
      })
      .addCase(fetchUserInvestments.fulfilled, (state, action) => {
        state.userInvestments.active = action.payload.active || [];
        state.userInvestments.history = action.payload.history || [];
        state.status.fetchInvestments = 'succeeded';
        state.error.fetchInvestments = null;
      })
      .addCase(fetchUserInvestments.rejected, (state, action) => {
        state.status.fetchInvestments = 'failed';
        state.error.fetchInvestments = action.payload;
      })

      // Handle makeInvestment
      .addCase(makeInvestment.pending, (state) => {
        state.status.investmentOperation = 'loading';
      })
      .addCase(makeInvestment.fulfilled, (state, action) => {
        state.userInvestments.active.push(action.payload);
        state.status.investmentOperation = 'succeeded';
        state.error.investmentOperation = null;
        // Reset form on successful investment
        state.investmentForm = initialState.investmentForm;
      })
      .addCase(makeInvestment.rejected, (state, action) => {
        state.status.investmentOperation = 'failed';
        state.error.investmentOperation = action.payload;
      })

      // Handle cancelInvestment
      .addCase(cancelInvestment.pending, (state) => {
        state.status.cancellation = 'loading';
      })
      .addCase(cancelInvestment.fulfilled, (state, action) => {
        // Move from active to history
        state.userInvestments.active = state.userInvestments.active.filter(
          investment => investment.id !== action.payload.id
        );
        state.userInvestments.history.unshift(action.payload);
        state.status.cancellation = 'succeeded';
        state.error.cancellation = null;
      })
      .addCase(cancelInvestment.rejected, (state, action) => {
        state.status.cancellation = 'failed';
        state.error.cancellation = action.payload;
      })

      // Handle withdrawInvestment
      .addCase(withdrawInvestment.pending, (state) => {
        state.status.withdrawal = 'loading';
      })
      .addCase(withdrawInvestment.fulfilled, (state, action) => {
        // Move from active to history
        state.userInvestments.active = state.userInvestments.active.filter(
          investment => investment.id !== action.payload.id
        );
        state.userInvestments.history.unshift(action.payload);
        state.status.withdrawal = 'succeeded';
        state.error.withdrawal = null;
      })
      .addCase(withdrawInvestment.rejected, (state, action) => {
        state.status.withdrawal = 'failed';
        state.error.withdrawal = action.payload;
      })

      // Handle fetchInvestmentStatistics
      .addCase(fetchInvestmentStatistics.pending, (state) => {
        state.status.statistics = 'loading';
      })
      .addCase(fetchInvestmentStatistics.fulfilled, (state, action) => {
        state.statistics.data = action.payload;
        state.status.statistics = 'succeeded';
        state.error.statistics = null;
      })
      .addCase(fetchInvestmentStatistics.rejected, (state, action) => {
        state.status.statistics = 'failed';
        state.error.statistics = action.payload;
      });
  },
});

// Export actions
export const { 
  setSelectedPlan, 
  resetInvestmentStatus, 
  openSuccessModal, 
  closeSuccessModal,
  updateInvestmentForm,
  resetInvestmentForm
} = investmentSlice.actions;

const getInvestmentState = state => state.investment;
const getInvestmentPlansState = state => state.investment?.investmentPlans;
const getUserInvestmentsState = state => state.investment?.userInvestments;
const getStatisticsState = state => state.investment?.statistics;

// Memoized selectors
export const selectInvestmentPlans = createSelector(
  [getInvestmentPlansState],
  (plans) => plans?.data || []
);

export const selectActiveInvestments = createSelector(
  [getUserInvestmentsState],
  (userInvestments) => userInvestments?.active || []
);

export const selectHistoryInvestments = createSelector(
  [getUserInvestmentsState],
  (userInvestments) => userInvestments?.history || []
);

export const selectSelectedPlan = createSelector(
  [getInvestmentState],
  (investments) => investments?.selectedPlan
);

export const selectInvestmentStatus = createSelector(
  [getInvestmentState, (_, operation) => operation],
  (investments, operation) => investments?.status[operation] || 'idle'
);

export const selectInvestmentError = createSelector(
  [getInvestmentState, (_, operation) => operation],
  (investments, operation) => investments?.error[operation]
);

export const selectInvestmentStatistics = createSelector(
  [getStatisticsState],
  (statistics) => statistics?.data || {
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  }
);

const getSuccessModalState = state => state.investment?.successModal;

export const selectSuccessModal = createSelector(
  [getSuccessModalState],
  (successModal) => successModal || {
    isOpen: false,
    investmentData: null
  }
);

// Add the missing selector
export const selectInvestmentForm = createSelector(
  [getInvestmentState],
  (investments) => investments?.investmentForm || initialState.investmentForm
);

export default investmentSlice.reducer;
