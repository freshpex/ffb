import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  twoFactorEnabled: false,
  email: 'user@example.com',
  lastPasswordChange: '2023-11-15',
  activeDevices: [
    {
      id: '1',
      device: 'Chrome on Windows',
      lastActive: '2023-11-28T14:30:00Z',
      location: 'New York, USA'
    }
  ],
  status: 'idle',
  error: null
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    updatePasswordStart(state) {
      state.status = 'loading';
    },
    updatePasswordSuccess(state) {
      state.status = 'succeeded';
      state.lastPasswordChange = new Date().toISOString().split('T')[0];
      state.error = null;
    },
    updatePasswordFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    toggleTwoFactor(state, action) {
      state.twoFactorEnabled = action.payload;
    },
    resetSecurityState: () => initialState
  }
});

export const {
  updatePasswordStart,
  updatePasswordSuccess,
  updatePasswordFailure,
  toggleTwoFactor,
  resetSecurityState
} = securitySlice.actions;

// Mock thunk functions
export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(updatePasswordStart());
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(updatePasswordSuccess());
    return { success: true };
  } catch (error) {
    dispatch(updatePasswordFailure(error.message));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectSecurityStatus = (state) => state.security.status;
export const selectSecurityError = (state) => state.security.error;
export const selectTwoFactorEnabled = (state) => state.security.twoFactorEnabled;

export default securitySlice.reducer;
