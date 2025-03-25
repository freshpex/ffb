import { createSlice } from '@reduxjs/toolkit';

// Sample data
const mockWithdrawals = [
  {
    id: "WTX100456",
    date: "2023-11-28",
    method: "Bitcoin",
    address: "bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym",
    amount: "2,500.00",
    fee: "25.00",
    total: "2,475.00",
    status: "Completed"
  },
  {
    id: "WTX100455",
    date: "2023-11-25",
    method: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    amount: "1,000.00",
    fee: "10.00",
    total: "990.00",
    status: "Pending"
  },
  {
    id: "WTX100454",
    date: "2023-11-20",
    method: "Bitcoin",
    address: "bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym",
    amount: "500.00",
    fee: "5.00",
    total: "495.00",
    status: "Completed"
  },
  {
    id: "WTX100453",
    date: "2023-11-15",
    method: "Bank Transfer",
    address: "XXXX1234",
    amount: "3,000.00",
    fee: "30.00",
    total: "2,970.00",
    status: "Failed"
  },
  {
    id: "WTX100452",
    date: "2023-11-10",
    method: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    amount: "750.00",
    fee: "7.50",
    total: "742.50",
    status: "Cancelled"
  }
];

const initialState = {
  withdrawalHistory: mockWithdrawals,
  withdrawalLimits: {
    daily: 5000,
    monthly: 50000,
    minimum: 100,
    remainingDaily: 2500,
    remainingMonthly: 45000
  },
  paymentMethods: [],
  pendingWithdrawal: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const withdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    // Start a withdrawal request
    withdrawalStart(state) {
      state.status = 'loading';
    },
    // Withdrawal successful
    withdrawalSuccess(state, action) {
      state.status = 'succeeded';
      state.withdrawalHistory.unshift(action.payload);
      state.pendingWithdrawal = action.payload;
      
      // Update remaining limits
      const withdrawalAmount = parseFloat(action.payload.amount.replace(/,/g, ''));
      state.withdrawalLimits.remainingDaily -= withdrawalAmount;
      state.withdrawalLimits.remainingMonthly -= withdrawalAmount;
    },
    // Withdrawal failed
    withdrawalFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    // Clear current withdrawal
    clearPendingWithdrawal(state) {
      state.pendingWithdrawal = null;
    },
    // Set available payment methods
    setPaymentMethods(state, action) {
      state.paymentMethods = action.payload;
    },
    // Reset state
    resetWithdrawalState: () => initialState
  }
});

export const {
  withdrawalStart,
  withdrawalSuccess,
  withdrawalFailure,
  clearPendingWithdrawal,
  setPaymentMethods,
  resetWithdrawalState
} = withdrawalSlice.actions;

// Thunk for submitting a withdrawal
export const submitWithdrawal = (withdrawalData) => async (dispatch) => {
  try {
    dispatch(withdrawalStart());
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Process withdrawal data
    const withdrawalAmount = parseFloat(withdrawalData.amount);
    const fee = withdrawalAmount * 0.01; // 1% fee
    
    const newWithdrawal = {
      id: `WTX${100000 + Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      method: withdrawalData.method,
      address: withdrawalData.address,
      amount: withdrawalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      fee: fee.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      total: (withdrawalAmount - fee).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      status: "Pending"
    };
    
    dispatch(withdrawalSuccess(newWithdrawal));
    return { success: true, data: newWithdrawal };
  } catch (error) {
    dispatch(withdrawalFailure(error.message || 'Failed to process withdrawal'));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectWithdrawalHistory = (state) => state.withdrawal?.withdrawalHistory || [];
export const selectWithdrawalLimits = (state) => state.withdrawal?.withdrawalLimits || initialState.withdrawalLimits;
export const selectPendingWithdrawal = (state) => state.withdrawal?.pendingWithdrawal;
export const selectWithdrawalStatus = (state) => state.withdrawal?.status || 'idle';
export const selectWithdrawalError = (state) => state.withdrawal?.error;

export default withdrawalSlice.reducer;
