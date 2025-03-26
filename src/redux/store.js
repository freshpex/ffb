import { configureStore } from '@reduxjs/toolkit';
import { reducer as layoutReducer } from './slices/layoutSlice';
import userReducer from './slices/userSlice';
import securityReducer from './slices/securitySlice';
import dashboardReducer from './slices/dashboardSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import depositReducer from './slices/depositSlice';
import tradingReducer from './slices/tradingSlice';
import notificationReducer from './slices/notificationSlice';
import referralReducer from './slices/referralSlice';
import educationReducer from './slices/educationSlice';
import investmentReducer from './slices/investmentSlice';

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    user: userReducer,
    security: securityReducer,
    dashboard: dashboardReducer,
    withdrawal: withdrawalReducer,
    deposit: depositReducer,
    trading: tradingReducer,
    notifications: notificationReducer,
    referral: referralReducer,
    education: educationReducer,
    investment: investmentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
