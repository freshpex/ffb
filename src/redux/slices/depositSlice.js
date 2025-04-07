import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Initial state structure
const initialState = {
  methods: [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'bank', minAmount: 100, maxAmount: 50000 },
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card', minAmount: 50, maxAmount: 10000 },
    { id: 'crypto', name: 'Cryptocurrency', icon: 'bitcoin', minAmount: 20, maxAmount: 100000 },
  ],
  activeMethod: null,
  depositForm: {
    amount: '',
    currency: 'USD',
    note: '',
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pendingDeposits: [],
  depositHistory: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

// Async thunks
export const submitDeposit = createAsyncThunk(
  'deposit/submitDeposit',
  async (depositData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/deposits', depositData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process deposit');
    }
  }
);

export const fetchDepositHistory = createAsyncThunk(
  'deposit/fetchHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/deposits/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch deposit history');
    }
  }
);

// Create the slice
const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setActiveMethod: (state, action) => {
      state.activeMethod = action.payload;
    },
    updateDepositForm: (state, action) => {
      state.depositForm = {
        ...state.depositForm,
        ...action.payload
      };
    },
    resetDepositForm: (state) => {
      state.depositForm = initialState.depositForm;
      state.activeMethod = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle submitDeposit
      .addCase(submitDeposit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitDeposit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingDeposits = [...state.pendingDeposits, action.payload.data];
        state.depositForm = initialState.depositForm;
      })
      .addCase(submitDeposit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle fetchDepositHistory
      .addCase(fetchDepositHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDepositHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.depositHistory = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.totalItems || 0,
          itemsPerPage: action.payload.itemsPerPage || 10
        };
      })
      .addCase(fetchDepositHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  setActiveMethod, 
  updateDepositForm, 
  resetDepositForm,
  setCurrentPage
} = depositSlice.actions;

// Selectors
export const selectDepositMethods = state => state.deposit.methods;
export const selectActiveMethod = state => state.deposit.activeMethod;
export const selectDepositForm = state => state.deposit.depositForm;
export const selectDepositStatus = state => state.deposit.status;
export const selectDepositError = state => state.deposit.error;
export const selectPendingDeposit = state => state.deposit.pendingDeposits[0] || null;
export const selectDepositHistory = state => state.deposit.depositHistory;
export const selectDepositPagination = state => state.deposit.pagination;

export default depositSlice.reducer;
