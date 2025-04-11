import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';
import { auth } from '../../firebase';

// Helper to check authentication status
const checkAuthStatus = () => {
  return !!localStorage.getItem('ffb_auth_token') || !!sessionStorage.getItem('ffb_auth_token');
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ limit = 10, page = 1 } = {}, { rejectWithValue, dispatch }) => {
    try {
      if (!checkAuthStatus()) {
        console.log('Skipping notifications fetch - user not authenticated');
        return { data: [], unreadCount: 0 };
      }
      
      const response = await apiClient.get('/notifications', {
        params: { limit, page }
      });
      return response.data;
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        console.log('Not authenticated for notifications');
        return { data: [], unreadCount: 0 };
      }
      
      console.error('Error fetching notifications:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Skip request entirely if we know we're not authenticated
      if (!checkAuthStatus()) {
        console.log('Skipping mark as read - user not authenticated');
        return { notificationId };
      }
      
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return { ...response.data, notificationId };
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        return { notificationId };
      }
      
      console.error('Error marking notification as read:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      // Skip request entirely if we know we're not authenticated
      if (!checkAuthStatus()) {
        console.log('Skipping mark all as read - user not authenticated');
        return { success: true };
      }
      
      const response = await apiClient.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        return { success: true };
      }
      
      console.error('Error marking all notifications as read:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Skip request entirely if we know we're not authenticated
      if (!checkAuthStatus()) {
        console.log('Skipping delete notification - user not authenticated');
        return { notificationId };
      }
      
      await apiClient.delete(`/notifications/${notificationId}`);
      return { notificationId };
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        return { notificationId };
      }
      
      console.error('Error deleting notification:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  success: false
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    resetNotificationState: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    addNotification: (state, action) => {
      // For real-time notifications
      if (action.payload && action.payload.notification) {
        state.notifications.unshift(action.payload.notification);
        if (!action.payload.notification.read) {
          state.unreadCount += 1;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
        // Calculate unreadCount from the notifications array
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })

      // markAsRead
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Find the notification and update its read status safely
        const notification = state.notifications.find(n => n.id === action.payload.notificationId || n._id === action.payload.notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark notification as read';
      })

      // markAllAsRead
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        // Update all notifications to read
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark all notifications as read';
      })

      // deleteNotification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the notification and update unread count if needed
        const index = state.notifications.findIndex(n => 
          n.id === action.payload.notificationId || 
          n._id === action.payload.notificationId
        );
        
        if (index !== -1) {
          const wasPreviouslyUnread = !state.notifications[index].read;
          state.notifications.splice(index, 1);
          if (wasPreviouslyUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete notification';
      });
  }
});

// Export actions
export const { 
  clearNotificationError, 
  resetNotificationState,
  addNotification 
} = notificationSlice.actions;

// Export selectors
export const selectNotifications = state => state.notification.notifications || [];
export const selectUnreadCount = state => state.notification.unreadCount || 0;
export const selectNotificationLoading = state => state.notification.loading;
export const selectNotificationError = state => state.notification.error;

export default notificationSlice.reducer;
