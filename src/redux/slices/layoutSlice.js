import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  theme: 'dark',
  previousPaths: [],
  notifications: [],
  unreadCount: 0,
  globalError: null,
  currentTheme: 'dark',
  isMobile: false
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.sidebarOpen = action.payload !== undefined ? action.payload : !state.sidebarOpen;
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
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
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
    },
    addPreviousPath: (state, action) => {
      state.previousPaths.push(action.payload);
      if (state.previousPaths.length > 5) {
        state.previousPaths.shift();
      }
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
  setIsMobile,
  toggleTheme, 
  addPreviousPath
} = layoutSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.layout.sidebarOpen;
export const selectNotifications = (state) => state.layout.notifications;
export const selectUnreadCount = (state) => state.layout.unreadCount;
export const selectGlobalError = (state) => state.layout.globalError;
export const selectCurrentTheme = (state) => state.layout.currentTheme;
export const selectIsMobile = (state) => state.layout.isMobile;
export const selectTheme = (state) => state.layout.theme;
export const selectPreviousPaths = (state) => state.layout.previousPaths;

export default layoutSlice.reducer;
