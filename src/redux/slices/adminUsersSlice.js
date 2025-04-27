import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        status = "",
        role = "",
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(role && { role }),
      });

      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return {
        users: data.data ? data.data.users : data.users,
        pagination: data.data
          ? data.data.pagination
          : {
              page,
              limit,
              total: data.total,
              pages: data.totalPages,
            },
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  },
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "adminUsers/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required");
      }

      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data ? data.data.user : data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  },
);

// Create new user
export const createUser = createAsyncThunk(
  "adminUsers/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create user");
    }
  },
);

// Update user
export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update user");
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await handleApiError(response);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete user");
    }
  },
);

// Fetch user statistics
export const fetchUserStats = createAsyncThunk(
  "adminUsers/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await fetch(`${API_URL}/admin/users/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await handleApiError(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch user statistics",
      );
    }
  },
);

// Create initial state
const initialState = {
  users: [],
  selectedUser: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  stats: {
    counts: {
      total: 0,
      byRole: {
        regular: 0,
        admin: 0,
        superadmin: 0,
      },
      byStatus: {
        active: 0,
        inactive: 0,
        suspended: 0,
      },
      byKyc: {
        verified: 0,
        pending: 0,
        rejected: 0,
      },
    },
    recentUsers: [],
  },
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  actionStatus: "idle", // status for CRUD operations
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
      state.actionStatus = "idle";
    },
    setUserFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users.unshift(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedUser = action.payload;

        // Update user in the list if it exists
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);

        if (state.selectedUser && state.selectedUser._id === action.payload) {
          state.selectedUser = null;
        }

        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })

      // Fetch user statistics
      .addCase(fetchUserStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearSelectedUser, clearUsersError, setUserFilters } =
  adminUsersSlice.actions;

// Export selectors
export const selectUsers = (state) => state.adminUsers.users;
export const selectSelectedUser = (state) => state.adminUsers.selectedUser;
export const selectUsersPagination = (state) => state.adminUsers.pagination;
export const selectUsersStatus = (state) => state.adminUsers.status;
export const selectUsersError = (state) => state.adminUsers.error;
export const selectUserActionStatus = (state) => state.adminUsers.actionStatus;
export const selectUserStats = (state) => state.adminUsers.stats;

export default adminUsersSlice.reducer;
