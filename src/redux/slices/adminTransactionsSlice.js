import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

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

// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  'adminTransactions/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, type, status, userId, startDate, endDate } = params;
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(type && { type }),
        ...(status && { status }),
        ...(userId && { userId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });
      
      // Get token from localStorage
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/transactions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

// Fetch transaction by ID
export const fetchTransactionById = createAsyncThunk(
  'adminTransactions/fetchTransactionById',
  async (id, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transaction');
    }
  }
);

// Process transaction (approve or reject)
export const processTransaction = createAsyncThunk(
  'adminTransactions/processTransaction',
  async ({ id, action, notes }, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/transactions/${id}/process`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, notes })
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to process transaction');
    }
  }
);

// Fetch transaction statistics
export const fetchTransactionStats = createAsyncThunk(
  'adminTransactions/fetchTransactionStats',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/transactions/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transaction statistics');
    }
  }
);

// Create initial state
const initialState = {
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalTransactions: 0
  },
  selectedTransaction: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: 'idle'
};

const adminTransactionsSlice = createSlice({
  name: 'adminTransactions',
  initialState,
  reducers: {
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
    clearTransactionError: (state) => {
      state.error = null;
      state.actionStatus = 'idle';
    },
    setTransactionFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload.transactions;
        state.pagination = {
          page: action.payload.pagination.currentPage || 1,
          limit: action.payload.pagination.limit || 10,
          totalPages: action.payload.pagination.totalPages || 0,
          totalTransactions: action.payload.pagination.total || 0 // Make sure this property is correctly mapped
        };
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch transaction by ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTransaction = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Process transaction
      .addCase(processTransaction.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(processTransaction.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTransaction = action.payload;
        
        // Update transaction in the list if it exists
        const index = state.transactions.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(processTransaction.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Fetch transaction stats
      .addCase(fetchTransactionStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearSelectedTransaction, 
  clearTransactionError,
  setTransactionFilters
} = adminTransactionsSlice.actions;

// Export selectors
export const selectTransactions = state => state.adminTransactions.transactions;
export const selectSelectedTransaction = state => state.adminTransactions.selectedTransaction;
export const selectTransactionsPagination = state => state.adminTransactions.pagination;
export const selectTransactionsStatus = state => state.adminTransactions.status;
export const selectTransactionsError = state => state.adminTransactions.error;
export const selectTransactionActionStatus = state => state.adminTransactions.actionStatus;
export const selectTransactionStats = state => state.adminTransactions.stats;

export default adminTransactionsSlice.reducer;
