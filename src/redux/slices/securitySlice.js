import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiService";
import { auth } from "../../firebase";
import { updatePassword as firebaseUpdatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

// Async thunk for updating password
export const updatePassword = createAsyncThunk(
  "security/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const { currentPassword, newPassword } = passwordData;
      const user = auth.currentUser;

      if (!user || !user.email) {
        return rejectWithValue("No authenticated user found");
      }

      let firebaseUpdateSuccessful = false;

      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await firebaseUpdatePassword(user, newPassword);
        firebaseUpdateSuccessful = true;
      } catch (authError) {
        if (authError.code === "auth/wrong-password" || authError.code === "auth/invalid-credential") {
          console.warn("Firebase re-authentication failed, will attempt MongoDB update only");
        } else if (authError.code === "auth/weak-password") {
          return rejectWithValue("New password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.");
        } else if (authError.code === "auth/requires-recent-login") {
          return rejectWithValue("For security, please log out and log in again before changing password");
        } else {
          throw authError; // Re-throw unexpected errors
        }
      }

      // Update in backend MongoDB
      const response = await apiClient.put(
        "/users/security/password",
        passwordData,
      );

      // If Firebase update failed but MongoDB succeeded, inform the user
      if (!firebaseUpdateSuccessful && response.data) {
        return {
          ...response.data,
          message: "Password updated in database, but Firebase authentication may be out of sync. Please use 'Password Reset via Email' to sync properly.",
          partialSuccess: true
        };
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update password";
      return rejectWithValue(message);
    }
  },
);

// Async thunk for enabling 2FA
export const enable2FA = createAsyncThunk(
  "security/enable2FA",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users/security/2fa/setup");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to enable 2FA",
      );
    }
  },
);

// Async thunk for verifying 2FA
export const verify2FA = createAsyncThunk(
  "security/verify2FA",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/users/security/2fa/verify",
        verificationData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify 2FA",
      );
    }
  },
);

// Async thunk for disabling 2FA
export const disable2FA = createAsyncThunk(
  "security/disable2FA",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/users/security/2fa/disable",
        verificationData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to disable 2FA",
      );
    }
  },
);

// Async thunk for fetching security settings
export const fetchSecuritySettings = createAsyncThunk(
  "security/fetchSecuritySettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/security/settings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch security settings",
      );
    }
  },
);

// Initial state
const initialState = {
  settings: {
    twoFactorEnabled: false,
    lastPasswordChange: null,
    loginActivities: [],
    loginNotifications: false,
  },
  setupData: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Create the security slice
const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    resetSecurityState: (state) => {
      state.status = "idle";
      state.error = null;
      state.setupData = null;
    },
    clearSecurityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSecuritySettings
      .addCase(fetchSecuritySettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSecuritySettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings = action.payload.data;
      })
      .addCase(fetchSecuritySettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle updatePassword
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings.lastPasswordChange = new Date().toISOString();
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle enable2FA
      .addCase(enable2FA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(enable2FA.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.setupData = action.payload.data;
      })
      .addCase(enable2FA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle verify2FA
      .addCase(verify2FA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state) => {
        state.status = "succeeded";
        state.settings.twoFactorEnabled = true;
        state.setupData = null;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle disable2FA
      .addCase(disable2FA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(disable2FA.fulfilled, (state) => {
        state.status = "succeeded";
        state.settings.twoFactorEnabled = false;
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetSecurityState, clearSecurityError } = securitySlice.actions;

// Export selectors
export const selectSecuritySettings = (state) => state.security.settings;
export const selectSecurityStatus = (state) => state.security.status;
export const selectSecurityError = (state) => state.security.error;
export const selectTwoFactorSetupData = (state) => state.security.setupData;

export default securitySlice.reducer;
