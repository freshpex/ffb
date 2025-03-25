import { createSlice } from '@reduxjs/toolkit';

// Mock initial state
const initialState = {
  profile: {
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
  },
  paymentMethods: [
    {
      id: '1',
      type: 'bitcoin',
      address: 'bc1q84nf5ewqzn5u7677drf7dlwp4h24htl0lkr4ym',
      isDefault: true
    }
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Profile updates
    updateProfileStart(state) {
      state.status = 'loading';
    },
    updateProfileSuccess(state, action) {
      state.profile = { ...state.profile, ...action.payload };
      state.status = 'succeeded';
      state.error = null;
    },
    updateProfileFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    // Payment methods
    addPaymentMethod(state, action) {
      state.paymentMethods.push(action.payload);
    },
    updatePaymentMethod(state, action) {
      const index = state.paymentMethods.findIndex(method => method.id === action.payload.id);
      if (index !== -1) {
        state.paymentMethods[index] = action.payload;
      }
    },
    removePaymentMethod(state, action) {
      state.paymentMethods = state.paymentMethods.filter(method => method.id !== action.payload);
    },
    setDefaultPaymentMethod(state, action) {
      state.paymentMethods = state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === action.payload
      }));
    },
    
    // Reset state
    resetUserState: () => initialState
  }
});

export const {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  addPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  resetUserState
} = userSlice.actions;

// Mock thunk functions
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(updateProfileStart());
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(updateProfileSuccess(profileData));
  } catch (error) {
    dispatch(updateProfileFailure(error.message));
  }
};

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPaymentMethods = (state) => state.user.paymentMethods;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
