import { createSelector } from '@reduxjs/toolkit';

const getUserState = state => state.user;
const getNotificationState = state => state.notification;

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
