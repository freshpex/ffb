import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/apiConfig";

// API base URL
const API_URL = API_BASE_URL;

const buildFullName = (user) => {
  const first = user?.firstName?.trim();
  const last = user?.lastName?.trim();
  const full = [first, last].filter(Boolean).join(" ");
  return full || user?.email || "Unknown";
};

const normalizeKycRequest = (req) => {
  if (!req) return req;

  const user = req.user || {};
  const documents = [
    req.frontImage
      ? { type: "front_image", label: "Front of ID", url: req.frontImage }
      : null,
    req.backImage
      ? { type: "back_image", label: "Back of ID", url: req.backImage }
      : null,
    req.selfieImage
      ? { type: "selfie_image", label: "Selfie", url: req.selfieImage }
      : null,
    req.proofOfAddressImage
      ? {
          type: "proof_of_address",
          label: "Proof of Address",
          url: req.proofOfAddressImage,
        }
      : null,
  ].filter(Boolean);

  return {
    ...req,
    id: req._id,
    submittedAt: req.createdAt || req.submittedAt || req.updatedAt,
    user: {
      ...user,
      id: user._id || user.id,
      fullName: buildFullName(user),
    },
    documents,
  };
};

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Initial state with proper pagination structure
const initialState = {
  kycRequests: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRequests: 0,
  },
  selectedKycRequest: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

// Fetch all KYC requests
export const fetchKycRequests = createAsyncThunk(
  "adminKyc/fetchKycRequests",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status, search } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(status && { status }),
        ...(search && { search }),
      });

      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/kyc?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);

      const raw = data.data;
      const kycRequests = (raw?.kycRequests || []).map(normalizeKycRequest);

      const pagination = {
        page: raw?.pagination?.page || 1,
        limit: raw?.pagination?.limit || 10,
        totalPages: raw?.pagination?.pages || 0,
        total: raw?.pagination?.total || 0,
        totalRequests: raw?.pagination?.total || 0,
      };

      return { kycRequests, pagination };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch KYC requests");
    }
  },
);

// Fetch KYC request by ID
export const fetchKycRequestById = createAsyncThunk(
  "adminKyc/fetchKycRequestById",
  async (id, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/kyc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return normalizeKycRequest(data.data);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch KYC request");
    }
  },
);

// Approve KYC request
export const approveKycRequest = createAsyncThunk(
  "adminKyc/approveKycRequest",
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/kyc/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to approve KYC request");
    }
  },
);

// Reject KYC request
export const rejectKycRequest = createAsyncThunk(
  "adminKyc/rejectKycRequest",
  async ({ id, reason, notes }, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/kyc/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, notes }),
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reject KYC request");
    }
  },
);

// Fetch KYC statistics
export const fetchKycStats = createAsyncThunk(
  "adminKyc/fetchKycStats",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/kyc/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch KYC statistics");
    }
  },
);

const adminKycSlice = createSlice({
  name: "adminKyc",
  initialState,
  reducers: {
    clearSelectedKycRequest: (state) => {
      state.selectedKycRequest = null;
    },
    clearKycError: (state) => {
      state.error = null;
      state.actionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch KYC requests
      .addCase(fetchKycRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKycRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kycRequests = action.payload.kycRequests;
        state.pagination = {
          page: action.payload.pagination.page || 1,
          limit: action.payload.pagination.limit || 10,
          totalPages: action.payload.pagination.totalPages || 0,
          totalRequests: action.payload.pagination.totalRequests || 0,
        };
        state.error = null;
      })
      .addCase(fetchKycRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch KYC request by ID
      .addCase(fetchKycRequestById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKycRequestById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedKycRequest = action.payload;
        state.error = null;
      })
      .addCase(fetchKycRequestById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Approve KYC request
      .addCase(approveKycRequest.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(approveKycRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedKycRequest = action.payload;

        // Update KYC request in the list if it exists
        const index = state.kycRequests.findIndex(
          (req) => req._id === action.payload._id,
        );
        if (index !== -1) {
          state.kycRequests[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(approveKycRequest.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Reject KYC request
      .addCase(rejectKycRequest.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(rejectKycRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedKycRequest = action.payload;

        // Update KYC request in the list if it exists
        const index = state.kycRequests.findIndex(
          (req) => req._id === action.payload._id,
        );
        if (index !== -1) {
          state.kycRequests[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(rejectKycRequest.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Fetch KYC stats
      .addCase(fetchKycStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKycStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchKycStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearSelectedKycRequest, clearKycError } = adminKycSlice.actions;

// Export selectors
export const selectKycRequests = (state) => state.adminKyc.kycRequests;
export const selectSelectedKycRequest = (state) =>
  state.adminKyc.selectedKycRequest;
export const selectKycPagination = (state) => state.adminKyc.pagination;
export const selectKycStats = (state) => state.adminKyc.stats;
export const selectKycStatus = (state) => state.adminKyc.status;
export const selectKycError = (state) => state.adminKyc.error;
export const selectKycActionStatus = (state) => state.adminKyc.actionStatus;

// Backwards-compatible alias (older UI imports this name)
export const selectActionStatus = selectKycActionStatus;

export default adminKycSlice.reducer;
