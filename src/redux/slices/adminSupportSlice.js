import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockSupportTickets } from '../../utils/mockDataGenerator';

// Generate 80 mock support tickets
const mockSupportTickets = generateMockSupportTickets(80);

// Fetch support tickets
export const fetchSupportTickets = createAsyncThunk(
  'adminSupport/fetchSupportTickets',
  async ({ page = 1, limit = 10, status = '', priority = '', search = '' }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter support tickets
      let filteredTickets = [...mockSupportTickets];
      
      if (status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
      }
      
      if (priority) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.subject.toLowerCase().includes(searchLower) ||
          ticket.user.email.toLowerCase().includes(searchLower) ||
          ticket.user.fullName.toLowerCase().includes(searchLower) ||
          ticket.id.includes(search)
        );
      }
      
      // Sort by date (newest first)
      filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Calculate pagination
      const totalTickets = filteredTickets.length;
      const totalPages = Math.ceil(totalTickets / limit);
      const startIndex = (page - 1) * limit;
      const paginatedTickets = filteredTickets.slice(startIndex, startIndex + limit);
      
      return {
        supportTickets: paginatedTickets,
        pagination: {
          page,
          limit,
          totalTickets,
          totalPages
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch support tickets');
    }
  }
);

// Fetch support ticket by ID
export const fetchTicketById = createAsyncThunk(
  'adminSupport/fetchTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const ticket = mockSupportTickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        return rejectWithValue('Support ticket not found');
      }
      
      return ticket;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch support ticket');
    }
  }
);

// Reply to support ticket
export const addTicketReply = createAsyncThunk(
  'adminSupport/addTicketReply',
  async ({ ticketId, content, attachments }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ticketIndex = mockSupportTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return rejectWithValue('Support ticket not found');
      }
      
      // Create new reply
      const newReply = {
        id: `reply-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        sender: {
          id: 'admin-1',
          name: 'Admin User',
          role: 'admin'
        },
        attachments: attachments || []
      };
      
      // Update ticket with the new reply
      const updatedTicket = {
        ...mockSupportTickets[ticketIndex],
        updatedAt: new Date().toISOString(),
        status: 'responded',
        replies: [...(mockSupportTickets[ticketIndex].replies || []), newReply],
        lastActivity: new Date().toISOString()
      };
      
      // Update mock data
      mockSupportTickets[ticketIndex] = updatedTicket;
      
      return updatedTicket;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reply to support ticket');
    }
  }
);

// Change support ticket status
export const updateTicketStatus = createAsyncThunk(
  'adminSupport/updateTicketStatus',
  async ({ ticketId, status, note }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ticketIndex = mockSupportTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return rejectWithValue('Support ticket not found');
      }
      
      if (!['open', 'in_progress', 'responded', 'resolved', 'closed'].includes(status)) {
        return rejectWithValue('Invalid status');
      }
      
      // Create status update history entry
      const statusUpdate = {
        from: mockSupportTickets[ticketIndex].status,
        to: status,
        updatedAt: new Date().toISOString(),
        updatedBy: {
          id: 'admin-1',
          name: 'Admin User',
          role: 'admin'
        },
        note: note || ''
      };
      
      // Update ticket status
      const updatedTicket = {
        ...mockSupportTickets[ticketIndex],
        status,
        updatedAt: new Date().toISOString(),
        statusHistory: [...(mockSupportTickets[ticketIndex].statusHistory || []), statusUpdate],
        lastActivity: new Date().toISOString()
      };
      
      // Update mock data
      mockSupportTickets[ticketIndex] = updatedTicket;
      
      return updatedTicket;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change support ticket status');
    }
  }
);

// Change support ticket priority
export const changeSupportTicketPriority = createAsyncThunk(
  'adminSupport/changeSupportTicketPriority',
  async ({ ticketId, priority }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ticketIndex = mockSupportTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return rejectWithValue('Support ticket not found');
      }
      
      if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return rejectWithValue('Invalid priority');
      }
      
      // Update ticket priority
      const updatedTicket = {
        ...mockSupportTickets[ticketIndex],
        priority,
        updatedAt: new Date().toISOString(),
      };
      
      // Update mock data
      mockSupportTickets[ticketIndex] = updatedTicket;
      
      return updatedTicket;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change support ticket priority');
    }
  }
);

// Create initial state
const initialState = {
  supportTickets: [],
  selectedTicket: null,
  pagination: {
    page: 1,
    limit: 10,
    totalTickets: 0,
    totalPages: 0
  },
  status: 'idle',
  error: null,
  actionStatus: 'idle'
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
    },
    resetSupportActionStatus: (state) => {
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
        state.supportTickets = action.payload.supportTickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch support ticket by ID
      .addCase(fetchTicketById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Reply to support ticket
      .addCase(addTicketReply.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTicket = action.payload;
        
        // Update ticket in the list if it exists
        const index = state.supportTickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.supportTickets[index] = action.payload;
        }
      })
      .addCase(addTicketReply.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Change support ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTicket = action.payload;
        
        // Update ticket in the list if it exists
        const index = state.supportTickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.supportTickets[index] = action.payload;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      })
      
      // Change support ticket priority
      .addCase(changeSupportTicketPriority.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(changeSupportTicketPriority.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedTicket = action.payload;
        
        // Update ticket in the list if it exists
        const index = state.supportTickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.supportTickets[index] = action.payload;
        }
      })
      .addCase(changeSupportTicketPriority.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearSelectedTicket, 
  clearSupportError, 
  resetSupportActionStatus 
} = adminSupportSlice.actions;

// Export selectors
export const selectSupportTickets = state => state.adminSupport.supportTickets;
export const selectSelectedTicket = state => state.adminSupport.selectedTicket;
export const selectSupportPagination = state => state.adminSupport.pagination;
export const selectSupportStatus = state => state.adminSupport.status;
export const selectSupportError = state => state.adminSupport.error;
export const selectSupportActionStatus = state => state.adminSupport.actionStatus;

export default adminSupportSlice.reducer;
