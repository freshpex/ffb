import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import depositSlice from './slices/depositSlice';
import withdrawalSlice from './slices/withdrawalSlice';
import tradingSlice from './slices/tradingSlice';
import investmentSlice from './slices/investmentSlice';
import notificationSlice from './slices/notificationSlice';
import layoutSlice from './slices/layoutSlice';
import dashboardSlice from './slices/dashboardSlice';
import educationSlice from './slices/educationSlice';
import securitySlice from './slices/securitySlice';
import referralSlice from './slices/referralSlice';
import atmCardsSlice from './slices/atmCardsSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    deposit: depositSlice,
    withdrawal: withdrawalSlice,
    trading: tradingSlice,
    investment: investmentSlice,
    notifications: notificationSlice,
    layout: layoutSlice,
    dashboard: dashboardSlice,
    education: educationSlice,
    security: securitySlice,
    referral: referralSlice,
    atmCards: atmCardsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
