import { createSlice, createSelector } from '@reduxjs/toolkit';

// Mock notifications
const mockNotifications = [
  {
    id: 'notif-1001',
    title: 'Deposit Successful',
    message: 'Your deposit of $1,000 has been credited to your account.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: 'notif-1002',
    title: 'Price Alert',
    message: 'Bitcoin has increased by 5% in the last hour.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
  },
  {
    id: 'notif-1003',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'notif-1004',
    title: 'Withdrawal Completed',
    message: 'Your withdrawal of $500 to your Bitcoin wallet has been processed.',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
  },
  {
    id: 'notif-1005',
    title: 'Investment Matured',
    message: 'Your Starter Plan investment has matured with a profit of $50.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  }
];

// Mock price alerts
const mockPriceAlerts = [
  {
    id: 'alert-1001',
    symbol: 'BTC/USDT',
    condition: 'above',
    price: 65000,
    active: true,
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: 'alert-1002',
    symbol: 'ETH/USDT',
    condition: 'below',
    price: 3000,
    active: true,
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
];

const initialState = {
  notifications: mockNotifications,
  priceAlerts: mockPriceAlerts,
  status: 'idle',
  error: null,
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    marketUpdates: true,
    accountActivity: true,
    promotions: false
  }
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart(state) {
      state.status = 'loading';
    },
    fetchNotificationsSuccess(state, action) {
      state.status = 'succeeded';
      state.notifications = action.payload;
    },
    fetchNotificationsFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    addNotification(state, action) {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    
    markNotificationAsRead(state, action) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllNotificationsAsRead(state) {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    deleteNotification(state, action) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearAllNotifications(state) {
      state.notifications = [];
    },
    
    // Price alerts
    addPriceAlert(state, action) {
      state.priceAlerts.push({
        id: `alert-${Date.now()}`,
        active: true,
        created: new Date().toISOString(),
        ...action.payload
      });
    },
    
    updatePriceAlert(state, action) {
      const { id, ...updates } = action.payload;
      const alert = state.priceAlerts.find(a => a.id === id);
      if (alert) {
        Object.assign(alert, updates);
      }
    },
    
    deletePriceAlert(state, action) {
      state.priceAlerts = state.priceAlerts.filter(a => a.id !== action.payload);
    },
    
    togglePriceAlert(state, action) {
      const alert = state.priceAlerts.find(a => a.id === action.payload);
      if (alert) {
        alert.active = !alert.active;
      }
    },
    
    // Notification settings
    updateNotificationSettings(state, action) {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    resetNotificationState: () => initialState
  }
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  addPriceAlert,
  updatePriceAlert,
  deletePriceAlert,
  togglePriceAlert,
  updateNotificationSettings,
  resetNotificationState
} = notificationSlice.actions;

// Thunk for fetching notifications
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchNotificationsSuccess(mockNotifications));
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message || 'Failed to fetch notifications'));
  }
};

// Selectors
export const selectNotifications = createSelector(
  [(state) => state.notifications?.notifications || []],
  (notifications) => notifications
);

export const selectUnreadNotifications = state => 
  state.notifications?.notifications.filter(n => !n.read) || [];
export const selectUnreadCount = state => 
  state.notifications?.notifications.filter(n => !n.read).length || 0;
export const selectPriceAlerts = state => state.notifications?.priceAlerts || [];
export const selectNotificationSettings = state => state.notifications?.settings || initialState.settings;

export default notificationSlice.reducer;
