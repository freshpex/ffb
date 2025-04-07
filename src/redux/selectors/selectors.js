import { createSelector } from '@reduxjs/toolkit';

const getInvestmentState = state => state.investment;
const getUserState = state => state.user;
const getNotificationState = state => state.notification;

// Memoized investment selectors
export const selectInvestmentPlans = createSelector(
  [getInvestmentState],
  investment => investment.plans || []
);

export const selectActiveInvestments = createSelector(
  [getInvestmentState],
  investment => investment.active || []
);

export const selectHistoryInvestments = createSelector(
  [getInvestmentState],
  investment => investment.history || []
);

export const selectInvestmentStatistics = createSelector(
  [getInvestmentState],
  investment => investment.statistics || {}
);

// Memoized user selectors
export const selectUserProfile = createSelector(
  [getUserState],
  user => user.profile || {}
);

// Memoized notification selectors
export const selectNotifications = createSelector(
  [getNotificationState],
  notification => notification.notifications || []
);

export const selectUnreadCount = createSelector(
  [getNotificationState],
  notification => notification.unreadCount || 0
);
