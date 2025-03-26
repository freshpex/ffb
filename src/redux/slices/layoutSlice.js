import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  theme: 'dark',
  notifications: []
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        read: false,
        ...action.payload
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  toggleSidebar,
  toggleMobileMenu,
  setMobileMenuOpen,
  setSidebarCollapsed,
  toggleTheme,
  addNotification,
  markNotificationAsRead,
  clearAllNotifications
} = layoutSlice.actions;

// Selectors
export const selectSidebarCollapsed = (state) => state.layout.sidebarCollapsed;
export const selectMobileMenuOpen = (state) => state.layout.mobileMenuOpen;
export const selectTheme = (state) => state.layout.theme;
export const selectNotifications = (state) => state.layout.notifications;
export const selectUnreadNotificationsCount = (state) => 
  state.layout.notifications.filter(n => !n.read).length;

export const reducer = layoutSlice.reducer;
export default layoutSlice.reducer;
