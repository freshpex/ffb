import { createSlice } from '@reduxjs/toolkit';

// Mock data for the dashboard
const initialState = {
  accountBalance: 0.00,
  totalEarnings: 0.00,
  registeredDate: new Date().toISOString(),
  
  marketData: {
    bitcoin: { price: 64352.12, change: 2.45 },
    ethereum: { price: 3450.78, change: -1.23 },
    litecoin: { price: 78.34, change: 0.95 }
  },
  
  transactions: [
    {
      id: "TRX123456",
      date: "2023-11-28",
      type: "Deposit",
      amount: "500.00",
      status: "Completed",
    },
    {
      id: "TRX123457",
      date: "2023-11-27",
      type: "Withdrawal",
      amount: "200.00",
      status: "Pending",
    },
    {
      id: "TRX123458",
      date: "2023-11-26",
      type: "Deposit",
      amount: "1000.00",
      status: "Completed",
    }
  ],
  
  portfolio: {
    totalInvestment: 0,
    currentValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
    allocation: [
      { name: 'Bitcoin', percentage: 40, color: '#f7931a' },
      { name: 'Ethereum', percentage: 25, color: '#627eea' },
      { name: 'Traditional Markets', percentage: 20, color: '#2196f3' },
      { name: 'Other Crypto', percentage: 15, color: '#9c27b0' }
    ]
  },
  
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart(state) {
      state.status = 'loading';
    },
    fetchDashboardSuccess(state, action) {
      state.status = 'succeeded';
      return { ...state, ...action.payload, error: null };
    },
    fetchDashboardFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateMarketPrices(state, action) {
      state.marketData = { ...state.marketData, ...action.payload };
    },
    addTransaction(state, action) {
      state.transactions.unshift(action.payload);
    },
    resetDashboardState: () => initialState
  }
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  updateMarketPrices,
  addTransaction,
  resetDashboardState
} = dashboardSlice.actions;

// Mock thunk functions
export const fetchDashboardData = () => async (dispatch) => {
  try {
    dispatch(fetchDashboardStart());
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would fetch actual data here
    // For now, we'll just return our initial state as mock data
    dispatch(fetchDashboardSuccess(initialState));
  } catch (error) {
    dispatch(fetchDashboardFailure(error.message));
  }
};

// Selectors
export const selectDashboardStatus = (state) => state.dashboard?.status || 'idle';
export const selectTransactions = (state) => state.dashboard?.transactions || [];
export const selectPortfolio = (state) => state.dashboard?.portfolio || initialState.portfolio;
export const selectMarketData = (state) => state.dashboard?.marketData || {};
export const selectAccountStats = (state) => {
  if (!state.dashboard) return { balance: 0, earnings: 0, registered: new Date().toISOString() };
  return {
    balance: state.dashboard.accountBalance || 0,
    earnings: state.dashboard.totalEarnings || 0,
    registered: state.dashboard.registeredDate || new Date().toISOString(),
  };
};

export default dashboardSlice.reducer;
