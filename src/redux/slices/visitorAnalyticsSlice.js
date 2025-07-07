import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Fetch visitor analytics
export const fetchVisitorAnalytics = createAsyncThunk(
  "analytics/fetchVisitorAnalytics",
  async (params = {}, { rejectWithValue }) => {
    try {
        console.log("About to make the request");
      const { period, startDate, endDate } = params;
      
      let queryParams = '';
      if (period) {
        queryParams += `period=${period}`;
      } else if (startDate && endDate) {
        queryParams += `startDate=${startDate}&endDate=${endDate}`;
      }
      
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }
      
      const response = await axios.get(
        `${API_URL}/tracking/analytics?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetchVisitorsAnalytics", response);
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visitor analytics"
      );
    }
  }
);

// Fetch all visitors with pagination
export const fetchAllVisitors = createAsyncThunk(
  "analytics/fetchAllVisitors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, sort = 'lastVisit', order = 'desc' } = params;
      
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }
      
      const response = await axios.get(
        `${API_URL}/tracking?page=${page}&limit=${limit}&sort=${sort}&order=${order}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("fetchAllVisitors", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visitors"
      );
    }
  }
);

// Fetch visitor details
export const fetchVisitorDetails = createAsyncThunk(
  "analytics/fetchVisitorDetails",
  async (visitorId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }
      
      const response = await axios.get(
        `${API_URL}/tracking/${visitorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("fetchVisitorDetails", response);
      return response.data.visitor;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visitor details"
      );
    }
  }
);

const initialState = {
  visitorAnalytics: null,
  visitorAnalyticsStatus: "idle",
  visitorAnalyticsError: null,
  
  // Visitors list
  visitors: [],
  visitorsPagination: {
    page: 1,
    pages: 1,
    total: 0
  },
  visitorsStatus: "idle",
  visitorsError: null,
  
  // Selected visitor
  selectedVisitor: null,
  selectedVisitorStatus: "idle",
  selectedVisitorError: null
};

const visitorSlice = createSlice({
  name: "visitorAnalytics",
  initialState,
  reducers: {
    resetVisitorAnalytics: (state) => {
      state.visitorAnalytics = null;
      state.visitorAnalyticsStatus = "idle";
      state.visitorAnalyticsError = null;
    },
    resetSelectedVisitor: (state) => {
      state.selectedVisitor = null;
      state.selectedVisitorStatus = "idle";
      state.selectedVisitorError = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchVisitorAnalytics
    builder
      .addCase(fetchVisitorAnalytics.pending, (state) => {
        state.visitorAnalyticsStatus = "loading";
        state.visitorAnalyticsError = null;
      })
      .addCase(fetchVisitorAnalytics.fulfilled, (state, action) => {
        state.visitorAnalyticsStatus = "succeeded";
        state.visitorAnalytics = action.payload;
      })
      .addCase(fetchVisitorAnalytics.rejected, (state, action) => {
        state.visitorAnalyticsStatus = "failed";
        state.visitorAnalyticsError = action.payload;
      })
      
    // Handle fetchAllVisitors
    builder
      .addCase(fetchAllVisitors.pending, (state) => {
        state.visitorsStatus = "loading";
        state.visitorsError = null;
      })
      .addCase(fetchAllVisitors.fulfilled, (state, action) => {
        state.visitorsStatus = "succeeded";
        state.visitors = action.payload.visitors;
        state.visitorsPagination = action.payload.pagination;
      })
      .addCase(fetchAllVisitors.rejected, (state, action) => {
        state.visitorsStatus = "failed";
        state.visitorsError = action.payload;
      })
      
    // Handle fetchVisitorDetails
    builder
      .addCase(fetchVisitorDetails.pending, (state) => {
        state.selectedVisitorStatus = "loading";
        state.selectedVisitorError = null;
      })
      .addCase(fetchVisitorDetails.fulfilled, (state, action) => {
        state.selectedVisitorStatus = "succeeded";
        state.selectedVisitor = action.payload;
      })
      .addCase(fetchVisitorDetails.rejected, (state, action) => {
        state.selectedVisitorStatus = "failed";
        state.selectedVisitorError = action.payload;
      });
  },
});

// Export actions
export const { resetVisitorAnalytics, resetSelectedVisitor } = visitorSlice.actions;

// Export selectors
export const selectVisitorAnalytics = (state) => state.visitorAnalytics.visitorAnalytics;
export const selectVisitorAnalyticsStatus = (state) => state.visitorAnalytics.visitorAnalyticsStatus;
export const selectVisitorAnalyticsError = (state) => state.visitorAnalytics.visitorAnalyticsError;

export const selectVisitors = (state) => state.visitorAnalytics.visitors;
export const selectVisitorsPagination = (state) => state.visitorAnalytics.visitorsPagination;
export const selectVisitorsStatus = (state) => state.visitorAnalytics.visitorsStatus;
export const selectVisitorsError = (state) => state.visitorAnalytics.visitorsError;

export const selectSelectedVisitor = (state) => state.visitorAnalytics.selectedVisitor;
export const selectSelectedVisitorStatus = (state) => state.visitorAnalytics.selectedVisitorStatus;
export const selectSelectedVisitorError = (state) => state.visitorAnalytics.selectedVisitorError;

export default visitorSlice.reducer;