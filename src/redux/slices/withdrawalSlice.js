import { createSlice } from '@reduxjs/toolkit';
import mockApiService from '../../services/mockApiService';

// Initial state for withdrawal functionality
const initialState = {
  withdrawalMethods: [
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Withdraw funds directly to your bank account',
      logo: '/images/bank-transfer.svg',
      processingTime: '1-3 business days',
      minWithdrawal: 100,
      maxWithdrawal: 25000,
      fees: '0.5%'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Withdraw using Bitcoin cryptocurrency',
      logo: '/images/bitcoin.svg',
      processingTime: '30-60 minutes',
      minWithdrawal: 50,
      maxWithdrawal: null,
      fees: '0.2%'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      description: 'Withdraw using Ethereum cryptocurrency',
      logo: '/images/ethereum.svg',
      processingTime: '30-60 minutes',
      minWithdrawal: 50,
      maxWithdrawal: null,
      fees: '0.25%'
    }
  ],
  activeMethod: null,
  form: {
    amount: '',
    address: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    note: ''
  },
  status: 'idle',
  error: null,
  pendingWithdrawal: null,
  history: [
    {
      id: 'with_123456',
      type: 'withdrawal',
      amount: 500.00,
      currency: 'USD',
      method: 'bank',
      methodName: 'Bank Transfer',
      address: null,
      accountName: 'John Doe',
      accountNumber: '********1234',
      bankName: 'Chase Bank',
      status: 'completed',
      fees: 2.50,
      netAmount: 497.50,
      createdAt: '2023-11-25T14:30:00Z',
      updatedAt: '2023-11-26T10:15:00Z',
      confirmations: 1
    },
    {
      id: 'with_123457',
      type: 'withdrawal',
      amount: 1000.00,
      currency: 'USD',
      method: 'bitcoin',
      methodName: 'Bitcoin',
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      status: 'pending',
      fees: 2.00,
      netAmount: 998.00,
      createdAt: '2023-11-27T09:45:00Z',
      updatedAt: '2023-11-27T09:45:00Z',
      confirmations: 0
    },
    {
      id: 'with_123458',
      type: 'withdrawal',
      amount: 750.00,
      currency: 'USD',
      method: 'ethereum',
      methodName: 'Ethereum',
      address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      status: 'completed',
      fees: 1.88,
      netAmount: 748.12,
      createdAt: '2023-11-20T16:30:00Z',
      updatedAt: '2023-11-21T12:15:00Z',
      confirmations: 12
    },
    {
      id: 'with_123459',
      type: 'withdrawal',
      amount: 300.00,
      currency: 'USD',
      method: 'bank',
      methodName: 'Bank Transfer',
      address: null,
      accountName: 'John Doe',
      accountNumber: '********1234',
      bankName: 'Wells Fargo',
      status: 'rejected',
      reason: 'Insufficient funds',
      fees: 0,
      netAmount: 300.00,
      createdAt: '2023-11-18T11:20:00Z',
      updatedAt: '2023-11-19T09:45:00Z',
      confirmations: 0
    },
    {
      id: 'with_123460',
      type: 'withdrawal',
      amount: 1500.00,
      currency: 'USD',
      method: 'bitcoin',
      methodName: 'Bitcoin',
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      status: 'completed',
      fees: 3.00,
      netAmount: 1497.00,
      createdAt: '2023-11-15T14:30:00Z',
      updatedAt: '2023-11-16T10:15:00Z',
      confirmations: 6
    }
  ],
  pagination: {
    totalItems: 12,
    totalPages: 3,
    currentPage: 1,
    itemsPerPage: 5
  }
};

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    setActiveMethod: (state, action) => {
      state.activeMethod = state.withdrawalMethods.find(method => method.id === action.payload) || null;
    },
    updateWithdrawalForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    submitWithdrawalStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    submitWithdrawalSuccess: (state, action) => {
      state.status = 'succeeded';
      state.pendingWithdrawal = action.payload;
      // Add to history
      state.history.unshift({
        id: action.payload.id,
        type: 'withdrawal',
        amount: action.payload.amount,
        currency: 'USD',
        method: state.activeMethod?.id || 'unknown',
        methodName: state.activeMethod?.name || 'Unknown Method',
        address: state.form.address || null,
        accountName: state.form.accountName || null,
        accountNumber: state.form.accountNumber || null,
        bankName: state.form.bankName || null,
        status: 'pending',
        fees: state.activeMethod ? (action.payload.amount * (parseFloat(state.activeMethod.fees) / 100)) : 0,
        netAmount: action.payload.amount - (state.activeMethod ? (action.payload.amount * (parseFloat(state.activeMethod.fees) / 100)) : 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmations: 0
      });
      // Clear form after successful submission
      state.form = initialState.form;
    },
    submitWithdrawalFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearPendingWithdrawal: (state) => {
      state.pendingWithdrawal = null;
    },
    fetchWithdrawalHistoryStart: (state) => {
      state.status = 'loading';
    },
    fetchWithdrawalHistorySuccess: (state, action) => {
      state.status = 'succeeded';
      state.history = action.payload.transactions;
      state.pagination = {
        totalItems: action.payload.totalCount,
        totalPages: Math.ceil(action.payload.totalCount / action.payload.limit),
        currentPage: action.payload.page,
        itemsPerPage: action.payload.limit
      };
    },
    fetchWithdrawalHistoryFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    cancelWithdrawalStart: (state) => {
      state.status = 'loading';
    },
    cancelWithdrawalSuccess: (state, action) => {
      state.status = 'succeeded';
      const withdrawal = state.history.find(w => w.id === action.payload);
      if (withdrawal) {
        withdrawal.status = 'cancelled';
        withdrawal.updatedAt = new Date().toISOString();
      }
    },
    cancelWithdrawalFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetWithdrawalState: () => initialState
  }
});

export const {
  setActiveMethod,
  updateWithdrawalForm,
  submitWithdrawalStart,
  submitWithdrawalSuccess,
  submitWithdrawalFailure,
  clearPendingWithdrawal,
  fetchWithdrawalHistoryStart,
  fetchWithdrawalHistorySuccess,
  fetchWithdrawalHistoryFailure,
  setCurrentPage,
  cancelWithdrawalStart,
  cancelWithdrawalSuccess,
  cancelWithdrawalFailure,
  resetWithdrawalState
} = withdrawalSlice.actions;

// Thunk for submitting withdrawal
export const submitWithdrawal = (withdrawalData) => async (dispatch) => {
  try {
    dispatch(submitWithdrawalStart());
    
    // Call the mock API service
    const response = await mockApiService.transactions.createWithdrawal({
      amount: parseFloat(withdrawalData.amount),
      method: withdrawalData.method.id,
      address: withdrawalData.address,
      accountName: withdrawalData.accountName,
      accountNumber: withdrawalData.accountNumber,
      bankName: withdrawalData.bankName,
      swiftCode: withdrawalData.swiftCode,
      note: withdrawalData.note
    });
    
    dispatch(submitWithdrawalSuccess({
      id: response.transaction.id,
      amount: parseFloat(withdrawalData.amount),
      method: withdrawalData.method.name,
      status: 'pending',
      date: new Date().toISOString()
    }));
    
    return { success: true };
  } catch (error) {
    dispatch(submitWithdrawalFailure(error.message || 'Failed to process withdrawal'));
    throw error;
  }
};

// Thunk for fetching withdrawal history
export const fetchWithdrawalHistory = (page = 1, limit = 5) => async (dispatch) => {
  try {
    dispatch(fetchWithdrawalHistoryStart());
    
    // Call the mock API service
    const response = await mockApiService.transactions.getWithdrawals({ page, limit });
    
    dispatch(fetchWithdrawalHistorySuccess(response));
    return response;
  } catch (error) {
    dispatch(fetchWithdrawalHistoryFailure(error.message || 'Failed to fetch withdrawal history'));
    throw error;
  }
};

// Thunk for cancelling a withdrawal
export const cancelWithdrawal = (withdrawalId) => async (dispatch) => {
  try {
    dispatch(cancelWithdrawalStart());
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(cancelWithdrawalSuccess(withdrawalId));
    return { success: true };
  } catch (error) {
    dispatch(cancelWithdrawalFailure(error.message || 'Failed to cancel withdrawal'));
    throw error;
  }
};

// Selectors
export const selectWithdrawalMethods = (state) => state.withdrawal?.withdrawalMethods || [];
export const selectActiveMethod = (state) => state.withdrawal?.activeMethod || null;
export const selectWithdrawalForm = (state) => state.withdrawal?.form || {};
export const selectWithdrawalStatus = (state) => state.withdrawal?.status || 'idle';
export const selectWithdrawalError = (state) => state.withdrawal?.error || null;
export const selectPendingWithdrawal = (state) => state.withdrawal?.pendingWithdrawal || null;
export const selectWithdrawalHistory = (state) => state.withdrawal?.history || [];
export const selectWithdrawalPagination = (state) => state.withdrawal?.pagination || {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 5
};
export const selectWithdrawalLimits = (state) => {
  const activeMethod = state.withdrawal?.activeMethod;
  return activeMethod ? { min: activeMethod.minWithdrawal, max: activeMethod.maxWithdrawal } : { min: 0, max: Infinity };
};

export default withdrawalSlice.reducer;
