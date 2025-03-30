import { createSlice } from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    sidebarOpen: true,
    notifications: [],
    unreadCount: 0,
    globalError: null,
    currentTheme: 'dark',
    isMobile: false
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        read: false,
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      state.unreadCount += 1;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].read;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    }
  }
});

// Extract actions
export const { 
  toggleSidebar, 
  setSidebarOpen, 
  addNotification, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  setGlobalError,
  clearGlobalError,
  setTheme,
  setIsMobile
} = layoutSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.layout.sidebarOpen;
export const selectNotifications = (state) => state.layout.notifications;
export const selectUnreadCount = (state) => state.layout.unreadCount;
export const selectGlobalError = (state) => state.layout.globalError;
export const selectCurrentTheme = (state) => state.layout.currentTheme;
export const selectIsMobile = (state) => state.layout.isMobile;

export default layoutSlice.reducer;
