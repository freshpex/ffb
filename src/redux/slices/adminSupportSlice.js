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

// Fetch all support tickets
export const fetchSupportTickets = createAsyncThunk(
  'adminSupport/fetchSupportTickets',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status, priority, search } = params;

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(search && { search })
      });

      const token = localStorage.getItem('ffb_admin_token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${API_URL}/support?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch support tickets');
    }
  }
);

// Fetch support ticket by ID
export const fetchSupportTicketById = createAsyncThunk(
  'adminSupport/fetchSupportTicketById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${API_URL}/support/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch support ticket');
    }
  }
);

// Update support ticket
export const updateSupportTicket = createAsyncThunk(
  'adminSupport/updateSupportTicket',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${API_URL}/support/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update support ticket');
    }
  }
);

// Add a reply to a support ticket
export const addSupportTicketReply = createAsyncThunk(
  'adminSupport/addSupportTicketReply',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${API_URL}/support/${id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add reply to support ticket');
    }
  }
);

// Fetch support ticket statistics
export const fetchSupportTicketStats = createAsyncThunk(
  'adminSupport/fetchSupportTicketStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${API_URL}/support/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch support ticket statistics');
    }
  }
);

// Initial state
const initialState = {
  tickets: [],
  selectedTicket: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  stats: {
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    highPriorityTickets: 0
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: 'idle' // Status for CRUD operations
};

const adminSupportSlice = createSlice({
  name: 'adminSupport',
  initialState,
  reducers: {
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    clearSupportError: (state) => {
      state.error = null;
      state.actionStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch support tickets
      .addCase(fetchSupportTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch support ticket by ID
      .addCase(fetchSupportTicketById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupportTicketById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTicket = action.payload;
        state.error = null;
      })
      .addCase(fetchSupportTicketById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update support ticket
      .addCase(updateSupportTicket.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updateSupportTicket.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTicket = action.payload;

        // Update ticket in the list if it exists
        const index = state.tickets.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(updateSupportTicket.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      // Add reply to support ticket
      .addCase(addSupportTicketReply.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(addSupportTicketReply.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTicket = action.payload;

        // Update ticket in the list if it exists
        const index = state.tickets.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(addSupportTicketReply.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch support ticket stats
      .addCase(fetchSupportTicketStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupportTicketStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchSupportTicketStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearSelectedTicket, clearSupportError } = adminSupportSlice.actions;

// Export selectors
export const selectSupportTickets = (state) => state.adminSupport.tickets;
export const selectSelectedTicket = (state) => state.adminSupport.selectedTicket;
export const selectSupportPagination = (state) => state.adminSupport.pagination;
export const selectSupportStatus = (state) => state.adminSupport.stats;
export const selectSupportActionStatus = (state) => state.adminSupport.status;
export const selectSupportError = (state) => state.adminSupport.error;

export default adminSupportSlice.reducer;
