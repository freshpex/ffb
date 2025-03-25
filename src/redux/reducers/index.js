import { combineReducers } from 'redux';
import marketReducer from './marketReducer';
import authReducer from './authReducer'; // Will create a placeholder

// Combine all reducers
const rootReducer = combineReducers({
  market: marketReducer,
  auth: authReducer
});

export default rootReducer;
