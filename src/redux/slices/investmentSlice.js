import { createSlice } from '@reduxjs/toolkit';
import mockApiService from '../../services/mockApiService';

// Initial state for investment functionality
const initialState = {
  plans: [
    {
      id: 'plan_starter',
      name: 'Starter Plan',
      description: 'Begin your investment journey with low risk and steady returns.',
      minAmount: 1000,
      maxAmount: 10000,
      roi: 5,
      duration: 30,
      features: [
        'Low risk profile',
        'Daily interest payments',
        'Principal returned at maturity',
        'Early withdrawal available (with fee)'
      ],
      riskLevel: 'Low',
      category: 'beginner',
      popularity: 'high',
      recommended: true,
      image: '/images/investment/starter-plan.svg'
    },
    {
      id: 'plan_growth',
      name: 'Growth Plan',
      description: 'Accelerate your capital growth with balanced risk and higher returns.',
      minAmount: 5000,
      maxAmount: 50000,
      roi: 8.5,
      duration: 60,
      features: [
        'Moderate risk profile',
        'Weekly interest payments',
        'Principal returned at maturity',
        'Trading signals access'
      ],
      riskLevel: 'Medium',
      category: 'intermediate',
      popularity: 'medium',
      recommended: false,
      image: '/images/investment/growth-plan.svg'
    },
    {
      id: 'plan_advanced',
      name: 'Advanced Plan',
      description: 'Maximize returns with cryptocurrency market opportunities.',
      minAmount: 10000,
      maxAmount: 100000,
      roi: 12,
      duration: 90,
      features: [
        'Higher risk profile',
        'Higher potential returns',
        'Bi-weekly interest payments',
        'Crypto market analysis reports',
        'Dedicated account manager'
      ],
      riskLevel: 'High',
      category: 'advanced',
      popularity: 'medium',
      recommended: false,
      image: '/images/investment/advanced-plan.svg'
    },
    {
      id: 'plan_premium',
      name: 'Premium Plan',
      description: 'For sophisticated investors seeking maximum returns.',
      minAmount: 25000,
      maxAmount: null,
      roi: 18,
      duration: 180,
      features: [
        'High risk profile',
        'Highest potential returns',
        'Monthly portfolio rebalancing',
        'Advanced trading algorithms',
        'Priority customer support',
        'Exclusive investment webinars'
      ],
      riskLevel: 'Very High',
      category: 'expert',
      popularity: 'low',
      recommended: false,
      image: '/images/investment/premium-plan.svg'
    }
  ],
  activeInvestments: [
    {
      id: 'inv_101',
      planId: 'plan_starter',
      planName: 'Starter Plan',
      amount: 2500,
      expectedReturn: 125,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      currentValue: 2562.50,
      status: 'active',
      progress: 50, // Percentage complete
      roi: 5,
      duration: 30
    },
    {
      id: 'inv_102',
      planId: 'plan_growth',
      planName: 'Growth Plan',
      amount: 8000,
      expectedReturn: 680, // 8.5% of 8000
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
      currentValue: 8226.67, // Principal + accrued interest
      status: 'active',
      progress: 33, // Percentage complete
      roi: 8.5,
      duration: 60
    }
  ],
  historyInvestments: [
    {
      id: 'inv_095',
      planId: 'plan_starter',
      planName: 'Starter Plan',
      amount: 1500,
      returnAmount: 75, // 5% of 1500
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: 'completed',
      roi: 5,
      duration: 30
    },
    {
      id: 'inv_098',
      planId: 'plan_advanced',
      planName: 'Advanced Plan',
      amount: 12000,
      returnAmount: 1440, // 12% of 12000
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      status: 'completed',
      roi: 12,
      duration: 90
    },
    {
      id: 'inv_099',
      planId: 'plan_growth',
      planName: 'Growth Plan',
      amount: 5000,
      returnAmount: 0, // Early withdrawal, no return
      startDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago
      endDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(), // Cancelled after 10 days
      status: 'cancelled',
      roi: 8.5,
      duration: 60
    }
  ],
  selectedPlan: null,
  investmentForm: {
    amount: '',
    duration: ''
  },
  status: 'idle',
  error: null,
  successModal: {
    show: false,
    investmentId: null,
    message: '',
    details: null
  },
  statistics: {
    totalInvested: 37000, // Sum of all investments
    activeInvestments: 2, // Count of active investments
    completedInvestments: 2, // Count of completed investments
    cancelledInvestments: 1, // Count of cancelled investments
    totalReturns: 3320, // Sum of all returns
    averageROI: 9.2 // Average ROI across all investments
  }
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    fetchPlansStart: (state) => {
      state.status = 'loading';
    },
    fetchPlansSuccess: (state, action) => {
      state.status = 'succeeded';
      state.plans = action.payload;
    },
    fetchPlansFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    fetchInvestmentsStart: (state) => {
      state.status = 'loading';
    },
    fetchInvestmentsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.activeInvestments = action.payload.filter(inv => inv.status === 'active');
      state.historyInvestments = action.payload.filter(inv => inv.status !== 'active');
      
      // Update statistics
      const totalInvested = action.payload.reduce((sum, inv) => sum + inv.amount, 0);
      const totalReturns = action.payload
        .filter(inv => inv.status === 'completed')
        .reduce((sum, inv) => sum + (inv.returnAmount || 0), 0);
      
      const activeCount = action.payload.filter(inv => inv.status === 'active').length;
      const completedCount = action.payload.filter(inv => inv.status === 'completed').length;
      const cancelledCount = action.payload.filter(inv => inv.status === 'cancelled').length;
      
      const completedInvestments = action.payload.filter(inv => inv.status === 'completed');
      const averageROI = completedInvestments.length > 0 
        ? completedInvestments.reduce((sum, inv) => sum + inv.roi, 0) / completedInvestments.length 
        : 0;
      
      state.statistics = {
        totalInvested,
        activeInvestments: activeCount,
        completedInvestments: completedCount,
        cancelledInvestments: cancelledCount,
        totalReturns,
        averageROI
      };
    },
    fetchInvestmentsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    
    updateInvestmentForm: (state, action) => {
      state.investmentForm = { ...state.investmentForm, ...action.payload };
    },
    
    makeInvestmentStart: (state) => {
      state.status = 'loading';
    },
    makeInvestmentSuccess: (state, action) => {
      state.status = 'succeeded';
      state.successModal = {
        show: true,
        investmentId: action.payload.id,
        message: 'Investment created successfully!',
        details: action.payload
      };
      
      // Add to active investments
      state.activeInvestments.push(action.payload);
      
      // Update statistics
      state.statistics.totalInvested += action.payload.amount;
      state.statistics.activeInvestments += 1;
      
      // Reset form
      state.investmentForm = initialState.investmentForm;
      state.selectedPlan = null;
    },
    makeInvestmentFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    cancelInvestmentStart: (state) => {
      state.status = 'loading';
    },
    cancelInvestmentSuccess: (state, action) => {
      state.status = 'succeeded';
      
      // Find the investment
      const investment = state.activeInvestments.find(inv => inv.id === action.payload.id);
      
      if (investment) {
        // Update statistics
        state.statistics.activeInvestments -= 1;
        state.statistics.cancelledInvestments += 1;
        
        // Remove from active and add to history
        state.activeInvestments = state.activeInvestments.filter(inv => inv.id !== action.payload.id);
        state.historyInvestments.unshift({
          ...investment,
          status: 'cancelled',
          endDate: new Date().toISOString(),
          returnAmount: 0 // No returns for cancelled investments
        });
      }
    },
    cancelInvestmentFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    withdrawInvestmentStart: (state) => {
      state.status = 'loading';
    },
    withdrawInvestmentSuccess: (state, action) => {
      state.status = 'succeeded';
      
      // Find the investment
      const investment = state.activeInvestments.find(inv => inv.id === action.payload.id);
      
      if (investment) {
        // Calculate returns based on time elapsed
        const startDate = new Date(investment.startDate);
        const now = new Date();
        const totalDays = investment.duration;
        const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const percentComplete = Math.min(elapsedDays / totalDays, 1);
        const proRatedReturn = investment.expectedReturn * percentComplete;
        
        // Update statistics
        state.statistics.activeInvestments -= 1;
        state.statistics.completedInvestments += 1;
        state.statistics.totalReturns += proRatedReturn;
        
        // Remove from active and add to history
        state.activeInvestments = state.activeInvestments.filter(inv => inv.id !== action.payload.id);
        state.historyInvestments.unshift({
          ...investment,
          status: 'completed',
          endDate: new Date().toISOString(),
          returnAmount: proRatedReturn
        });
      }
    },
    withdrawInvestmentFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    closeSuccessModal: (state) => {
      state.successModal.show = false;
    },
    
    resetInvestmentState: () => initialState
  }
});

export const {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  fetchInvestmentsStart,
  fetchInvestmentsSuccess,
  fetchInvestmentsFailure,
  setSelectedPlan,
  updateInvestmentForm,
  makeInvestmentStart,
  makeInvestmentSuccess,
  makeInvestmentFailure,
  cancelInvestmentStart,
  cancelInvestmentSuccess,
  cancelInvestmentFailure,
  withdrawInvestmentStart,
  withdrawInvestmentSuccess,
  withdrawInvestmentFailure,
  closeSuccessModal,
  resetInvestmentState
} = investmentSlice.actions;

// Thunk for fetching investment plans
export const fetchInvestmentPlans = () => async (dispatch) => {
  try {
    dispatch(fetchPlansStart());
    
    const plans = await mockApiService.investments.getPlans();
    
    dispatch(fetchPlansSuccess(plans));
    return plans;
  } catch (error) {
    dispatch(fetchPlansFailure(error.message || 'Failed to fetch investment plans'));
    throw error;
  }
};

// Thunk for fetching user investments
export const fetchUserInvestments = () => async (dispatch) => {
  try {
    dispatch(fetchInvestmentsStart());
    
    const investments = await mockApiService.investments.getInvestments();
    
    dispatch(fetchInvestmentsSuccess(investments));
    return investments;
  } catch (error) {
    dispatch(fetchInvestmentsFailure(error.message || 'Failed to fetch investments'));
    throw error;
  }
};

// Thunk for making an investment
export const makeInvestment = (investmentData) => async (dispatch) => {
  try {
    dispatch(makeInvestmentStart());
    
    const response = await mockApiService.investments.createInvestment({
      planId: investmentData.planId,
      amount: parseFloat(investmentData.amount)
    });
    
    dispatch(makeInvestmentSuccess(response.investment));
    return { success: true, data: response.investment };
  } catch (error) {
    dispatch(makeInvestmentFailure(error.message || 'Failed to create investment'));
    throw error;
  }
};

// Thunk for cancelling an investment
export const cancelInvestment = (investmentId) => async (dispatch) => {
  try {
    dispatch(cancelInvestmentStart());
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch(cancelInvestmentSuccess({ id: investmentId }));
    return { success: true };
  } catch (error) {
    dispatch(cancelInvestmentFailure(error.message || 'Failed to cancel investment'));
    throw error;
  }
};

// Thunk for withdrawing from an investment
export const withdrawInvestment = (investmentId) => async (dispatch) => {
  try {
    dispatch(withdrawInvestmentStart());
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(withdrawInvestmentSuccess({ id: investmentId }));
    return { success: true };
  } catch (error) {
    dispatch(withdrawInvestmentFailure(error.message || 'Failed to withdraw from investment'));
    throw error;
  }
};

// Selectors
export const selectInvestmentPlans = (state) => state.investment?.plans || [];
export const selectActiveInvestments = (state) => state.investment?.activeInvestments || [];
export const selectHistoryInvestments = (state) => state.investment?.historyInvestments || [];
export const selectSelectedPlan = (state) => state.investment?.selectedPlan;
export const selectInvestmentForm = (state) => state.investment?.investmentForm || {};
export const selectInvestmentStatus = (state) => state.investment?.status || 'idle';
export const selectInvestmentError = (state) => state.investment?.error;
export const selectSuccessModal = (state) => state.investment?.successModal || { show: false };
export const selectInvestmentStatistics = (state) => state.investment?.statistics || {
  totalInvested: 0,
  activeInvestments: 0,
  completedInvestments: 0,
  cancelledInvestments: 0,
  totalReturns: 0,
  averageROI: 0
};

export default investmentSlice.reducer;
