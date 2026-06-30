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
    !!sessionStorage.getItem("ffb_auth_token") ||
    !!localStorage.getItem("ffb_admin_token") ||
    !!sessionStorage.getItem("ffb_admin_token")
  );
};

const requireStoredAuth = () => {
  if (!checkAuthStatus()) {
    throw new Error("User not authenticated");
  }
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
  async (payload, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return rejectWithValue("User not authenticated");
      }

      const formData = payload instanceof FormData ? payload : new FormData();
      if (!(payload instanceof FormData)) {
        formData.append("image", payload);
      }

      const response = await apiClient.post("/users/profile/image", formData);
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
        return { data: null };
      }

      const response = await apiClient.get("/users/profile");
      return response.data;
    } catch (error) {
      // If this is an auth error, don't show error to user
      if (error.isAuthError || error.response?.status === 401) {
        return { data: null };
      }

      console.error("Error fetching profile:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const fetchBonusConversionStatus = createAsyncThunk(
  "user/fetchBonusConversionStatus",
  async (_, { rejectWithValue }) => {
    try {
      if (!checkAuthStatus()) {
        return { data: null };
      }

      const response = await apiClient.get("/users/bonus/status");
      return response.data;
    } catch (error) {
      if (error.isAuthError || error.response?.status === 401) {
        return { data: null };
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error?.message ||
          "Failed to fetch bonus status",
      );
    }
  },
);

export const convertBonusBalance = createAsyncThunk(
  "user/convertBonusBalance",
  async ({ amount } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users/bonus/convert", {
        ...(amount !== undefined && amount !== null && amount !== ""
          ? { amount }
          : {}),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error?.message ||
          "Failed to convert bonus balance",
      );
    }
  },
);

// Payment methods operations
export const addPaymentMethod = createAsyncThunk(
  "user/addPaymentMethod",
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      requireStoredAuth();

      const response = await apiClient.post(
        "/users/payment-methods",
        paymentMethodData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding payment method:", error);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to add payment method",
      );
    }
  },
);

export const removePaymentMethod = createAsyncThunk(
  "user/removePaymentMethod",
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      requireStoredAuth();

      const response = await apiClient.delete(
        `/users/payment-methods/${paymentMethodId}`,
      );
      return { ...response.data, paymentMethodId };
    } catch (error) {
      console.error("Error removing payment method:", error);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to remove payment method",
      );
    }
  },
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "user/setDefaultPaymentMethod",
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      requireStoredAuth();

      const response = await apiClient.put(
        `/users/payment-methods/${paymentMethodId}/default`,
      );
      return response.data;
    } catch (error) {
      console.error("Error setting default payment method:", error);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to set default payment method",
      );
    }
  },
);

export const fetchPaymentMethods = createAsyncThunk(
  "user/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      if (!checkAuthStatus()) return { data: [] };

      const response = await apiClient.get("/users/payment-methods");
      return response.data;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to fetch payment methods",
      );
    }
  },
);

export const updatePaymentMethod = createAsyncThunk(
  "user/updatePaymentMethod",
  async ({ paymentMethodId, updates }, { rejectWithValue }) => {
    try {
      requireStoredAuth();

      const response = await apiClient.put(
        `/users/payment-methods/${paymentMethodId}`,
        updates,
      );
      return { ...response.data, paymentMethodId };
    } catch (error) {
      console.error("Error updating payment method:", error);
      return rejectWithValue(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to update payment method",
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
  profileUploadStatus: "idle", // 'idle' | 'uploading' | 'succeeded' | 'failed'
  profileUploadError: null,
  profileUpdateStatus: "idle", // 'idle' | 'updating' | 'succeeded' | 'failed'
  profileUpdateError: null,
  bonusStatus: null,
  bonusStatusLoading: false,
  bonusStatusError: null,
  bonusConvertLoading: false,
  bonusConvertError: null,
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
        // Avoid wiping an already-loaded profile due to a transient auth/init issue
        if (action.payload?.data) {
          state.profile = action.payload.data;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Bonus conversion status
      .addCase(fetchBonusConversionStatus.pending, (state) => {
        state.bonusStatusLoading = true;
        state.bonusStatusError = null;
      })
      .addCase(fetchBonusConversionStatus.fulfilled, (state, action) => {
        state.bonusStatusLoading = false;
        state.bonusStatus = action.payload?.data || null;
      })
      .addCase(fetchBonusConversionStatus.rejected, (state, action) => {
        state.bonusStatusLoading = false;
        state.bonusStatusError = action.payload;
      })

      // Convert bonus balance
      .addCase(convertBonusBalance.pending, (state) => {
        state.bonusConvertLoading = true;
        state.bonusConvertError = null;
      })
      .addCase(convertBonusBalance.fulfilled, (state, action) => {
        state.bonusConvertLoading = false;
        const data = action.payload?.data;
        if (state.profile && data) {
          state.profile.balance = data.balance;
          state.profile.bonusBalance = data.bonusBalance;
        }
        state.bonusStatus = {
          ...(state.bonusStatus || {}),
          ...(data
            ? {
                balance: data.balance,
                bonusBalance: data.bonusBalance,
                depositTotal: data.depositTotal,
                minDepositRequired: data.minDepositRequired,
                eligible: data.eligible,
              }
            : {}),
        };
      })
      .addCase(convertBonusBalance.rejected, (state, action) => {
        state.bonusConvertLoading = false;
        state.bonusConvertError = action.payload;
      })

      // Handle updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdateStatus = "updating";
        state.profileUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdateStatus = "succeeded";

        const updated = action.payload?.data;
        if (updated) {
          // Keep existing values (like profileImage) if backend omitted them
          state.profile = {
            ...(state.profile || {}),
            ...updated,
          };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdateStatus = "failed";
        state.profileUpdateError = action.payload;
      })

      // Handle uploadProfileImage
      .addCase(uploadProfileImage.pending, (state) => {
        state.profileUploadStatus = "uploading";
        state.profileUploadError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.profileUploadStatus = "succeeded";
        const payload = action.payload?.data || {};
        const imageUrl =
          payload.imageUrl ||
          payload.profileImage ||
          payload.user?.profileImage;
        if (state.profile && imageUrl) {
          state.profile.profileImage = imageUrl;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.profileUploadStatus = "failed";
        state.profileUploadError = action.payload;
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
      })

      // Handle updatePaymentMethod
      .addCase(updatePaymentMethod.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload.data;
        const id = updated?.id || action.payload.paymentMethodId;
        if (!id) return;
        state.paymentMethods = state.paymentMethods.map((m) =>
          m.id === id ? { ...m, ...updated } : m,
        );
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
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

export const selectUserProfileUpdating = (state) =>
  state.user.profileUpdateStatus === "updating";

export const selectUserProfileUploadStatus = (state) =>
  state.user.profileUploadStatus;

export const selectUserProfileUploadError = (state) =>
  state.user.profileUploadError;

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

export const selectUserBonusBalance = (state) => {
  const profile = state.user.profile;
  if (!profile) return 0;
  return profile.bonusBalance ?? 0;
};

export const selectUserEmail = (state) => {
  const profile = state.user.profile;
  return profile ? profile.email || "" : "";
};

export const selectBonusStatus = (state) => state.user.bonusStatus;
export const selectBonusStatusLoading = (state) => state.user.bonusStatusLoading;
export const selectBonusConvertLoading = (state) => state.user.bonusConvertLoading;
export const selectBonusError = (state) =>
  state.user.bonusConvertError || state.user.bonusStatusError;

export default userSlice.reducer;
