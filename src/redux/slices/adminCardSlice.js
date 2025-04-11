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

export const fetchAdminCards = createAsyncThunk(
  'adminCards/fetchAdminCards',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/admin/atm-cards/all', { params });
      console.log("response Data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin cards');
    }
  }
);

export const approveCardRequest = createAsyncThunk(
  'adminCards/approveCardRequest',
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
  'adminCards/rejectCardRequest',
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
const adminCardSlice = createSlice({
  name: 'adminCards',
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
        if (action.payload.data) {  
          state.adminCards = action.payload.data.cards;
          state.adminPagination = action.payload.data.pagination;
          console.log("Cards stored in Redux:", state.adminCards.length, state.adminCards);
        } else {;
          state.adminPagination = null;
          console.warn("Invalid response format or no cards in response");
        }
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
        const index = state.adminCards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.adminCards[index] = action.payload.data;
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
        const index = state.adminCards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.adminCards[index] = action.payload.data;
        }
      })
      .addCase(rejectCardRequest.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload;
      });
  }
});

// Selectors
export const selectAdminCards = (state) => {
  if (!state || !state.adminCards) return [];
  return state.adminCards.adminCards || [];
};

export const selectAdminCardRequests = (state) => {
  if (!state || !state.adminCards) return [];
  const cards = state.adminCards.adminCards || [];
  return cards.filter(card => card && card.status === 'pending');
};

export const selectAdminCardsStatus = (state) => {
  if (!state || !state.adminCards) return 'idle';
  return state.adminCards.adminStatus;
};

export const selectAdminCardsError = (state) => {
  if (!state || !state.adminCards) return null;
  return state.adminCards.adminError;
};

export const selectAdminCardsPagination = (state) => {
  if (!state || !state.adminCards) return null;
  return state.adminCards.adminPagination;
};

export default adminCardSlice.reducer;
