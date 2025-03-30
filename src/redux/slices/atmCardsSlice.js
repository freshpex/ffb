import { createSlice } from '@reduxjs/toolkit';

// Mock ATM Card Types
const cardTypes = [
  {
    id: 'virtual-debit',
    name: 'Virtual Debit Card',
    description: 'A virtual card for online payments with no physical card issued.',
    fee: 0,
    monthlyFee: 0,
    features: [
      'Instant issuance',
      'Online payments',
      'No physical card',
      'No ATM withdrawals',
      'Free to maintain'
    ],
    limits: {
      daily: 2000,
      monthly: 10000
    },
    processingTime: 'Instant',
    currencies: ['USD', 'EUR', 'GBP'],
    image: '/cards/virtual-card.png'
  },
  {
    id: 'standard-debit',
    name: 'Standard Debit Card',
    description: 'A physical card for everyday use with standard benefits.',
    fee: 15,
    monthlyFee: 1,
    features: [
      'Physical card issued',
      'Worldwide ATM withdrawals',
      'Online & in-store payments',
      'Contactless payments',
      '24/7 customer support'
    ],
    limits: {
      daily: 5000,
      monthly: 20000
    },
    processingTime: '7-10 business days',
    currencies: ['USD', 'EUR', 'GBP'],
    image: '/cards/standard-card.png'
  },
  {
    id: 'premium-debit',
    name: 'Premium Debit Card',
    description: 'A premium card with higher limits and exclusive benefits.',
    fee: 50,
    monthlyFee: 5,
    features: [
      'Premium metal card design',
      'Higher transaction limits',
      'Priority customer support',
      'Travel insurance included',
      'Extended warranty on purchases',
      'Airport lounge access'
    ],
    limits: {
      daily: 10000,
      monthly: 50000
    },
    processingTime: '5-7 business days',
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'],
    image: '/cards/premium-card.png'
  }
];

// Initial state
const initialState = {
  // User's cards
  cards: [
    {
      id: 'card_1',
      type: 'standard-debit',
      currency: 'USD',
      name: 'John Doe',
      cardNumber: '4111 **** **** 1234',
      expiryDate: '09/25',
      status: 'active',
      balance: 2500.75,
      createdAt: '2023-05-15T10:30:00Z',
      issuedAt: '2023-05-22T14:00:00Z',
      limits: {
        daily: 5000,
        monthly: 20000,
        dailyUsed: 750,
        monthlyUsed: 3500
      },
      frozen: false
    }
  ],
  
  // Card requests
  requests: [
    {
      id: 'req_1',
      type: 'premium-debit',
      currency: 'EUR',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'London',
        postalCode: 'EC1A 1BB',
        country: 'United Kingdom'
      },
      status: 'pending',
      submittedAt: '2023-11-01T09:15:00Z',
      notes: 'Priority delivery requested'
    }
  ],
  
  // Card transactions
  transactions: [
    {
      id: 'trx_1',
      cardId: 'card_1',
      merchantName: 'Amazon.com',
      amount: 79.99,
      currency: 'USD',
      date: '2023-11-20T15:45:00Z',
      type: 'purchase',
      status: 'completed',
      category: 'shopping'
    },
    {
      id: 'trx_2',
      cardId: 'card_1',
      merchantName: 'Starbucks',
      amount: 4.50,
      currency: 'USD',
      date: '2023-11-19T08:30:00Z',
      type: 'purchase',
      status: 'completed',
      category: 'food'
    },
    {
      id: 'trx_3',
      cardId: 'card_1',
      merchantName: 'ATM Withdrawal',
      amount: 200,
      currency: 'USD',
      date: '2023-11-15T12:15:00Z',
      type: 'withdrawal',
      status: 'completed',
      category: 'atm'
    },
    {
      id: 'trx_4',
      cardId: 'card_1',
      merchantName: 'Uber',
      amount: 18.75,
      currency: 'USD',
      date: '2023-11-14T19:30:00Z',
      type: 'purchase',
      status: 'completed',
      category: 'transport'
    }
  ],
  
  // Available card types
  availableCardTypes: cardTypes,
  
  // Request status
  status: 'idle',
  error: null
};

const atmCardsSlice = createSlice({
  name: 'atmCards',
  initialState,
  reducers: {
    // Fetch user's cards
    fetchCardsStart(state) {
      state.status = 'loading';
    },
    fetchCardsSuccess(state, action) {
      state.status = 'succeeded';
      state.cards = action.payload.cards;
      state.requests = action.payload.requests;
    },
    fetchCardsFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    // Fetch card transactions
    fetchTransactionsStart(state) {
      state.status = 'loading';
    },
    fetchTransactionsSuccess(state, action) {
      state.status = 'succeeded';
      state.transactions = action.payload;
    },
    fetchTransactionsFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    // Request new card
    requestCardStart(state) {
      state.status = 'loading';
    },
    requestCardSuccess(state, action) {
      state.status = 'succeeded';
      state.requests.push(action.payload);
    },
    requestCardFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    // Card actions
    freezeCardStart(state, action) {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = 'freezing';
      }
    },
    freezeCardSuccess(state, action) {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.frozen = true;
        card.processingStatus = undefined;
      }
    },
    freezeCardFailure(state, action) {
      const { cardId, error } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = undefined;
      }
      state.error = error;
    },
    
    unfreezeCardStart(state, action) {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = 'unfreezing';
      }
    },
    unfreezeCardSuccess(state, action) {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.frozen = false;
        card.processingStatus = undefined;
      }
    },
    unfreezeCardFailure(state, action) {
      const { cardId, error } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = undefined;
      }
      state.error = error;
    },
    
    cancelCardStart(state, action) {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = 'canceling';
      }
    },
    cancelCardSuccess(state, action) {
      const cardId = action.payload;
      state.cards = state.cards.filter(c => c.id !== cardId);
    },
    cancelCardFailure(state, action) {
      const { cardId, error } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = undefined;
      }
      state.error = error;
    },
    
    // Update card limits
    updateCardLimitsStart(state, action) {
      const { cardId } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = 'updating';
      }
    },
    updateCardLimitsSuccess(state, action) {
      const { cardId, limits } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.limits = {
          ...card.limits,
          ...limits
        };
        card.processingStatus = undefined;
      }
    },
    updateCardLimitsFailure(state, action) {
      const { cardId, error } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.processingStatus = undefined;
      }
      state.error = error;
    },
    
    // Cancel a card request
    cancelCardRequestStart(state, action) {
      const requestId = action.payload;
      const request = state.requests.find(r => r.id === requestId);
      if (request) {
        request.processingStatus = 'canceling';
      }
    },
    cancelCardRequestSuccess(state, action) {
      const requestId = action.payload;
      state.requests = state.requests.filter(r => r.id !== requestId);
    },
    cancelCardRequestFailure(state, action) {
      const { requestId, error } = action.payload;
      const request = state.requests.find(r => r.id === requestId);
      if (request) {
        request.processingStatus = undefined;
      }
      state.error = error;
    },
    
    // Reset state
    resetATMCardsState: () => initialState
  }
});

export const {
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  requestCardStart,
  requestCardSuccess,
  requestCardFailure,
  freezeCardStart,
  freezeCardSuccess,
  freezeCardFailure,
  unfreezeCardStart,
  unfreezeCardSuccess,
  unfreezeCardFailure,
  cancelCardStart,
  cancelCardSuccess,
  cancelCardFailure,
  updateCardLimitsStart,
  updateCardLimitsSuccess,
  updateCardLimitsFailure,
  cancelCardRequestStart,
  cancelCardRequestSuccess,
  cancelCardRequestFailure,
  resetATMCardsState
} = atmCardsSlice.actions;

// Thunks
export const fetchCards = () => async (dispatch) => {
  try {
    dispatch(fetchCardsStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchCardsSuccess({
      cards: initialState.cards,
      requests: initialState.requests
    }));
  } catch (error) {
    dispatch(fetchCardsFailure(error.message || 'Failed to fetch cards'));
  }
};

export const fetchCardTransactions = (cardId) => async (dispatch) => {
  try {
    dispatch(fetchTransactionsStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const transactions = cardId
      ? initialState.transactions.filter(tx => tx.cardId === cardId)
      : initialState.transactions;
    
    dispatch(fetchTransactionsSuccess(transactions));
  } catch (error) {
    dispatch(fetchTransactionsFailure(error.message || 'Failed to fetch transactions'));
  }
};

export const requestCard = (cardData) => async (dispatch) => {
  try {
    dispatch(requestCardStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRequest = {
      id: `req_${Date.now()}`,
      ...cardData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    dispatch(requestCardSuccess(newRequest));
    return newRequest;
  } catch (error) {
    dispatch(requestCardFailure(error.message || 'Failed to request card'));
    throw error;
  }
};

export const freezeCard = (cardId) => async (dispatch) => {
  try {
    dispatch(freezeCardStart(cardId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(freezeCardSuccess(cardId));
  } catch (error) {
    dispatch(freezeCardFailure({
      cardId,
      error: error.message || 'Failed to freeze card'
    }));
  }
};

export const unfreezeCard = (cardId) => async (dispatch) => {
  try {
    dispatch(unfreezeCardStart(cardId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(unfreezeCardSuccess(cardId));
  } catch (error) {
    dispatch(unfreezeCardFailure({
      cardId,
      error: error.message || 'Failed to unfreeze card'
    }));
  }
};

export const cancelCard = (cardId) => async (dispatch) => {
  try {
    dispatch(cancelCardStart(cardId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(cancelCardSuccess(cardId));
  } catch (error) {
    dispatch(cancelCardFailure({
      cardId,
      error: error.message || 'Failed to cancel card'
    }));
  }
};

export const updateCardLimits = (cardId, limits) => async (dispatch) => {
  try {
    dispatch(updateCardLimitsStart({ cardId }));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch(updateCardLimitsSuccess({ cardId, limits }));
  } catch (error) {
    dispatch(updateCardLimitsFailure({
      cardId,
      error: error.message || 'Failed to update card limits'
    }));
  }
};

export const cancelCardRequest = (requestId) => async (dispatch) => {
  try {
    dispatch(cancelCardRequestStart(requestId));
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch(cancelCardRequestSuccess(requestId));
  } catch (error) {
    dispatch(cancelCardRequestFailure({
      requestId,
      error: error.message || 'Failed to cancel card request'
    }));
  }
};

// Selectors
export const selectCards = (state) => state.atmCards?.cards || [];
export const selectCardById = (state, cardId) => 
  state.atmCards?.cards.find(card => card.id === cardId);

export const selectCardRequests = (state) => state.atmCards?.requests || [];
export const selectCardTransactions = (state) => state.atmCards?.transactions || [];
export const selectCardTypes = (state) => state.atmCards?.availableCardTypes || [];
export const selectATMCardsStatus = (state) => state.atmCards?.status || 'idle';
export const selectATMCardsError = (state) => state.atmCards?.error || null;

export default atmCardsSlice.reducer;
