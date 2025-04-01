import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockKycRequests } from '../../utils/mockDataGenerator';

// Generate 75 mock KYC requests
const mockKycRequests = generateMockKycRequests(75);

// Fetch KYC requests
export const fetchKycRequests = createAsyncThunk(
  'adminKyc/fetchKycRequests',
  async ({ page = 1, limit = 10, status = '', search = '' }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter KYC requests
      let filteredRequests = [...mockKycRequests];
      
      if (status) {
        filteredRequests = filteredRequests.filter(req => req.status === status);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredRequests = filteredRequests.filter(req => 
          req.user.email.toLowerCase().includes(searchLower) ||
          req.user.fullName.toLowerCase().includes(searchLower) ||
          req.id.includes(search)
        );
      }
      
      // Sort by date (newest first)
      filteredRequests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      
      // Calculate pagination
      const totalRequests = filteredRequests.length;
      const totalPages = Math.ceil(totalRequests / limit);
      const startIndex = (page - 1) * limit;
      const paginatedRequests = filteredRequests.slice(startIndex, startIndex + limit);
      
      return {
        kycRequests: paginatedRequests,
        pagination: {
          page,
          limit,
          totalRequests,
          totalPages
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch KYC requests');
    }
  }
);

// Fetch KYC request by ID
export const fetchKycRequestById = createAsyncThunk(
  'adminKyc/fetchKycRequestById',
  async (requestId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const kycRequest = mockKycRequests.find(req => req.id === requestId);
      
      if (!kycRequest) {
        return rejectWithValue('KYC request not found');
      }
      
      return kycRequest;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch KYC request');
    }
  }
);

// Approve KYC request
export const approveKycRequest = createAsyncThunk(
  'adminKyc/approveKycRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const requestIndex = mockKycRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return rejectWithValue('KYC request not found');
      }
      
      if (mockKycRequests[requestIndex].status !== 'pending') {
        return rejectWithValue('Only pending KYC requests can be approved');
      }
      
      // Update KYC request status
      const updatedRequest = {
        ...mockKycRequests[requestIndex],
        status: 'approved',
        updatedAt: new Date().toISOString(),
        approvedBy: 'admin-1',
        approvedAt: new Date().toISOString()
      };
      
      // Update mock data
      mockKycRequests[requestIndex] = updatedRequest;
      
      return updatedRequest;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve KYC request');
    }
  }
);

// Reject KYC request
export const rejectKycRequest = createAsyncThunk(
  'adminKyc/rejectKycRequest',
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const requestIndex = mockKycRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return rejectWithValue('KYC request not found');
      }
      
      if (mockKycRequests[requestIndex].status !== 'pending') {
        return rejectWithValue('Only pending KYC requests can be rejected');
      }
      
      // Update KYC request status
      const updatedRequest = {
        ...mockKycRequests[requestIndex],
        status: 'rejected',
        updatedAt: new Date().toISOString(),
        rejectedBy: 'admin-1',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Rejected by administrator'
      };
      
      // Update mock data
      mockKycRequests[requestIndex] = updatedRequest;
      
      return updatedRequest;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject KYC request');
    }
  }
);

// Create initial state
const initialState = {
  kycRequests: [],
  selectedKycRequest: null,
  pagination: {
    page: 1,
    limit: 10,
    totalRequests: 0,
    totalPages: 0
  },
  status: 'idle',
  error: null,
  actionStatus: 'idle'
};

const adminKycSlice = createSlice({
  name: 'adminKyc',
  initialState,
  reducers: {
    clearSelectedKycRequest: (state) => {
      state.selectedKycRequest = null;
    },
    clearKycError: (state) => {
      state.error = null;
    },
    resetKycActionStatus: (state) => {
      state.actionStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch KYC requests
      .addCase(fetchKycRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKycRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.kycRequests = action.payload.kycRequests;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchKycRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch KYC request by ID
      .addCase(fetchKycRequestById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchKycRequestById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedKycRequest = action.payload;
      })
      .addCase(fetchKycRequestById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Approve KYC request
      .addCase(approveKycRequest.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(approveKycRequest.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedKycRequest = action.payload;
        
        // Update KYC request in the list if it exists
        const index = state.kycRequests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.kycRequests[index] = action.payload;
        }
      })
      .addCase(approveKycRequest.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Reject KYC request
      .addCase(rejectKycRequest.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(rejectKycRequest.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedKycRequest = action.payload;
        
        // Update KYC request in the list if it exists
        const index = state.kycRequests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.kycRequests[index] = action.payload;
        }
      })
      .addCase(rejectKycRequest.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearSelectedKycRequest, 
  clearKycError, 
  resetKycActionStatus 
} = adminKycSlice.actions;

// Export selectors
export const selectKycRequests = state => state.adminKyc.kycRequests;
export const selectSelectedKycRequest = state => state.adminKyc.selectedKycRequest;
export const selectKycPagination = state => state.adminKyc.pagination;
export const selectKycStatus = state => state.adminKyc.status;
export const selectKycError = state => state.adminKyc.error;
export const selectKycActionStatus = state => state.adminKyc.actionStatus;

export default adminKycSlice.reducer;
