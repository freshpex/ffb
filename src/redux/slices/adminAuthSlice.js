import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Update the loginAdmin thunk to use the backend API
export const loginAdmin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Get the API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Make the actual API call
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('ffb_admin_token', data.token);
      
      return data.admin;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'adminAuth/logout',
  async () => {
    // Remove token from localStorage
    localStorage.removeItem('ffb_admin_token');
    return true;
  }
);

// Update the checkAdminAuth thunk to validate token with backend
export const checkAdminAuth = createAsyncThunk(
  'adminAuth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // Get the API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Verify token with backend
      const response = await fetch(`${apiUrl}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem('ffb_admin_token');
        return rejectWithValue('Invalid token');
      }
      
      const data = await response.json();
      return data.admin;
    } catch (error) {
      localStorage.removeItem('ffb_admin_token');
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

const initialState = {
  admin: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      
      // Check Auth
      .addCase(checkAdminAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAdminAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.admin = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = adminAuthSlice.actions;

// Selectors
export const selectAdmin = state => state.adminAuth.admin;
export const selectAdminStatus = state => state.adminAuth.status;
export const selectAdminError = state => state.adminAuth.error;
export const selectIsAdminAuthenticated = state => state.adminAuth.isAuthenticated;
export const selectAdminPermissions = state => state.adminAuth.admin?.permissions || [];

export default adminAuthSlice.reducer;
