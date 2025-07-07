import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiService";

// Async thunk to fetch user referrals
export const fetchReferrals = createAsyncThunk(
  "referral/fetchReferrals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/referrals");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch referrals",
      );
    }
  },
);

// Async thunk to fetch commission history
export const fetchCommissionHistory = createAsyncThunk(
  "referral/fetchCommissionHistory",
  async ({ page = 1, limit = 10, startDate, endDate, status } = {}, { rejectWithValue }) => {
    try {
      let query = `/referrals/commissions?page=${page}&limit=${limit}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      if (status) query += `&status=${status}`;
      
      const response = await apiClient.get(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch commission history",
      );
    }
  },
);

// Async thunk to generate a new referral link
export const generateNewReferralLink = createAsyncThunk(
  "referral/generateNewReferralLink",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/referrals/generate-link");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate new referral link",
      );
    }
  },
);

// Async thunk to send referral invitation by email
export const sendReferralInvitation = createAsyncThunk(
  "referral/sendInvitation",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/referrals/invite", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send referral invitation",
      );
    }
  }
);

// Initial state
const initialState = {
  referrals: [],
  commissionHistory: [],
  referralLink: "",
  referralCode: "",
  statistics: {
    totalReferrals: 0,
    totalEarnings: 0,
    pendingCommissions: 0,
    activeReferrals: 0,
    conversionRate: 0,
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

// Create the referral slice
const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    // Reset referral state
    resetReferralState: (state) => {
      state = initialState;
    },

    // Update pagination
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchReferrals
      .addCase(fetchReferrals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referrals = action.payload.data.referrals || [];
        state.referralLink = action.payload.data.referralLink || "";
        state.referralCode = action.payload.data.referralCode || "";
        state.statistics = {
          totalReferrals: action.payload.data.stats?.totalReferrals || 0,
          totalEarnings: action.payload.data.stats?.totalEarnings || 0,
          pendingCommissions: action.payload.data.stats?.pendingCommissions || 0,
          activeReferrals: action.payload.data.stats?.activeReferrals || 0,
          conversionRate: action.payload.data.stats?.conversionRate || 0,
        };
        state.pagination = action.payload.data.pagination || state.pagination;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetchCommissionHistory
      .addCase(fetchCommissionHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommissionHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.commissionHistory = action.payload.data.commissions || [];
        if (action.payload.data.stats) {
          state.statistics = {
            ...state.statistics,
            totalEarnings: action.payload.data.stats.totalEarnings || 0,
            pendingCommissions: action.payload.data.stats.pendingCommissions || 0,
          };
        }
        state.pagination = action.payload.data.pagination || state.pagination;
      })
      .addCase(fetchCommissionHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle generateNewReferralLink
      .addCase(generateNewReferralLink.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateNewReferralLink.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referralLink = action.payload.data.referralLink || "";
        state.referralCode = action.payload.data.referralCode || "";
      })
      .addCase(generateNewReferralLink.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Handle sendReferralInvitation
      .addCase(sendReferralInvitation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendReferralInvitation.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendReferralInvitation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions from the slice
export const { resetReferralState, setCurrentPage } = referralSlice.actions;

// Selectors
export const selectReferrals = (state) => state.referral.referrals;
export const selectCommissionHistory = (state) => state.referral.commissionHistory;
export const selectReferralLink = (state) => state.referral.referralLink;
export const selectReferralCode = (state) => state.referral.referralCode;
export const selectReferralStatistics = (state) => state.referral.statistics;
export const selectReferralStatus = (state) => state.referral.status;
export const selectReferralError = (state) => state.referral.error;
export const selectReferralPagination = (state) => state.referral.pagination;
export const selectReferralCommissions = (state) => state.referral.commissionHistory;
export const selectReferralStats = (state) => state.referral.statistics;

export default referralSlice.reducer;
