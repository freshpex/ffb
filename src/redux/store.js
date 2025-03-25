import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import securityReducer from './slices/securitySlice';
import dashboardReducer from './slices/dashboardSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import depositReducer from './slices/depositSlice';
import investmentReducer from './slices/investmentSlice';
import rootReducer from './reducers';

export const store = configureStore({
  reducer: {
    user: userReducer,
    security: securityReducer,
    dashboard: dashboardReducer,
    withdrawal: withdrawalReducer,
    deposit: depositReducer,
    investment: investmentReducer,
    root: rootReducer,
  },
  // Add middleware or other store
});

export default store;
