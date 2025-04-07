import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Async thunk for fetching all education resources
export const fetchResources = createAsyncThunk(
  'education/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/education/resources');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
    }
  }
);

// Initial state
const initialState = {
  resources: [],
  featuredResources: [],
  courses: [],
  bookmarks: [],
  filters: {
    category: 'all',
    level: 'all',
    search: '',
  },
  activeResource: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    // Set filters for resources
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        level: 'all',
        search: '',
      };
    },
    
    // Set active resource for detailed view
    setActiveResource: (state, action) => {
      state.activeResource = action.payload;
    },
    
    // Toggle bookmark status for a resource
    toggleBookmark: (state, action) => {
      const resourceId = action.payload;
      const bookmarkIndex = state.bookmarks.findIndex(id => id === resourceId);
      
      if (bookmarkIndex === -1) {
        // Add bookmark
        state.bookmarks.push(resourceId);
      } else {
        // Remove bookmark
        state.bookmarks.splice(bookmarkIndex, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resources = action.payload.resources || [];
        state.featuredResources = action.payload.featuredResources || [];
        state.courses = action.payload.courses || [];
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setActiveResource,
  toggleBookmark
} = educationSlice.actions;

// Selectors
export const selectResources = state => {
  const { resources, filters } = state.education;
  
  return resources.filter(resource => {
    // Filter by category
    if (filters.category !== 'all' && resource.category !== filters.category) {
      return false;
    }
    
    // Filter by level
    if (filters.level !== 'all' && resource.level !== filters.level) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !resource.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};

export const selectFeaturedResources = state => state.education.featuredResources;
export const selectCourses = state => state.education.courses;
export const selectBookmarks = state => {
  const { resources, bookmarks } = state.education;
  return resources.filter(resource => bookmarks.includes(resource.id));
};
export const selectEducationStatus = state => state.education.status;

export default educationSlice.reducer;
