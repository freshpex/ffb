import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateMockUsers } from '../../utils/mockDataGenerator';

// Generate 50 mock users
const mockUsers = generateMockUsers(50);

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter and paginate users based on search and status
      let filteredUsers = [...mockUsers];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchLower) ||
          user.fullName.toLowerCase().includes(searchLower) ||
          user.accountNumber.includes(search)
        );
      }
      
      if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status);
      }
      
      // Calculate pagination
      const totalUsers = filteredUsers.length;
      const totalPages = Math.ceil(totalUsers / limit);
      const startIndex = (page - 1) * limit;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
      
      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

// Fetch single user
export const fetchUserById = createAsyncThunk(
  'adminUsers/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        return rejectWithValue('User not found');
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'adminUsers/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return rejectWithValue('User not found');
      }
      
      // Update user data
      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // Update mockUsers array (in a real app, this would be done by the API)
      mockUsers[userIndex] = updatedUser;
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

// Create initial state
const initialState = {
  users: [],
  selectedUser: null,
  pagination: {
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: 'idle' // status for CRUD operations
};

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.actionStatus = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.selectedUser = action.payload;
        
        // Update user in the list if it exists
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearSelectedUser, clearUsersError } = adminUsersSlice.actions;

// Export selectors
export const selectUsers = state => state.adminUsers.users;
export const selectSelectedUser = state => state.adminUsers.selectedUser;
export const selectUsersPagination = state => state.adminUsers.pagination;
export const selectUsersStatus = state => state.adminUsers.status;
export const selectUsersError = state => state.adminUsers.error;
export const selectUserActionStatus = state => state.adminUsers.actionStatus;

export default adminUsersSlice.reducer;
