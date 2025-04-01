import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulating API calls with mock data
export const loginAdmin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          permissions: ['users', 'transactions', 'kyc', 'investments', 'settings']
        };
        
        // Store token in localStorage
        localStorage.setItem('ffb_admin_token', 'mock-admin-jwt-token');
        return adminUser;
      }
      
      if (credentials.email === 'moderator@example.com' && credentials.password === 'mod123') {
        const modUser = {
          id: 'mod-1',
          email: 'moderator@example.com',
          name: 'Moderator User',
          role: 'moderator',
          permissions: ['users', 'kyc']
        };
        
        localStorage.setItem('ffb_admin_token', 'mock-moderator-jwt-token');
        return modUser;
      }
      
      return rejectWithValue('Invalid email or password');
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

export const checkAdminAuth = createAsyncThunk(
  'adminAuth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('ffb_admin_token');
      
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // In a real app, you'd validate the token with an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock admin data based on token
      if (token === 'mock-admin-jwt-token') {
        return {
          id: 'admin-1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          permissions: ['users', 'transactions', 'kyc', 'investments', 'settings']
        };
      } else if (token === 'mock-moderator-jwt-token') {
        return {
          id: 'mod-1',
          email: 'moderator@example.com',
          name: 'Moderator User',
          role: 'moderator',
          permissions: ['users', 'kyc']
        };
      }
      
      // If we get here, token wasn't recognized - clear it
      localStorage.removeItem('ffb_admin_token');
      return rejectWithValue('Invalid token');
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
