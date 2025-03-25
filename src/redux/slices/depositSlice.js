import { createSlice } from '@reduxjs/toolkit';

// Sample mock data
const mockDeposits = [
  {
    id: "DEP100456",
    date: "2023-11-28",
    method: "Bitcoin",
    address: "bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym",
    amount: "3,500.00",
    confirmations: "6/6",
    status: "Completed"
  },
  {
    id: "DEP100455",
    date: "2023-11-25",
    method: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    amount: "2,000.00",
    confirmations: "12/12",
    status: "Completed"
  },
  {
    id: "DEP100454",
    date: "2023-11-20",
    method: "Bitcoin",
    address: "bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym",
    amount: "1,000.00",
    confirmations: "3/6",
    status: "Pending"
  },
  {
    id: "DEP100453",
    date: "2023-11-15",
    method: "Bank Transfer",
    address: "XXXX1234",
    amount: "5,000.00",
    confirmations: "N/A",
    status: "Processing"
  },
  {
    id: "DEP100452",
    date: "2023-11-10",
    method: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    amount: "750.00",
    confirmations: "0/12",
    status: "Failed"
  }
];

// Payment methods for deposits
const depositMethods = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    minDeposit: 100,
    processingTime: '10-30 minutes',
    address: 'bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym',
    qrCode: true,
    confirmations: 6
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    minDeposit: 100,
    processingTime: '5-10 minutes',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    qrCode: true,
    confirmations: 12
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    minDeposit: 500,
    processingTime: '1-3 business days',
    accountName: 'Fidelity First Brokers Ltd',
    accountNumber: '1234567890',
    bankName: 'Chase Bank',
    swiftCode: 'CHASUS33',
    routingNumber: '021000021',
    reference: 'DEP-REF-',
    qrCode: false
  }
];

const initialState = {
  depositHistory: mockDeposits,
  depositMethods: depositMethods,
  pendingDeposit: null,
  activeMethod: null,
  depositForm: {
    method: '',
    amount: '',
    reference: '',
    transactionId: ''
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    // Set the active deposit method
    setActiveMethod(state, action) {
      state.activeMethod = state.depositMethods.find(m => m.id === action.payload) || null;
    },
    
    // Update the deposit form fields
    updateDepositForm(state, action) {
      state.depositForm = { ...state.depositForm, ...action.payload };
    },
    
    // Start submitting a deposit
    submitDepositStart(state) {
      state.status = 'loading';
    },
    
    // Deposit submission successful
    submitDepositSuccess(state, action) {
      state.status = 'succeeded';
      state.depositHistory.unshift(action.payload);
      state.pendingDeposit = action.payload;
      state.depositForm = initialState.depositForm;
    },
    
    // Deposit submission failed
    submitDepositFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    // Clear the current pending deposit
    clearPendingDeposit(state) {
      state.pendingDeposit = null;
    },
    
    // Reset state
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
  resetDepositState
} = depositSlice.actions;

// Thunk for submitting a deposit
export const submitDeposit = (depositData) => async (dispatch) => {
  try {
    dispatch(submitDepositStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock deposit entry
    const newDeposit = {
      id: `DEP${100000 + Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      method: depositData.method.name,
      address: depositData.method.address || depositData.method.accountNumber,
      amount: parseFloat(depositData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      confirmations: depositData.method.id === 'bank' ? 'N/A' : `0/${depositData.method.confirmations}`,
      status: "Processing",
      transactionId: depositData.transactionId || 'N/A'
    };
    
    dispatch(submitDepositSuccess(newDeposit));
    return { success: true, data: newDeposit };
  } catch (error) {
    dispatch(submitDepositFailure(error.message || 'Failed to process deposit'));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectDepositHistory = (state) => state.deposit?.depositHistory || [];
export const selectDepositMethods = (state) => state.deposit?.depositMethods || [];
export const selectActiveMethod = (state) => state.deposit?.activeMethod;
export const selectDepositForm = (state) => state.deposit?.depositForm || initialState.depositForm;
export const selectPendingDeposit = (state) => state.deposit?.pendingDeposit;
export const selectDepositStatus = (state) => state.deposit?.status || 'idle';
export const selectDepositError = (state) => state.deposit?.error;

export default depositSlice.reducer;
