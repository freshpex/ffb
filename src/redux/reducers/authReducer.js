// Auth action types would be defined here
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

const initialState = {
  isAuthenticated: false,
  userData: {
    id: "",
    username: "",
    email: "",
    balance: 0,
  },
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userData: action.payload,
        loading: false,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userData: null,
      };

    default:
      return state;
  }
};

export default authReducer;
