import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Fetch admin profile
export const fetchAdminProfile = createAsyncThunk(
  'adminProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin profile');
    }
  }
);

// Update admin profile
export const updateAdminProfile = createAsyncThunk(
  'adminProfile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update admin profile');
    }
  }
);

// Upload admin profile image
export const uploadAdminProfileImage = createAsyncThunk(
  'adminProfile/uploadProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_URL}/admin/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload profile image');
    }
  }
);

// Change admin password
export const changeAdminPassword = createAsyncThunk(
  'adminProfile/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await handleApiError(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

// Fetch admin preferences
export const fetchAdminPreferences = createAsyncThunk(
  'adminProfile/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/profile/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin preferences');
    }
  }
);

// Update admin preferences
export const updateAdminPreferences = createAsyncThunk(
  'adminProfile/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/admin/profile/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update admin preferences');
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  preferences: {
    theme: 'dark',
    dashboardLayout: 'default',
    sidebarCollapsed: false,
    emailNotifications: true,
    notificationSound: true
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: 'idle' // For tracking specific actions (e.g., changing password)
};

const adminProfileSlice = createSlice({
  name: 'adminProfile',
  initialState,
  reducers: {
    clearAdminProfileError: (state) => {
      state.error = null;
      state.actionStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin profile
      .addCase(fetchAdminProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update admin profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Upload admin profile image
      .addCase(uploadAdminProfileImage.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(uploadAdminProfileImage.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        if (state.profile) {
          state.profile.profileImage = action.payload.profileImage;
        }
        state.error = null;
      })
      .addCase(uploadAdminProfileImage.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Change admin password
      .addCase(changeAdminPassword.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(changeAdminPassword.fulfilled, (state) => {
        state.actionStatus = 'succeeded';
        state.error = null;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Fetch admin preferences
      .addCase(fetchAdminPreferences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminPreferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preferences = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminPreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update admin preferences
      .addCase(updateAdminPreferences.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updateAdminPreferences.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.preferences = action.payload;
        state.error = null;
      })
      .addCase(updateAdminPreferences.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearAdminProfileError } = adminProfileSlice.actions;

// Export selectors
export const selectAdminProfile = state => state.adminProfile.profile;
export const selectAdminPreferences = state => state.adminProfile.preferences;
export const selectAdminProfileStatus = state => state.adminProfile.status;
export const selectAdminProfileError = state => state.adminProfile.error;
export const selectAdminProfileActionStatus = state => state.adminProfile.actionStatus;

export default adminProfileSlice.reducer;
