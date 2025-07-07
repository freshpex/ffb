import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

// Async thunks for tasks
export const fetchAvailableTasks = createAsyncThunk(
  'tasks/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTasks()
      console.log('Available tasks fetched:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available tasks');
    }
  }
);

export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserTasks();
      console.log('User tasks fetched:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user tasks');
    }
  }
);

export const fetchTaskStatistics = createAsyncThunk(
  'tasks/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTaskStatistics();
      console.log('Task statistics fetched:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task statistics');
    }
  }
);

export const startTask = createAsyncThunk(
  'tasks/startTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await apiService.startTask(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start task');
    }
  }
);

export const claimTaskReward = createAsyncThunk(
  'tasks/claimReward',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await apiService.claimTaskReward(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to claim reward');
    }
  }
);

// Initial state
const initialState = {
  availableTasks: [],
  userTasks: [],
  activeTask: null,
  statistics: {
    totalCompleted: 0,
    totalEarnings: 0,
    totalInProgress: 0,
    completionRate: 0,
    categoryBreakdown: {}
  },
  filters: {
    category: 'all',
    status: 'all',
    difficulty: 'all'
  },
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0
  }
};

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTaskFilters: (state) => {
      state.filters = {
        category: 'all',
        status: 'all',
        difficulty: 'all'
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAvailableTasks
      .addCase(fetchAvailableTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableTasks = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAvailableTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // fetchUserTasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userTasks = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // fetchTaskStatistics
      .addCase(fetchTaskStatistics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map backend response to frontend state structure
        state.statistics = {
          totalCompleted: action.payload.data.completedTasks || 0,
          totalEarnings: action.payload.data.totalEarnings || 0,
          totalInProgress: action.payload.data.inProgressTasks || 0,
          completionRate: action.payload.data.completionRate || 0,
          categoryBreakdown: action.payload.data.categoryBreakdown || {}
        };
      })
      .addCase(fetchTaskStatistics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // startTask
      .addCase(startTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Update user tasks
        const index = state.availableTasks.findIndex(task => task.id === action.payload.data.task);
        if (index !== -1) {
          state.availableTasks[index].userProgress = {
            status: 'in_progress',
            progress: 0,
            startedAt: new Date().toISOString(),
          };
        }
        
        // Add to userTasks if not already there
        if (!state.userTasks.find(task => task.task === action.payload.data.task)) {
          state.userTasks.push(action.payload.data);
        }
      })
      .addCase(startTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // claimTaskReward
      .addCase(claimTaskReward.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(claimTaskReward.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Update task status in userTasks
        const userTaskIndex = state.userTasks.findIndex(task => task.task === action.payload.data.userTask.task);
        if (userTaskIndex !== -1) {
          state.userTasks[userTaskIndex].status = 'claimed';
          state.userTasks[userTaskIndex].claimedAt = new Date().toISOString();
        }
        
        // Update available tasks
        const availableTaskIndex = state.availableTasks.findIndex(task => task.id === action.payload.data.userTask.task);
        if (availableTaskIndex !== -1 && state.availableTasks[availableTaskIndex].userProgress) {
          state.availableTasks[availableTaskIndex].userProgress.status = 'claimed';
          state.availableTasks[availableTaskIndex].userProgress.claimedAt = new Date().toISOString();
        }
        
        // Update statistics
        state.statistics.totalEarnings += action.payload.data.reward.amount;
        state.statistics.totalCompleted += 1;
        state.statistics.totalInProgress -= 1;
      })
      .addCase(claimTaskReward.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

// Export actions
export const { setTaskFilters, clearTaskFilters, setCurrentPage } = taskSlice.actions;

// Export selectors
export const selectAllTasks = state => state.tasks.availableTasks;
export const selectUserTasks = state => state.tasks.userTasks;
export const selectTaskStatistics = state => state.tasks.statistics;
export const selectTaskFilters = state => state.tasks.filters;
export const selectTaskStatus = state => state.tasks.status;
export const selectTaskError = state => state.tasks.error;
export const selectTaskPagination = state => state.tasks.pagination;

export const selectTasksByStatus = status => state => {
  if (status === 'all') return state.tasks.userTasks;
  return state.tasks.userTasks.filter(task => task.status === status);
};

export const selectTasksByCategory = category => state => {
  if (category === 'all') return state.tasks.availableTasks;
  return state.tasks.availableTasks.filter(task => task.category === category);
};

export const selectCompletableTasks = state => {
  return state.tasks.userTasks.filter(task => task.status === 'completed');
};

export default taskSlice.reducer;
