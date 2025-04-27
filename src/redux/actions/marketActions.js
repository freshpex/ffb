export const FETCH_MARKET_DATA_REQUEST = "FETCH_MARKET_DATA_REQUEST";
export const FETCH_MARKET_DATA_SUCCESS = "FETCH_MARKET_DATA_SUCCESS";
export const FETCH_MARKET_DATA_FAILURE = "FETCH_MARKET_DATA_FAILURE";
export const SET_CURRENT_PAIR = "SET_CURRENT_PAIR";

// Action to set the current trading pair
export const setCurrentPair = (pair) => ({
  type: SET_CURRENT_PAIR,
  payload: pair,
});

// Action to fetch market data
export const fetchMarketData = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MARKET_DATA_REQUEST });

    try {
      // In a real application, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock market data
      const marketData = {
        pairs: [
          {
            symbol: "BTC/USDT",
            price: 60423.12,
            change: 2.35,
            volume: 983245678,
          },
          {
            symbol: "ETH/USDT",
            price: 3175.45,
            change: 1.87,
            volume: 463876543,
          },
          {
            symbol: "BNB/USDT",
            price: 413.67,
            change: -0.54,
            volume: 127895432,
          },
          { symbol: "SOL/USDT", price: 107.23, change: 3.12, volume: 89765432 },
          {
            symbol: "XRP/USDT",
            price: 0.5124,
            change: -1.23,
            volume: 65432178,
          },
          { symbol: "ADA/USDT", price: 0.4523, change: 0.78, volume: 43219876 },
          {
            symbol: "DOGE/USDT",
            price: 0.1432,
            change: 5.67,
            volume: 32187654,
          },
          { symbol: "DOT/USDT", price: 6.89, change: -2.34, volume: 28765432 },
        ],
        timestamp: Date.now(),
      };

      dispatch({
        type: FETCH_MARKET_DATA_SUCCESS,
        payload: marketData,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MARKET_DATA_FAILURE,
        payload: error.message || "Failed to fetch market data",
      });
    }
  };
};
