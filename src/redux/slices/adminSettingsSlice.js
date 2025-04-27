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

// Fetch all settings
export const fetchAllSettings = createAsyncThunk(
  "adminSettings/fetchAllSettings",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage - important to use the admin token
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch settings");
    }
  },
);

// Fetch settings by category
export const fetchSettingsByCategory = createAsyncThunk(
  "adminSettings/fetchSettingsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/admin/settings/category/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await handleApiError(response);
      return { category, settings: data.data || data };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch category settings",
      );
    }
  },
);

// Update settings
export const updateSettings = createAsyncThunk(
  "adminSettings/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data = await handleApiError(response);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update settings");
    }
  },
);

// Create setting (superadmin only)
export const createSetting = createAsyncThunk(
  "adminSettings/createSetting",
  async (settingData, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/settings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingData),
      });

      const data = await handleApiError(response);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create setting");
    }
  },
);

// Delete setting (superadmin only)
export const deleteSetting = createAsyncThunk(
  "adminSettings/deleteSetting",
  async (key, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/settings/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      return key;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete setting");
    }
  },
);

// Reset settings to defaults (superadmin only)
export const resetToDefaults = createAsyncThunk(
  "adminSettings/resetToDefaults",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/settings/reset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reset settings");
    }
  },
);

// Initial state
const initialState = {
  settings: {},
  categories: [
    { id: "general", name: "General" },
    { id: "security", name: "Security" },
    { id: "email", name: "Email Settings" },
    { id: "payment", name: "Payment" },
    { id: "kyc", name: "KYC Verification" },
    { id: "trading", name: "Trading" },
    { id: "ui", name: "Interface" },
    { id: "notifications", name: "Notifications" },
    { id: "advanced", name: "Advanced" },
  ],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: "idle", // Status for CRUD operations
};

const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    clearAdminSettingsError: (state) => {
      state.error = null;
      state.actionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all settings
      .addCase(fetchAllSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchAllSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch settings by category
      .addCase(fetchSettingsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSettingsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings[action.payload.category] = action.payload.settings;
        state.error = null;
      })
      .addCase(fetchSettingsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        // If we get updated settings back from the API, update our state
        if (action.payload && action.payload.updated) {
          action.payload.updated.forEach((update) => {
            const category = Object.keys(state.settings).find(
              (cat) => state.settings[cat] && state.settings[cat][update.key],
            );
            if (category && update.success) {
              // Update the value if found
              state.settings[category][update.key].value = update.value;
            }
          });
        }
        state.error = null;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Create setting
      .addCase(createSetting.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createSetting.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        // Add the new setting to the appropriate category
        const newSetting = action.payload;
        if (newSetting && newSetting.category) {
          if (!state.settings[newSetting.category]) {
            state.settings[newSetting.category] = {};
          }
          state.settings[newSetting.category][newSetting.key] = {
            value: newSetting.value,
            description: newSetting.description,
            type: newSetting.type,
            options: newSetting.options || [],
          };
        }
        state.error = null;
      })
      .addCase(createSetting.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Delete setting
      .addCase(deleteSetting.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteSetting.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        // Remove the setting
        const keyToDelete = action.payload;
        Object.keys(state.settings).forEach((category) => {
          if (
            state.settings[category] &&
            state.settings[category][keyToDelete]
          ) {
            delete state.settings[category][keyToDelete];
          }
        });
        state.error = null;
      })
      .addCase(deleteSetting.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Reset settings to defaults
      .addCase(resetToDefaults.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(resetToDefaults.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        // We'll just refetch all settings after a reset
        state.status = "idle"; // Mark as needing a refresh
        state.error = null;
      })
      .addCase(resetToDefaults.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearAdminSettingsError } = adminSettingsSlice.actions;

// Export selectors
export const selectAllSettings = (state) => state.adminSettings.settings;
export const selectSettingsByCategory = (state, category) =>
  state.adminSettings.settings[category] || {};
export const selectCategories = (state) => state.adminSettings.categories;
export const selectAdminSettingsStatus = (state) => state.adminSettings.status;
export const selectAdminSettingsError = (state) => state.adminSettings.error;
export const selectAdminSettingsActionStatus = (state) =>
  state.adminSettings.actionStatus;

export default adminSettingsSlice.reducer;
