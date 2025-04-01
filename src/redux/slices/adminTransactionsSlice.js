import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockTransactions } from '../../utils/mockDataGenerator';

// Generate 100 mock transactions
const mockTransactions = generateMockTransactions(100);

// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  'adminTransactions/fetchTransactions',
  async ({ page = 1, limit = 10, type = '', status = '', dateRange = null }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter transactions
      let filteredTransactions = [...mockTransactions];
      
      if (type) {
        filteredTransactions = filteredTransactions.filter(tx => tx.type === type);
      }
      
      if (status) {
        filteredTransactions = filteredTransactions.filter(tx => tx.status === status);
      }
      
      if (dateRange && dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start).getTime();
        const endDate = new Date(dateRange.end).getTime();
        
        filteredTransactions = filteredTransactions.filter(tx => {
          const txDate = new Date(tx.date).getTime();
          return txDate >= startDate && txDate <= endDate;
        });
      }
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calculate pagination
      const totalTransactions = filteredTransactions.length;
      const totalPages = Math.ceil(totalTransactions / limit);
      const startIndex = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);
      
      return {
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit,
          totalTransactions,
          totalPages
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

// Fetch transaction by ID
export const fetchTransactionById = createAsyncThunk(
  'adminTransactions/fetchTransactionById',
  async (transactionId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const transaction = mockTransactions.find(tx => tx.id === transactionId);
      
      if (!transaction) {
        return rejectWithValue('Transaction not found');
      }
      
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transaction');
    }
  }
);

// Approve transaction
export const approveTransaction = createAsyncThunk(
  'adminTransactions/approveTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const transactionIndex = mockTransactions.findIndex(tx => tx.id === transactionId);
      
      if (transactionIndex === -1) {
        return rejectWithValue('Transaction not found');
      }
      
      if (mockTransactions[transactionIndex].status !== 'pending') {
        return rejectWithValue('Only pending transactions can be approved');
      }
      
      // Update transaction status
      const updatedTransaction = {
        ...mockTransactions[transactionIndex],
        status: 'completed',
        updatedAt: new Date().toISOString(),
        approvedBy: 'admin-1',
        approvedAt: new Date().toISOString()
      };
      
      // Update mock data (in a real app, this would be done by the API)
      mockTransactions[transactionIndex] = updatedTransaction;
      
      return updatedTransaction;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve transaction');
    }
  }
);

// Reject transaction
export const rejectTransaction = createAsyncThunk(
  'adminTransactions/rejectTransaction',
  async ({ transactionId, reason }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const transactionIndex = mockTransactions.findIndex(tx => tx.id === transactionId);
      
      if (transactionIndex === -1) {
        return rejectWithValue('Transaction not found');
      }
      
      if (mockTransactions[transactionIndex].status !== 'pending') {
        return rejectWithValue('Only pending transactions can be rejected');
      }
      
      // Update transaction status
      const updatedTransaction = {
        ...mockTransactions[transactionIndex],
        status: 'rejected',
        updatedAt: new Date().toISOString(),
        rejectedBy: 'admin-1',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Rejected by administrator'
      };
      
      // Update mock data
      mockTransactions[transactionIndex] = updatedTransaction;
      
      return updatedTransaction;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject transaction');
    }
  }
);

// Create initial state
const initialState = {
  transactions: [],
  selectedTransaction: null,
  pagination: {
    page: 1,
    limit: 10,
    totalTransactions: 0,
    totalPages: 0
  },
  status: 'idle',
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
    clearTransactionsError: (state) => {
      state.error = null;
    },
    resetActionStatus: (state) => {
      state.actionStatus = 'idle';
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
        state.pagination = action.payload.pagination;
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
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Approve transaction
      .addCase(approveTransaction.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(approveTransaction.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTransaction = action.payload;
        
        // Update transaction in the list if it exists
        const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(approveTransaction.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Reject transaction
      .addCase(rejectTransaction.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTransaction = action.payload;
        
        // Update transaction in the list if it exists
        const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(rejectTransaction.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearSelectedTransaction, 
  clearTransactionsError, 
  resetActionStatus 
} = adminTransactionsSlice.actions;

// Export selectors
export const selectTransactions = state => state.adminTransactions.transactions;
export const selectSelectedTransaction = state => state.adminTransactions.selectedTransaction;
export const selectTransactionsPagination = state => state.adminTransactions.pagination;
export const selectTransactionsStatus = state => state.adminTransactions.status;
export const selectTransactionsError = state => state.adminTransactions.error;
export const selectTransactionActionStatus = state => state.adminTransactions.actionStatus;

export default adminTransactionsSlice.reducer;
