import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

// Initial state
const initialState = {
  cards: [],
  cardRequests: [],
  adminCards: [],
  cardTypes: [
    {
      id: 'virtual-debit',
      name: 'Virtual Debit Card',
      description: 'Instantly issued digital card for online purchases',
      fee: 0,
      monthlyFee: 0,
      processingTime: 'Instant',
      features: [
        'Online purchases',
        'Digital wallets',
        'No physical card'
      ]
    },
    {
      id: 'standard-debit',
      name: 'Standard Debit Card',
      description: 'Physical card for in-store and online purchases',
      fee: 10,
      monthlyFee: 2,
      processingTime: '7-10 business days',
      features: [
        'Physical plastic card',
        'In-store purchases',
        'Online purchases',
        'ATM withdrawals'
      ]
    },
    {
      id: 'premium-debit',
      name: 'Premium Debit Card',
      description: 'Premium metal card with enhanced benefits',
      fee: 50,
      monthlyFee: 5,
      processingTime: '3-5 business days',
      features: [
        'Premium metal design',
        'Priority shipping',
        'Higher limits',
        'Travel insurance',
        'Concierge service'
      ]
    }
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  adminStatus: 'idle',
  error: null,
  adminError: null,
  pagination: null,
  adminPagination: null
};

// Async thunks
export const fetchCards = createAsyncThunk(
  'atmCards/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/atm-cards');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cards');
    }
  }
);


export const fetchAdminCards = createAsyncThunk(
  'atmCards/fetchAdminCards',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/atm-cards', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin cards');
    }
  }
);

export const approveCardRequest = createAsyncThunk(
  'atmCards/approveCardRequest',
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/admin/atm-cards/${cardId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve card request');
    }
  }
);

export const rejectCardRequest = createAsyncThunk(
  'atmCards/rejectCardRequest',
  async ({ cardId, reason }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/admin/atm-cards/${cardId}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject card request');
    }
  }
);

// Card slice
const atmCardsSlice = createSlice({
  name: 'atmCards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder   
      // Fetch admin cards
      .addCase(fetchAdminCards.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(fetchAdminCards.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.adminCards = action.payload.cards;
        state.adminPagination = action.payload.pagination;
      })
      .addCase(fetchAdminCards.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload;
      })
      
      // Approve card request
      .addCase(approveCardRequest.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(approveCardRequest.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        const index = state.adminCards.findIndex(card => card._id === action.payload._id);
        if (index !== -1) {
          state.adminCards[index] = action.payload;
        }
      })
      .addCase(approveCardRequest.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload;
      })
      
      // Reject card request
      .addCase(rejectCardRequest.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(rejectCardRequest.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        const index = state.adminCards.findIndex(card => card._id === action.payload._id);
        if (index !== -1) {
          state.adminCards[index] = action.payload;
        }
      })
      .addCase(rejectCardRequest.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload;
      });
  }
});

// Selectors
export const selectAdminCards = (state) => state.atmCards.adminCards;
export const selectAdminCardRequests = (state) => state.atmCards.adminCards.filter(card => card.status === 'pending');
export const selectAdminCardsStatus = (state) => state.atmCards.adminStatus;
export const selectAdminCardsError = (state) => state.atmCards.adminError;
export const selectAdminCardsPagination = (state) => state.atmCards.adminPagination;

export default atmCardsSlice.reducer;
