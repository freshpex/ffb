import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import userSlice from "./slices/userSlice";
import dashboardSlice from "./slices/dashboardSlice";
import depositSlice from "./slices/depositSlice";
import withdrawalSlice from "./slices/withdrawalSlice";
import investmentSlice from "./slices/investmentSlice";
import securitySlice from "./slices/securitySlice";
import notificationSlice from "./slices/notificationSlice";
import referralSlice from "./slices/referralSlice";
import tradingSlice from "./slices/tradingSlice";
import educationSlice from "./slices/educationSlice";
import layoutSlice from "./slices/layoutSlice";
import atmCardsSlice from "./slices/atmCardsSlice";
import taskSlice from "./slices/taskSlice";

// Admin slices
import adminAuthSlice from "./slices/adminAuthSlice";
import adminUsersSlice from "./slices/adminUsersSlice";
import adminTransactionsSlice from "./slices/adminTransactionsSlice";
import adminKycSlice from "./slices/adminKycSlice";
import adminSupportSlice from "./slices/adminSupportSlice";
import adminNotificationSlice from "./slices/adminNotificationSlice";
import adminAnalyticsReducer from "./slices/adminAnalyticsSlice";
import adminSettingsSlice from "./slices/adminSettingsSlice";
import adminProfileSlice from "./slices/adminProfileSlice";
import adminCardSlice from "./slices/adminCardSlice";
import visitorAnalyticsSlice from "./slices/visitorAnalyticsSlice";

const store = configureStore({
  reducer: {
    ...rootReducer,
    user: userSlice,
    dashboard: dashboardSlice,
    deposit: depositSlice,
    withdrawal: withdrawalSlice,
    investment: investmentSlice,
    security: securitySlice,
    notification: notificationSlice,
    referral: referralSlice,
    trading: tradingSlice,
    education: educationSlice,
    layout: layoutSlice,
    atmCards: atmCardsSlice,
    tasks: taskSlice,

    // Admin reducers
    adminAuth: adminAuthSlice,
    adminUsers: adminUsersSlice,
    adminTransactions: adminTransactionsSlice,
    adminKyc: adminKycSlice,
    adminSupport: adminSupportSlice,
    adminNotifications: adminNotificationSlice,
    adminAnalytics: adminAnalyticsReducer,
    adminSettings: adminSettingsSlice,
    adminProfile: adminProfileSlice,
    adminCards: adminCardSlice,
    visitorAnalytics: visitorAnalyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
