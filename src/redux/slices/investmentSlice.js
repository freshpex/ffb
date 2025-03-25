import { createSlice } from '@reduxjs/toolkit';

// Mock data for investment plans
const mockPlans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    description: 'Perfect for beginners looking to enter the cryptocurrency market with minimal risk.',
    minAmount: 500,
    maxAmount: 4999,
    roi: 5, // percentage
    duration: 30, // days
    features: [
      'Daily ROI: 0.17%',
      'Capital returned after term',
      'Basic market analysis',
      'Email support'
    ],
    risk: 'Low',
    recommended: false,
    tag: null,
    color: 'blue'
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    description: 'Balanced investment option with moderate risk and higher potential returns.',
    minAmount: 5000,
    maxAmount: 19999,
    roi: 8, // percentage
    duration: 60, // days
    features: [
      'Daily ROI: 0.27%',
      'Capital returned after term',
      'Weekly market insights',
      'Priority email support',
      'Diversified portfolio exposure'
    ],
    risk: 'Medium',
    recommended: true,
    tag: 'Popular',
    color: 'purple'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Higher risk with better returns for experienced investors looking to maximize profits.',
    minAmount: 20000,
    maxAmount: 49999,
    roi: 12, // percentage
    duration: 90, // days
    features: [
      'Daily ROI: 0.4%',
      'Capital returned after term',
      'Personalized portfolio strategy',
      'Priority 24/7 support',
      'Access to exclusive investment opportunities',
      'Monthly strategy call'
    ],
    risk: 'Medium-High',
    recommended: false,
    tag: null,
    color: 'amber'
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    description: 'Our premium investment package for serious investors seeking substantial returns.',
    minAmount: 50000,
    maxAmount: 250000,
    roi: 18, // percentage
    duration: 180, // days
    features: [
      'Daily ROI: 0.6%',
      'Capital returned after term',
      'Custom trading strategy',
      'Dedicated account manager',
      'VIP market analysis and early access',
      'Quarterly portfolio review',
      'Tax optimization consultation'
    ],
    risk: 'High',
    recommended: false,
    tag: 'Best Value',
    color: 'green'
  }
];

// Mock data for user investments
const mockUserInvestments = [
  {
    id: 'inv-10045',
    planId: 'starter',
    planName: 'Starter Plan',
    date: '2023-11-15',
    amount: 1000,
    roi: 5,
    duration: 30,
    earned: 16.5,
    status: 'Active',
    endDate: '2023-12-15',
    progress: 55
  },
  {
    id: 'inv-10032',
    planId: 'growth',
    planName: 'Growth Plan',
    date: '2023-10-25',
    amount: 7500,
    roi: 8,
    duration: 60,
    earned: 375.0,
    status: 'Active',
    endDate: '2023-12-24',
    progress: 70
  },
  {
    id: 'inv-9987',
    planId: 'premium',
    planName: 'Premium Plan',
    date: '2023-09-05',
    amount: 25000,
    roi: 12,
    duration: 90,
    earned: 2500,
    status: 'Completed',
    endDate: '2023-12-04',
    progress: 100
  }
];

const initialState = {
  plans: mockPlans,
  userInvestments: mockUserInvestments,
  selectedPlan: null,
  investmentModal: {
    open: false,
    planId: null
  },
  successModal: {
    open: false,
    investmentId: null
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    fetchPlansStart(state) {
      state.status = 'loading';
    },
    fetchPlansSuccess(state, action) {
      state.status = 'succeeded';
      state.plans = action.payload;
    },
    fetchPlansFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    setSelectedPlan(state, action) {
      state.selectedPlan = action.payload;
    },
    openInvestmentModal(state, action) {
      state.investmentModal = {
        open: true,
        planId: action.payload
      };
    },
    closeInvestmentModal(state) {
      state.investmentModal = {
        open: false,
        planId: null
      };
    },
    openSuccessModal(state, action) {
      state.successModal = {
        open: true,
        investmentId: action.payload
      };
    },
    closeSuccessModal(state) {
      state.successModal = {
        open: false,
        investmentId: null
      };
    },
    makeInvestmentStart(state) {
      state.status = 'loading';
    },
    makeInvestmentSuccess(state, action) {
      state.status = 'succeeded';
      state.userInvestments.unshift(action.payload);
      state.investmentModal.open = false;
      state.successModal = {
        open: true,
        investmentId: action.payload.id
      };
    },
    makeInvestmentFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetInvestmentState: () => initialState
  }
});

export const {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  setSelectedPlan,
  openInvestmentModal,
  closeInvestmentModal,
  openSuccessModal,
  closeSuccessModal,
  makeInvestmentStart,
  makeInvestmentSuccess,
  makeInvestmentFailure,
  resetInvestmentState
} = investmentSlice.actions;

// Thunk for fetching investment plans
export const fetchInvestmentPlans = () => async (dispatch) => {
  try {
    dispatch(fetchPlansStart());
    
    // In a real app, this would be an API call
    // For now, just simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchPlansSuccess(mockPlans));
  } catch (error) {
    dispatch(fetchPlansFailure(error.message || 'Failed to fetch investment plans'));
  }
};

// Thunk for making an investment
export const makeInvestment = (planId, amount) => async (dispatch, getState) => {
  try {
    dispatch(makeInvestmentStart());
    
    // In a real app, this would be an API call
    // For now, just simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const state = getState();
    const plan = state.investment.plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Investment plan not found');
    }
    
    // Generate a new investment
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + plan.duration);
    
    const newInvestment = {
      id: `inv-${100000 + Math.floor(Math.random() * 10000)}`,
      planId: plan.id,
      planName: plan.name,
      date: today.toISOString().split('T')[0],
      amount: parseFloat(amount),
      roi: plan.roi,
      duration: plan.duration,
      earned: 0.00,
      status: 'Active',
      endDate: endDate.toISOString().split('T')[0],
      progress: 0
    };
    
    dispatch(makeInvestmentSuccess(newInvestment));
    return { success: true, data: newInvestment };
  } catch (error) {
    dispatch(makeInvestmentFailure(error.message || 'Failed to process investment'));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectInvestmentPlans = state => state.investment?.plans || [];
export const selectUserInvestments = state => state.investment?.userInvestments || [];
export const selectSelectedPlan = state => state.investment?.selectedPlan;
export const selectInvestmentModal = state => state.investment?.investmentModal || { open: false, planId: null };
export const selectSuccessModal = state => state.investment?.successModal || { open: false, investmentId: null };
export const selectInvestmentStatus = state => state.investment?.status || 'idle';
export const selectInvestmentError = state => state.investment?.error;

export default investmentSlice.reducer;
