import { createSlice, createSelector } from '@reduxjs/toolkit';
import mockApiService from '../../services/mockApiService';

const initialState = {
  id: 'user_123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
  address: '123 Main St, New York, NY 10001',
  country: 'United States',
  profileImage: null,
  balance: 25000.00,
  kycVerified: true,
  referralCode: 'JOHN123',
  createdAt: '2023-10-01T00:00:00Z',
  status: 'idle',
  error: null,
  loading: false,
  paymentMethods: [
    {
      id: 'pm_1',
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'bank_account',
      name: 'Chase Bank Account',
      last4: '6789',
      bankName: 'Chase',
      isDefault: false
    }
  ]
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    
    updateProfileStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      return { ...state, ...action.payload };
    },
    updateProfileFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload
      };
      state.status = 'succeeded';
    },

    updateEmailStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    updateEmailSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.email = action.payload.email;
    },
    updateEmailFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    updatePhoneStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    updatePhoneSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.phoneNumber = action.payload.phoneNumber;
    },
    updatePhoneFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    uploadProfileImageStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    uploadProfileImageSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.profileImage = action.payload.imageUrl;
    },
    uploadProfileImageFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    addPaymentMethodStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    addPaymentMethodSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      if (action.payload.isDefault) {
        state.paymentMethods = state.paymentMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }
      state.paymentMethods.push(action.payload);
    },
    addPaymentMethodFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    removePaymentMethodStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    removePaymentMethodSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.paymentMethods = state.paymentMethods.filter(method => method.id !== action.payload);
      if (state.paymentMethods.length > 0 && !state.paymentMethods.some(method => method.isDefault)) {
        state.paymentMethods[0].isDefault = true;
      }
    },
    removePaymentMethodFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    setDefaultPaymentMethodStart: (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    },
    setDefaultPaymentMethodSuccess: (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.paymentMethods = state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === action.payload
      }));
    },
    setDefaultPaymentMethodFailure: (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    },
    
    clearUserError: (state) => {
      state.error = null;
    },
    
    resetUser: () => initialState
  }
});

export const {
  setUserData,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateProfile,
  updateEmailStart,
  updateEmailSuccess,
  updateEmailFailure,
  updatePhoneStart,
  updatePhoneSuccess,
  updatePhoneFailure,
  uploadProfileImageStart,
  uploadProfileImageSuccess,
  uploadProfileImageFailure,
  addPaymentMethodStart,
  addPaymentMethodSuccess,
  addPaymentMethodFailure,
  removePaymentMethodStart,
  removePaymentMethodSuccess,
  removePaymentMethodFailure,
  setDefaultPaymentMethodStart,
  setDefaultPaymentMethodSuccess,
  setDefaultPaymentMethodFailure,
  clearUserError,
  resetUser
} = userSlice.actions;

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(updateProfileStart());
    const response = await mockApiService.user.updateProfile(profileData);
    dispatch(updateProfileSuccess(profileData));
    return { success: true, data: response };
  } catch (error) {
    dispatch(updateProfileFailure(error.message || 'Failed to update profile'));
    return { success: false, error: error.message };
  }
};

export const updateEmail = (email) => async (dispatch) => {
  try {
    dispatch(updateEmailStart());
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(updateEmailSuccess({ email }));
    return { success: true };
  } catch (error) {
    dispatch(updateEmailFailure(error.message || 'Failed to update email'));
    return { success: false, error: error.message };
  }
};

export const updatePhone = (phoneNumber) => async (dispatch) => {
  try {
    dispatch(updatePhoneStart());
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch(updatePhoneSuccess({ phoneNumber }));
    return { success: true };
  } catch (error) {
    dispatch(updatePhoneFailure(error.message || 'Failed to update phone number'));
    return { success: false, error: error.message };
  }
};

export const uploadProfileImage = (imageFile) => async (dispatch) => {
  try {
    dispatch(uploadProfileImageStart());
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockImageUrl = URL.createObjectURL(imageFile);
    dispatch(uploadProfileImageSuccess({ imageUrl: mockImageUrl }));
    return { success: true, imageUrl: mockImageUrl };
  } catch (error) {
    dispatch(uploadProfileImageFailure(error.message || 'Failed to upload profile image'));
    return { success: false, error: error.message };
  }
};

export const addPaymentMethod = (paymentData) => async (dispatch) => {
  try {
    dispatch(addPaymentMethodStart());
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPaymentMethod = {
      id: 'pm_' + Math.random().toString(36).substring(2, 9),
      ...paymentData,
      createdAt: new Date().toISOString()
    };
    dispatch(addPaymentMethodSuccess(newPaymentMethod));
    return { success: true, data: newPaymentMethod };
  } catch (error) {
    dispatch(addPaymentMethodFailure(error.message || 'Failed to add payment method'));
    return { success: false, error: error.message };
  }
};

export const removePaymentMethod = (paymentMethodId) => async (dispatch) => {
  try {
    dispatch(removePaymentMethodStart());
    await new Promise(resolve => setTimeout(resolve, 800));
    dispatch(removePaymentMethodSuccess(paymentMethodId));
    return { success: true };
  } catch (error) {
    dispatch(removePaymentMethodFailure(error.message || 'Failed to remove payment method'));
    return { success: false, error: error.message };
  }
};

export const setDefaultPaymentMethod = (paymentMethodId) => async (dispatch) => {
  try {
    dispatch(setDefaultPaymentMethodStart());
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setDefaultPaymentMethodSuccess(paymentMethodId));
    return { success: true };
  } catch (error) {
    dispatch(setDefaultPaymentMethodFailure(error.message || 'Failed to set default payment method'));
    return { success: false, error: error.message };
  }
};

export const selectUserId = (state) => state.user.id;
export const selectUserEmail = (state) => state.user.email;
export const selectUserName = (state) => `${state.user.firstName} ${state.user.lastName}`;
export const selectUserBalance = (state) => state.user.balance;
export const selectUserProfile = (state) => ({
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  email: state.user.email,
  phoneNumber: state.user.phoneNumber,
  address: state.user.address,
  country: state.user.country,
  profileImage: state.user.profileImage
});
export const selectUserStatus = (state) => state.user.status;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectKycStatus = (state) => state.user.kycVerified;
export const selectReferralCode = (state) => state.user.referralCode;
export const selectPaymentMethods = (state) => state.user?.paymentMethods || [];
export const selectDefaultPaymentMethod = (state) => state.user?.paymentMethods?.find(method => method.isDefault) || null;

export default userSlice.reducer;
