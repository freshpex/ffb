import { createSlice } from '@reduxjs/toolkit';
import mockApiService from '../../services/mockApiService';

// Initial state for deposit functionality
const initialState = {
  depositMethods: [
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Transfer funds directly from your bank account',
      logo: '/images/bank-transfer.svg',
      processingTime: '1-3 business days',
      minDeposit: 100,
      maxDeposit: 100000,
      fees: '0%',
      bankDetails: {
        accountName: 'Fidelity First Brokers Ltd',
        accountNumber: '1234567890',
        routingNumber: '021000021',
        bankName: 'Chase Bank',
        swiftCode: 'CHASUS33'
      }
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Deposit using Bitcoin cryptocurrency',
      logo: '/images/bitcoin.svg',
      processingTime: '1-2 hours after 3 confirmations',
      minDeposit: 50,
      maxDeposit: null,
      fees: '0%',
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      qrCode: true
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      description: 'Deposit using Ethereum cryptocurrency',
      logo: '/images/ethereum.svg',
      processingTime: '30-60 minutes after 12 confirmations',
      minDeposit: 50,
      maxDeposit: null,
      fees: '0%',
      address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      qrCode: true
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Instant deposit using your credit or debit card',
      logo: '/images/credit-card.svg',
      processingTime: 'Instant',
      minDeposit: 20,
      maxDeposit: 5000,
      fees: '3.5%'
    }
  ],
  activeMethod: null,
  form: {
    amount: '',
    transactionId: '',
    reference: ''
  },
  status: 'idle',
  error: null,
  pendingDeposit: null,
  history: [
    {
      id: 'dep_123456',
      type: 'deposit',
      amount: 1000.00,
      currency: 'USD',
      method: 'bank',
      methodName: 'Bank Transfer',
      reference: 'REF123456',
      status: 'completed',
      fees: 0.00,
      netAmount: 1000.00,
      createdAt: '2023-11-20T14:30:00Z',
      updatedAt: '2023-11-21T10:15:00Z',
      confirmations: 1
    },
    {
      id: 'dep_123457',
      type: 'deposit',
      amount: 500.00,
      currency: 'USD',
      method: 'bitcoin',
      methodName: 'Bitcoin',
      transactionId: 'btc_tx_a1b2c3d4',
      status: 'completed',
      fees: 0.00,
      netAmount: 500.00,
      createdAt: '2023-11-22T09:45:00Z',
      updatedAt: '2023-11-22T11:30:00Z',
      confirmations: 6
    },
    {
      id: 'dep_123458',
      type: 'deposit',
      amount: 2500.00,
      currency: 'USD',
      method: 'credit_card',
      methodName: 'Credit/Debit Card',
      status: 'completed',
      fees: 87.50,
      netAmount: 2412.50,
      createdAt: '2023-11-24T16:30:00Z',
      updatedAt: '2023-11-24T16:32:00Z',
      confirmations: 1
    },
    {
      id: 'dep_123459',
      type: 'deposit',
      amount: 750.00,
      currency: 'USD',
      method: 'ethereum',
      methodName: 'Ethereum',
      transactionId: 'eth_tx_e5f6g7h8',
      status: 'pending',
      fees: 0.00,
      netAmount: 750.00,
      createdAt: '2023-11-27T11:20:00Z',
      updatedAt: '2023-11-27T11:20:00Z',
      confirmations: 5
    },
    {
      id: 'dep_123460',
      type: 'deposit',
      amount: 3000.00,
      currency: 'USD',
      method: 'bank',
      methodName: 'Bank Transfer',
      reference: 'REF789012',
      status: 'pending',
      fees: 0.00,
      netAmount: 3000.00,
      createdAt: '2023-11-28T14:30:00Z',
      updatedAt: '2023-11-28T14:30:00Z',
      confirmations: 0
    }
  ],
  pagination: {
    totalItems: 15,
    totalPages: 3,
    currentPage: 1,
    itemsPerPage: 5
  }
};

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setActiveMethod: (state, action) => {
      state.activeMethod = state.depositMethods.find(method => method.id === action.payload) || null;
    },
    updateDepositForm: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
    submitDepositStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    submitDepositSuccess: (state, action) => {
      state.status = 'succeeded';
      state.pendingDeposit = action.payload;
      // Add to history
      state.history.unshift({
        id: action.payload.id,
        type: 'deposit',
        amount: action.payload.amount,
        currency: 'USD',
        method: state.activeMethod?.id || 'unknown',
        methodName: state.activeMethod?.name || 'Unknown Method',
        transactionId: state.form.transactionId || null,
        reference: state.form.reference || null,
        status: 'pending',
        fees: state.activeMethod ? (action.payload.amount * (parseFloat(state.activeMethod.fees || '0') / 100)) : 0,
        netAmount: action.payload.amount - (state.activeMethod ? (action.payload.amount * (parseFloat(state.activeMethod.fees || '0') / 100)) : 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmations: 0
      });
      // Clear form after successful submission
      state.form = initialState.form;
    },
    submitDepositFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearPendingDeposit: (state) => {
      state.pendingDeposit = null;
    },
    fetchDepositHistoryStart: (state) => {
      state.status = 'loading';
    },
    fetchDepositHistorySuccess: (state, action) => {
      state.status = 'succeeded';
      state.history = action.payload.transactions;
      state.pagination = {
        totalItems: action.payload.totalCount,
        totalPages: Math.ceil(action.payload.totalCount / action.payload.limit),
        currentPage: action.payload.page,
        itemsPerPage: action.payload.limit
      };
    },
    fetchDepositHistoryFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetDepositState: () => initialState
  }
});

export const {
  setActiveMethod,
  updateDepositForm,
  submitDepositStart,
  submitDepositSuccess,
  submitDepositFailure,
  clearPendingDeposit,
  fetchDepositHistoryStart,
  fetchDepositHistorySuccess,
  fetchDepositHistoryFailure,
  setCurrentPage,
  resetDepositState
} = depositSlice.actions;

// Thunk for submitting deposit
export const submitDeposit = (depositData) => async (dispatch) => {
  try {
    dispatch(submitDepositStart());
    
    // Call the mock API service
    const response = await mockApiService.transactions.createDeposit({
      amount: parseFloat(depositData.amount),
      method: depositData.method.id,
      transactionId: depositData.transactionId,
      reference: depositData.reference
    });
    
    dispatch(submitDepositSuccess({
      id: response.transaction.id,
      amount: parseFloat(depositData.amount),
      method: depositData.method.name,
      status: 'pending',
      date: new Date().toISOString()
    }));
    
    return { success: true };
  } catch (error) {
    dispatch(submitDepositFailure(error.message || 'Failed to process deposit'));
    throw error;
  }
};

// Thunk for fetching deposit history
export const fetchDepositHistory = (page = 1, limit = 5) => async (dispatch) => {
  try {
    dispatch(fetchDepositHistoryStart());
    
    // Call the mock API service
    const response = await mockApiService.transactions.getDeposits({ page, limit });
    
    dispatch(fetchDepositHistorySuccess(response));
    return response;
  } catch (error) {
    dispatch(fetchDepositHistoryFailure(error.message || 'Failed to fetch deposit history'));
    throw error;
  }
};

// Selectors
export const selectDepositMethods = (state) => state.deposit?.depositMethods || [];
export const selectActiveMethod = (state) => state.deposit?.activeMethod || null;
export const selectDepositForm = (state) => state.deposit?.form || {};
export const selectDepositStatus = (state) => state.deposit?.status || 'idle';
export const selectDepositError = (state) => state.deposit?.error || null;
export const selectPendingDeposit = (state) => state.deposit?.pendingDeposit || null;
export const selectDepositHistory = (state) => state.deposit?.history || [];
export const selectDepositPagination = (state) => state.deposit?.pagination || {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 5
};
export const selectDepositLimits = (state) => {
  const activeMethod = state.deposit?.activeMethod;
  return activeMethod ? { min: activeMethod.minDeposit, max: activeMethod.maxDeposit } : { min: 0, max: Infinity };
};

export default depositSlice.reducer;
