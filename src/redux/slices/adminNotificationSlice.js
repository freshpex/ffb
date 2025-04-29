import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Fetch admin notifications
export const fetchAdminNotifications = createAsyncThunk(
  "adminNotifications/fetchAdminNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Notifsyutogg rsponse", response);

      const data = await handleApiError(response);

      console.log("data rsponse", data);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  },
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  "adminNotifications/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await handleApiError(response);
      return { id: notificationId, ...data.data };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark notification as read",
      );
    }
  },
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "adminNotifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark all notifications as read",
      );
    }
  },
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  "adminNotifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      await handleApiError(response);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete notification");
    }
  },
);

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: "idle", // Status for CRUD operations
};

const adminNotificationSlice = createSlice({
  name: "adminNotifications",
  initialState,
  reducers: {
    clearAdminNotificationError: (state) => {
      state.error = null;
      state.actionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          console.log("Notification payload:", action.payload);

          if (Array.isArray(action.payload)) {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(
              (notification) => !notification.read,
            ).length;
          } else if (action.payload.notifications) {
            // If the API returns { notifications: [...] }
            state.notifications = action.payload.notifications;
            state.unreadCount = action.payload.notifications.filter(
              (notification) => !notification.read,
            ).length;
          } else {
            console.error(
              "Unexpected notification payload structure:",
              action.payload,
            );
            state.notifications = [];
            state.unreadCount = 0;
          }
        } else {
          state.notifications = [];
          state.unreadCount = 0;
        }

        state.error = null;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch notifications";
      })

      // Mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload.id || n.id === action.payload.id,
        );
        if (index !== -1) {
          state.notifications[index].read = true;
          state.unreadCount = state.notifications.filter(
            (notification) => !notification.read,
          ).length;
        }
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to mark notification as read";
      })

      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        state.notifications.forEach((notification) => {
          notification.read = true;
        });
        state.unreadCount = 0;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error =
          action.payload || "Failed to mark all notifications as read";
      })

      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload && n.id !== action.payload,
        );
        state.unreadCount = state.notifications.filter(
          (notification) => !notification.read,
        ).length;
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || "Failed to delete notification";
      });
  },
});

// Export actions
export const { clearAdminNotificationError } = adminNotificationSlice.actions;

// Export selectors
export const selectAdminNotifications = (state) =>
  state.adminNotifications.notifications;
export const selectUnreadCount = (state) =>
  state.adminNotifications.unreadCount;
export const selectAdminNotificationStatus = (state) =>
  state.adminNotifications.status;
export const selectAdminNotificationError = (state) =>
  state.adminNotifications.error;
export const selectAdminNotificationActionStatus = (state) =>
  state.adminNotifications.actionStatus;

export default adminNotificationSlice.reducer;
