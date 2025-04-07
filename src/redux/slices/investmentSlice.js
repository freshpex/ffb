import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const getAuthToken = () => {
  const token = localStorage.getItem('ffb_auth_token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return token;
};

// Async thunks
export const fetchInvestmentPlans = createAsyncThunk(
  'investments/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/investments/plans`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle auth errors specifically
        if (response.status === 401) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('ffb_auth_token');
          window.location.href = '/login';
          return rejectWithValue('Authentication session expired');
        }
        
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch investment plans');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      if (error.message === 'Authentication required') {
        window.location.href = '/login';
      }
      return rejectWithValue(error.message || 'Failed to fetch investment plans');
    }
  }
);

export const getUserInvestments = createAsyncThunk(
  'investment/getUserInvestments',
  async (_, { rejectWithValue }) => {
    try {
      // Use the new endpoint instead of /api/investments/user
      const response = await apiClient.get('/api/investments/user-investments');
      return response.data;
    } catch (error) {
      console.error('Error fetching user investments:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user investments'
      );
    }
  }
);

// Make sure the getInvestmentPlans thunk is correctly implemented
export const getInvestmentPlans = createAsyncThunk(
  'investment/getInvestmentPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/investments/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching investment plans:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch investment plans'
      );
    }
  }
);

export const fetchUserInvestments = createAsyncThunk(
  'investments/fetchUserInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/investments/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user investments');
    }
  }
);

export const makeInvestment = createAsyncThunk(
  'investments/makeInvestment',
  async (investmentData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/investments`, investmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to make investment');
    }
  }
);

export const cancelInvestment = createAsyncThunk(
  'investments/cancelInvestment',
  async (investmentId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/investments/${investmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel investment');
    }
  }
);

export const withdrawInvestment = createAsyncThunk(
  'investments/withdrawInvestment',
  async (investmentId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/investments/${investmentId}/withdraw`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw investment');
    }
  }
);

export const fetchInvestmentStatistics = createAsyncThunk(
  'investments/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/investments/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
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
      })
      .addCase(getInvestmentPlans.pending, (state) => {
        state.plansLoading = true;
        state.plansError = null;
      })
      .addCase(getInvestmentPlans.fulfilled, (state, action) => {
        state.plansLoading = false;
        state.plans = action.payload.data || [];
      })
      .addCase(getInvestmentPlans.rejected, (state, action) => {
        state.plansLoading = false;
        state.plansError = action.payload;
      });
  },
});

// Export actionsssModal || {
export const { 
  setSelectedPlan, 
  resetInvestmentStatus, 
  openSuccessModal, 
  closeSuccessModal,
  updateInvestmentForm,
  resetInvestmentForm
} = investmentSlice.actions;

// Export selectors
export const selectInvestmentPlans = (state) => state.investments?.investmentPlans?.data || [];
export const selectActiveInvestments = (state) => state.investments?.userInvestments?.active || [];
export const selectHistoryInvestments = (state) => state.investments?.userInvestments?.history || [];
export const selectSelectedPlan = (state) => state.investments?.selectedPlan;
export const selectInvestmentStatus = (state, operation) => state.investments?.status[operation] || 'idle';
export const selectInvestmentError = (state, operation) => state.investments?.error[operation];
export const selectInvestmentStatistics = (state) => state.investments?.statistics?.data || {
  totalInvested: 0,
  totalReturns: 0,
  activeInvestments: 0,
  completedInvestments: 0,
  profitLoss: 0,
  profitLossPercentage: 0
};

const getSuccessModalState = state => state.investments?.successModal;

export const selectSuccessModal = createSelector(
  [getSuccessModalState],
  (successModal) => successModal || {
    isOpen: false,
    investmentData: null
  }
);

// Add the missing selector
export const selectInvestmentForm = (state) => state.investments?.investmentForm || initialState.investmentForm;

export default investmentSlice.reducer;
