import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import apiClient from "../../services/apiService";

// Initial state structure
const initialState = {
  limits: {
    daily: 10000,
    weekly: 50000,
    monthly: 100000,
    minimum: 100,
  },
  withdrawalForm: {
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    routingNumber: "",
    note: "",
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  errorType: null,
  pendingWithdrawals: [],
  withdrawalHistory: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

// Async thunks
export const submitWithdrawal = createAsyncThunk(
  "withdrawal/submitWithdrawal",
  async (withdrawalData, { rejectWithValue }) => {
    try {
      const formattedData = {
        amount: parseFloat(withdrawalData.amount),
        method: withdrawalData.method,
        description:
          withdrawalData.description ||
          `Withdrawal via ${withdrawalData.method}`,
      };

      if (withdrawalData.method === "cryptocurrency") {
        formattedData.walletAddress = withdrawalData.walletAddress;
        formattedData.cryptoType = withdrawalData.cryptoType;
      } else if (withdrawalData.method === "bank_transfer") {
        formattedData.bankDetails = withdrawalData.bankDetails;
      } else if (withdrawalData.method === "paypal") {
        formattedData.paypalEmail = withdrawalData.paypalEmail;
      }
      const response = await apiClient.post("/withdrawals", formattedData);
      return response.data;
    } catch (error) {
      console.error(
        "Withdrawal submission error:",
        error.response?.data || error.message,
      );
      const apiErr = error?.response?.data?.error;
      return rejectWithValue({
        message:
          apiErr?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to process withdrawal",
        type: apiErr?.type || error?.response?.data?.type,
      });
    }
  },
);

export const submitInternalTransfer = createAsyncThunk(
  "withdrawal/submitInternalTransfer",
  async ({ toAccountNumber, amount, description } = {}, { rejectWithValue }) => {
    try {
      const payload = {
        toAccountNumber,
        amount: parseFloat(amount),
        ...(description ? { description } : {}),
      };
      const response = await apiClient.post("/withdrawals/transfer", payload);
      return response.data;
    } catch (error) {
      console.error(
        "Internal transfer error:",
        error.response?.data || error.message,
      );
      const apiErr = error?.response?.data?.error;
      return rejectWithValue({
        message:
          apiErr?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to transfer funds",
        type: apiErr?.type || error?.response?.data?.type,
      });
    }
  },
);

export const fetchWithdrawalHistory = createAsyncThunk(
  "withdrawal/fetchHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/withdrawals/history?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch withdrawal history",
      );
    }
  },
);

export const cancelWithdrawal = createAsyncThunk(
  "withdrawal/cancelWithdrawal",
  async (withdrawalId, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/withdrawals/${withdrawalId}/cancel`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel withdrawal",
      );
    }
  },
);

// Create the slice
const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    updateWithdrawalForm: (state, action) => {
      state.withdrawalForm = {
        ...state.withdrawalForm,
        ...action.payload,
      };
    },
    resetWithdrawalForm: (state) => {
      state.withdrawalForm = initialState.withdrawalForm;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    clearError: (state) => {
      state.error = null;
      state.errorType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle submitWithdrawal
      .addCase(submitWithdrawal.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(submitWithdrawal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingWithdrawals = [
          ...state.pendingWithdrawals,
          action.payload.data,
        ];
        state.withdrawalForm = initialState.withdrawalForm;
      })
      .addCase(submitWithdrawal.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload;
        if (payload && typeof payload === "object") {
          state.error = payload.message || "Failed to process withdrawal";
          state.errorType = payload.type || null;
        } else {
          state.error =
            payload || action.error?.message || "Failed to process withdrawal";
          state.errorType = null;
        }
      })

      // Handle submitInternalTransfer
      .addCase(submitInternalTransfer.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(submitInternalTransfer.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitInternalTransfer.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload;
        if (payload && typeof payload === "object") {
          state.error = payload.message || "Failed to transfer funds";
          state.errorType = payload.type || null;
        } else {
          state.error =
            payload || action.error?.message || "Failed to transfer funds";
          state.errorType = null;
        }
      })

      // Handle fetchWithdrawalHistory
      .addCase(fetchWithdrawalHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update to correctly handle the backend response structure
        state.withdrawalHistory = action.payload.data.withdrawals || [];
        state.pagination = {
          currentPage: action.payload.data.pagination?.page || 1,
          totalPages: action.payload.data.pagination?.pages || 1,
          totalItems: action.payload.data.pagination?.total || 0,
          itemsPerPage: action.payload.data.pagination?.limit || 10,
        };
      })
      .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch withdrawal history";
        state.errorType = null;
      })

      // Handle cancelWithdrawal
      .addCase(cancelWithdrawal.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.errorType = null;
      })
      .addCase(cancelWithdrawal.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the withdrawal status in both pendingWithdrawals and withdrawalHistory
        const cancelledId = action.payload.data.id;
        state.pendingWithdrawals = state.pendingWithdrawals.filter(
          (withdrawal) => withdrawal.id !== cancelledId,
        );
        state.withdrawalHistory = state.withdrawalHistory.map((withdrawal) =>
          withdrawal.id === cancelledId
            ? { ...withdrawal, status: "cancelled" }
            : withdrawal,
        );
      })
      .addCase(cancelWithdrawal.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to cancel withdrawal";
        state.errorType = null;
      });
  },
});

// Export actions
export const {
  updateWithdrawalForm,
  resetWithdrawalForm,
  setCurrentPage,
  clearError,
} = withdrawalSlice.actions;

// Selectors
export const selectWithdrawalLimits = (state) => state.withdrawal.limits;
export const selectWithdrawalStatus = (state) => state.withdrawal.status;
export const selectWithdrawalError = (state) => state.withdrawal.error;
export const selectWithdrawalErrorType = (state) => state.withdrawal.errorType;
export const selectPendingWithdrawal = (state) =>
  state.withdrawal.pendingWithdrawals[0] || null;
export const selectWithdrawalHistory = (state) =>
  state.withdrawal.withdrawalHistory;
export const selectWithdrawalPagination = (state) =>
  state.withdrawal.pagination;
export const selectWithdrawalForm = (state) => state.withdrawal.withdrawalForm;

export default withdrawalSlice.reducer;
