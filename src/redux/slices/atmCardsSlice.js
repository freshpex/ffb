import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Initial state
const initialState = {
  cards: [],
  cardRequests: [],
  cardTransactions: {},
  cardTypes: [
    { id: 'visa_classic', name: 'Visa Classic', annual_fee: 25, benefits: ['No foreign transaction fees', 'Worldwide acceptance'] },
    { id: 'visa_gold', name: 'Visa Gold', annual_fee: 75, benefits: ['Travel insurance', 'Extended warranty', 'Concierge service'] },
    { id: 'visa_platinum', name: 'Visa Platinum', annual_fee: 150, benefits: ['Premium travel insurance', 'Airport lounge access', 'Exclusive discounts'] }
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Async thunks
export const fetchCards = createAsyncThunk(
  'atmCards/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/atm-cards');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cards');
    }
  }
);

export const requestCard = createAsyncThunk(
  'atmCards/requestCard',
  async (cardData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/atm-cards/request', cardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request card');
    }
  }
);

export const freezeCard = createAsyncThunk(
  'atmCards/freezeCard',
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/atm-cards/${cardId}/freeze`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to freeze card');
    }
  }
);

export const unfreezeCard = createAsyncThunk(
  'atmCards/unfreezeCard',
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/atm-cards/${cardId}/unfreeze`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfreeze card');
    }
  }
);

export const cancelCard = createAsyncThunk(
  'atmCards/cancelCard',
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/atm-cards/${cardId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel card');
    }
  }
);

export const cancelCardRequest = createAsyncThunk(
  'atmCards/cancelCardRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/atm-cards/request/${requestId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel card request');
    }
  }
);

export const updateCardLimits = createAsyncThunk(
  'atmCards/updateCardLimits',
  async ({ cardId, limits }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/atm-cards/${cardId}/limits`, { limits });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update card limits');
    }
  }
);

export const fetchCardTransactions = createAsyncThunk(
  'atmCards/fetchCardTransactions',
  async ({ cardId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/atm-cards/${cardId}/transactions?page=${page}&limit=${limit}`);
      return { cardId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch card transactions');
    }
  }
);

// Create the slice
const atmCardsSlice = createSlice({
  name: 'atmCards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchCards
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cards = action.payload.cards || [];
        state.cardRequests = action.payload.cardRequests || [];
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle requestCard
      .addCase(requestCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cardRequests.push(action.payload.data);
      })
      .addCase(requestCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle freezeCard
      .addCase(freezeCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(freezeCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], status: 'frozen' };
        }
      })
      .addCase(freezeCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle unfreezeCard
      .addCase(unfreezeCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unfreezeCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], status: 'active' };
        }
      })
      .addCase(unfreezeCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle cancelCard
      .addCase(cancelCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], status: 'cancelled' };
        }
      })
      .addCase(cancelCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle cancelCardRequest
      .addCase(cancelCardRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelCardRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cardRequests.findIndex(request => request.id === action.payload.data.id);
        if (index !== -1) {
          state.cardRequests[index] = { ...state.cardRequests[index], status: 'cancelled' };
        }
      })
      .addCase(cancelCardRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle updateCardLimits
      .addCase(updateCardLimits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCardLimits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cards.findIndex(card => card.id === action.payload.data.id);
        if (index !== -1) {
          state.cards[index] = { 
            ...state.cards[index], 
            limits: action.payload.data.limits 
          };
        }
      })
      .addCase(updateCardLimits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle fetchCardTransactions
      .addCase(fetchCardTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCardTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cardTransactions[action.payload.cardId] = action.payload.data;
      })
      .addCase(fetchCardTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectCards = state => state.atmCards.cards;
export const selectCardRequests = state => state.atmCards.cardRequests;
export const selectCardTypes = state => state.atmCards.cardTypes;
export const selectATMCardsStatus = state => state.atmCards.status;
export const selectATMCardsError = state => state.atmCards.error;
export const selectCardById = (state, cardId) => 
  state.atmCards.cards.find(card => card.id === cardId);
export const selectCardTransactions = (state, cardId) => 
  state.atmCards.cardTransactions[cardId] || { data: [], pagination: { total: 0 } };

export default atmCardsSlice.reducer;
