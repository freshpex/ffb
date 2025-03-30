import { configureStore, combineReducers } from '@reduxjs/toolkit';
import layoutReducer from './slices/layoutSlice';
import userReducer from './slices/userSlice';
import securityReducer from './slices/securitySlice';
import dashboardReducer from './slices/dashboardSlice';
import depositReducer from './slices/depositSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import tradingReducer from './slices/tradingSlice';
import notificationReducer from './slices/notificationSlice';
import referralReducer from './slices/referralSlice';
import educationReducer from './slices/educationSlice';
import investmentReducer from './slices/investmentSlice';
import atmCardsReducer from './slices/atmCardsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  security: securityReducer,
  dashboard: dashboardReducer,
  deposit: depositReducer,
  withdrawal: withdrawalReducer,
  trading: tradingReducer,
  notifications: notificationReducer,
  referral: referralReducer,
  education: educationReducer,
  investment: investmentReducer,
  layout: layoutReducer,
  atmCards: atmCardsReducer
});

// Configure Redux Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable Redux internal values
        ignoredActions: ['investment/makeInvestmentSuccess'],
        ignoredPaths: ['investment.successModal.investmentId'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
