import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Initial state
const initialState = {
  cards: [],
  cardRequests: [],
  cardTransactions: {},
  cardTypes: [
    { 
      id: 'virtual-debit', 
      name: 'Virtual Debit Card', 
      annual_fee: 5, 
      fee: 5,
      monthlyFee: 0,
      processingTime: 'Instant',
      description: 'Instant virtual card for online purchases',
      benefits: ['Instant issuance', 'Online purchases', 'Low fees'] 
    },
    { 
      id: 'standard-debit', 
      name: 'Standard Debit Card', 
      annual_fee: 15, 
      fee: 15,
      monthlyFee: 1.99,
      processingTime: '3-5 business days',
      description: 'Physical card with ATM access',
      benefits: ['Physical card', 'ATM withdrawals', 'In-store purchases'] 
    },
    { 
      id: 'premium-debit', 
      name: 'Premium Debit Card', 
      annual_fee: 30, 
      fee: 30,
      monthlyFee: 3.99,
      processingTime: '1-3 business days',
      description: 'Premium card with enhanced benefits',
      benefits: ['Priority support', 'Higher spending limits', 'Extended benefits'] 
    }
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  transactionStatus: 'idle',
  transactionError: null
};

// Async thunks
export const fetchCards = createAsyncThunk(
  'atmCards/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/atm-cards');
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
      const payload = {
        type: cardData.type,
        name: cardData.name,
        currency: cardData.currency,
        shippingAddress: cardData.shippingAddress
      };
      
      const response = await apiClient.post('/atm-cards/request', payload);
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
      const response = await apiClient.post(`/atm-cards/${cardId}/freeze`);
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
      const response = await apiClient.post(`/atm-cards/${cardId}/unfreeze`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfreeze card');
    }
  }
);

export const cancelCardRequest = createAsyncThunk(
  'atmCards/cancelCardRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/atm-cards/${requestId}/cancel`);
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
      const response = await apiClient.put(`/atm-cards/${cardId}/limits`, limits);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update card limits');
    }
  }
);

export const fetchCardTransactions = createAsyncThunk(
  'atmCards/fetchCardTransactions',
  async ({ cardId, page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await apiClient.get(`/atm-cards/${cardId}/transactions?${queryParams}`);
      return { cardId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch card transactions');
    }
  }
);

// New transaction thunk
export const createCardTransaction = createAsyncThunk(
  'atmCards/createCardTransaction',
  async ({ cardId, transaction }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/atm-cards/${cardId}/transactions`, transaction);
      return { cardId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

// Fund card from user balance
export const fundCardFromBalance = createAsyncThunk(
  'atmCards/fundCardFromBalance',
  async ({ cardId, amount }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/atm-cards/${cardId}/fund`, { amount });
      return { cardId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fund card');
    }
  }
);

// Create the slice
const atmCardsSlice = createSlice({
  name: 'atmCards',
  initialState,
  reducers: {
    clearTransactionStatus: (state) => {
      state.transactionStatus = 'idle';
      state.transactionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCards
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.data) {
          const allCards = action.payload.data || [];
          state.cards = allCards.filter(card => card.status === 'active');
          state.cardRequests = allCards.filter(card => ['pending', 'rejected'].includes(card.status));
        } else {
          state.cards = [];
          state.cardRequests = [];
        }
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
        const index = state.cards.findIndex(card => card._id === action.payload.data._id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], frozen: true };
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
        const index = state.cards.findIndex(card => card._id === action.payload.data._id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], frozen: false };
        }
      })
      .addCase(unfreezeCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle cancelCardRequest
      .addCase(cancelCardRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelCardRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cardRequests.findIndex(request => request._id === action.payload.data._id);
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
        const index = state.cards.findIndex(card => card._id === action.payload.data._id);
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
      })
      
      // Handle createCardTransaction
      .addCase(createCardTransaction.pending, (state) => {
        state.transactionStatus = 'loading';
      })
      .addCase(createCardTransaction.fulfilled, (state, action) => {
        state.transactionStatus = 'succeeded';
        
        // Update card balance
        const cardId = action.payload.cardId;
        const transaction = action.payload.data.transaction;
        const cardIndex = state.cards.findIndex(card => card._id === cardId || card.id === cardId);
        
        if (cardIndex !== -1) {
          // Deduct the transaction amount from card balance
          // Only for purchase or withdrawal transactions
          if (['purchase', 'withdrawal'].includes(transaction.type)) {
            state.cards[cardIndex].balance -= transaction.amount;
          }
        }
        
        // Add transaction to the transactions list if it exists for this card
        if (state.cardTransactions[cardId]?.data) {
          state.cardTransactions[cardId].data.unshift(transaction);
          
          // Update pagination if it exists
          if (state.cardTransactions[cardId].pagination) {
            state.cardTransactions[cardId].pagination.total += 1;
          }
        }
        
        state.transactionError = null;
      })
      .addCase(createCardTransaction.rejected, (state, action) => {
        state.transactionStatus = 'failed';
        state.transactionError = action.payload;
      })
      
      // Handle fundCardFromBalance
      .addCase(fundCardFromBalance.pending, (state) => {
        state.transactionStatus = 'loading';
      })
      .addCase(fundCardFromBalance.fulfilled, (state, action) => {
        state.transactionStatus = 'succeeded';
        
        // Update card balance
        const cardId = action.payload.cardId;
        const { card, transaction } = action.payload.data.data;
        const cardIndex = state.cards.findIndex(c => c._id === cardId || c.id === cardId);
        
        if (cardIndex !== -1) {
          // Update card balance with the new balance from the API response
          state.cards[cardIndex].balance = card.balance;
        }
        
        // Add transaction to the transactions list if it exists for this card
        if (state.cardTransactions[cardId]?.data) {
          state.cardTransactions[cardId].data.unshift(transaction);
          
          // Update pagination if it exists
          if (state.cardTransactions[cardId].pagination) {
            state.cardTransactions[cardId].pagination.total += 1;
          }
        }
        
        state.transactionError = null;
      })
      .addCase(fundCardFromBalance.rejected, (state, action) => {
        state.transactionStatus = 'failed';
        state.transactionError = action.payload;
      });
  }
});

// Export actions
export const { clearTransactionStatus } = atmCardsSlice.actions;

// Selectors
export const selectCards = state => state.atmCards.cards;
export const selectCardRequests = state => state.atmCards.cardRequests;
export const selectCardTypes = state => state.atmCards.cardTypes;
export const selectATMCardsStatus = state => state.atmCards.status;
export const selectATMCardsError = state => state.atmCards.error;
export const selectCardById = (state, cardId) => 
  state.atmCards.cards.find(card => card.id === cardId || card._id === cardId);
export const selectCardTransactions = (state, cardId) => 
  state.atmCards.cardTransactions[cardId] || { data: [], pagination: { total: 0 } };
export const selectCardsStatus = (state) => state.atmCards.status;
export const selectCardsError = (state) => state.atmCards.error;
export const selectTransactionStatus = (state) => state.atmCards.transactionStatus;
export const selectTransactionError = (state) => state.atmCards.transactionError;

export default atmCardsSlice.reducer;
