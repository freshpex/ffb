import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiService";
import { auth } from "../../firebase";

// Helper function to ensure auth is initialized
const getAuthToken = async () => {
  if (!auth.currentUser) {
    return null;
  }

  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Helper to check authentication status
const checkAuthStatus = () => {
  return (
    !!localStorage.getItem("ffb_auth_token") ||
    !!sessionStorage.getItem("ffb_auth_token")
  );
};

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await apiClient.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// Async thunk for uploading profile image
export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await apiClient.post("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload profile image",
      );
    }
  },
);

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Skip request entirely if we know we're not authenticated
      if (!checkAuthStatus()) {
        console.log("Skipping profile fetch - user not authenticated");
        return { data: null };
      }

      const response = await apiClient.get("/users/profile");
      return response.data;
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        console.log("Not authenticated for profile fetch");
        return { data: null };
      }

      console.error("Error fetching profile:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

// Payment methods operations
export const addPaymentMethod = createAsyncThunk(
  "user/addPaymentMethod",
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await apiClient.post(
        "/users/payment-methods",
        paymentMethodData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding payment method:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add payment method",
      );
    }
  },
);

export const removePaymentMethod = createAsyncThunk(
  "user/removePaymentMethod",
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await apiClient.delete(
        `/users/payment-methods/${paymentMethodId}`,
      );
      return { ...response.data, paymentMethodId };
    } catch (error) {
      console.error("Error removing payment method:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove payment method",
      );
    }
  },
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "user/setDefaultPaymentMethod",
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const response = await apiClient.put(
        `/users/payment-methods/${paymentMethodId}/default`,
      );
      return response.data;
    } catch (error) {
      console.error("Error setting default payment method:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to set default payment method",
      );
    }
  },
);

export const fetchPaymentMethods = createAsyncThunk(
  "user/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        console.log("User not authenticated, skipping payment methods fetch");
        return { data: [] };
      }

      const response = await apiClient.get("/users/payment-methods");
      return response.data;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment methods",
      );
    }
  },
);

// Initial state
const initialState = {
  profile: null,
  paymentMethods: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.profile = null;
      state.paymentMethods = [];
      state.status = "idle";
      state.error = null;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle uploadProfileImage
      .addCase(uploadProfileImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.profile) {
          state.profile.profileImage = action.payload.data.profileImage;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetchPaymentMethods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentMethods = action.payload.data;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle addPaymentMethod
      .addCase(addPaymentMethod.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentMethods.push(action.payload.data);
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle removePaymentMethod
      .addCase(removePaymentMethod.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentMethods = state.paymentMethods.filter(
          (method) => method.id !== action.payload.paymentMethodId,
        );
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle setDefaultPaymentMethod
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.status = "succeeded";
        const defaultMethodId = action.payload.data.id;
        state.paymentMethods = state.paymentMethods.map((method) => ({
          ...method,
          isDefault: method.id === defaultMethodId,
        }));
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetUserState, clearUserError } = userSlice.actions;

// Export selectors
export const selectUserProfile = (state) => state.user.profile || null;

export const selectUserLoading = (state) => state.user.status === "loading";

export const selectUserError = (state) => state.user.error;

export const selectPaymentMethods = (state) => state.user.paymentMethods || [];
export const selectUserName = (state) => {
  const profile = state.user.profile;
  if (!profile) return "User";

  if (profile.firstName) {
    return `${profile.firstName} ${profile.lastName || ""}`.trim();
  }

  return profile.username || "User";
};

export const selectUserBalance = (state) => {
  const profile = state.user.profile;
  if (!profile) return 0;
  return (
    profile.accountBalance ?? profile.balance ?? profile.availableBalance ?? 0
  );
};

export const selectUserEmail = (state) => {
  const profile = state.user.profile;
  return profile ? profile.email || "" : "";
};

export default userSlice.reducer;
