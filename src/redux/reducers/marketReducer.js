import {
  FETCH_MARKET_DATA_REQUEST,
  FETCH_MARKET_DATA_SUCCESS,
  FETCH_MARKET_DATA_FAILURE,
  SET_CURRENT_PAIR
} from '../actions/marketActions';

const initialState = {
  marketData: [],
  currentPair: 'BTC/USDT',
  isLoading: false,
  error: null,
  lastUpdated: null
};

const marketReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case FETCH_MARKET_DATA_SUCCESS:
      return {
        ...state,
        marketData: action.payload.pairs,
        isLoading: false,
        lastUpdated: action.payload.timestamp
      };
      
    case FETCH_MARKET_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
      
    case SET_CURRENT_PAIR:
      return {
        ...state,
        currentPair: action.payload
      };
      
    default:
      return state;
  }
};

export default marketReducer;
