import { createSlice } from '@reduxjs/toolkit';

// Mock referral data
const mockReferrals = [
  {
    id: 'ref-1001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    status: 'registered',
    date: '2023-10-15',
    commission: 0
  },
  {
    id: 'ref-1002',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    status: 'active',
    date: '2023-10-20',
    commission: 25.50
  },
  {
    id: 'ref-1003',
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    status: 'active',
    date: '2023-11-05',
    commission: 42.75
  },
  {
    id: 'ref-1004',
    email: 'sarah.williams@example.com',
    name: 'Sarah Williams',
    status: 'pending',
    date: '2023-11-25',
    commission: 0
  }
];

// Mock commission history
const mockCommissionHistory = [
  {
    id: 'comm-1001',
    referralId: 'ref-1002',
    referralName: 'Jane Smith',
    amount: 10.25,
    type: 'deposit',
    status: 'paid',
    date: '2023-11-01'
  },
  {
    id: 'comm-1002',
    referralId: 'ref-1002',
    referralName: 'Jane Smith',
    amount: 15.25,
    type: 'trading',
    status: 'paid',
    date: '2023-11-15'
  },
  {
    id: 'comm-1003',
    referralId: 'ref-1003',
    referralName: 'Mike Johnson',
    amount: 42.75,
    type: 'deposit',
    status: 'paid',
    date: '2023-11-10'
  },
];

const initialState = {
  referrals: mockReferrals,
  commissionHistory: mockCommissionHistory,
  referralLink: 'https://fidelityfirstbrokers.com/ref/user123',
  referralCode: 'USER123',
  statistics: {
    totalReferrals: mockReferrals.length,
    activeReferrals: mockReferrals.filter(r => r.status === 'active').length,
    totalCommission: mockReferrals.reduce((sum, r) => sum + r.commission, 0),
    pendingCommission: 0,
    conversionRate: 75 // percentage
  },
  status: 'idle',
  error: null
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    fetchReferralsStart(state) {
      state.status = 'loading';
    },
    fetchReferralsSuccess(state, action) {
      state.status = 'succeeded';
      state.referrals = action.payload;
      // Update statistics
      state.statistics = {
        totalReferrals: action.payload.length,
        activeReferrals: action.payload.filter(r => r.status === 'active').length,
        totalCommission: action.payload.reduce((sum, r) => sum + r.commission, 0),
        pendingCommission: 0,
        conversionRate: 75 // This would be calculated from real data
      };
    },
    fetchReferralsFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    fetchCommissionHistoryStart(state) {
      state.status = 'loading';
    },
    fetchCommissionHistorySuccess(state, action) {
      state.status = 'succeeded';
      state.commissionHistory = action.payload;
    },
    fetchCommissionHistoryFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    addReferral(state, action) {
      state.referrals.unshift(action.payload);
      state.statistics.totalReferrals++;
      if (action.payload.status === 'active') {
        state.statistics.activeReferrals++;
      }
    },
    
    updateReferralStatus(state, action) {
      const { id, status } = action.payload;
      const referral = state.referrals.find(r => r.id === id);
      if (referral) {
        // If changing to active from another status
        if (status === 'active' && referral.status !== 'active') {
          state.statistics.activeReferrals++;
        }
        // If changing from active to another status
        else if (referral.status === 'active' && status !== 'active') {
          state.statistics.activeReferrals--;
        }
        referral.status = status;
      }
    },
    
    addCommission(state, action) {
      state.commissionHistory.unshift(action.payload);
      const referral = state.referrals.find(r => r.id === action.payload.referralId);
      if (referral) {
        referral.commission += action.payload.amount;
      }
      state.statistics.totalCommission += action.payload.amount;
    },
    
    generateNewReferralLink(state) {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      state.referralCode = randomCode;
      state.referralLink = `https://fidelityfirstbrokers.com/ref/${randomCode.toLowerCase()}`;
    },
    
    resetReferralState: () => initialState
  }
});

export const {
  fetchReferralsStart,
  fetchReferralsSuccess,
  fetchReferralsFailure,
  fetchCommissionHistoryStart,
  fetchCommissionHistorySuccess,
  fetchCommissionHistoryFailure,
  addReferral,
  updateReferralStatus,
  addCommission,
  generateNewReferralLink,
  resetReferralState
} = referralSlice.actions;

// Thunk for fetching referrals
export const fetchReferrals = () => async (dispatch) => {
  try {
    dispatch(fetchReferralsStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchReferralsSuccess(mockReferrals));
  } catch (error) {
    dispatch(fetchReferralsFailure(error.message || 'Failed to fetch referrals'));
  }
};

// Thunk for fetching commission history
export const fetchCommissionHistory = () => async (dispatch) => {
  try {
    dispatch(fetchCommissionHistoryStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchCommissionHistorySuccess(mockCommissionHistory));
  } catch (error) {
    dispatch(fetchCommissionHistoryFailure(error.message || 'Failed to fetch commission history'));
  }
};

// Selectors
export const selectReferrals = state => state.referral?.referrals || [];
export const selectCommissionHistory = state => state.referral?.commissionHistory || [];
export const selectReferralLink = state => state.referral?.referralLink || '';
export const selectReferralCode = state => state.referral?.referralCode || '';
export const selectReferralStatistics = state => state.referral?.statistics || initialState.statistics;
export const selectReferralStatus = state => state.referral?.status || 'idle';
export const selectReferralError = state => state.referral?.error;

export default referralSlice.reducer;
