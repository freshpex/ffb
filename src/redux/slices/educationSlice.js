import { createSlice } from '@reduxjs/toolkit';

// Mock educational resources
const mockResources = [
  {
    id: 'edu-1001',
    title: 'Introduction to Cryptocurrency',
    description: 'Learn the basics of blockchain technology and cryptocurrency.',
    category: 'beginner',
    type: 'article',
    content: `
      <h2>What is Cryptocurrency?</h2>
      <p>Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on a technology called blockchain.</p>
      <h2>How Does Blockchain Work?</h2>
      <p>Blockchain is a decentralized, distributed ledger that records transactions across many computers so that any involved record cannot be altered retroactively.</p>
      <h2>Popular Cryptocurrencies</h2>
      <ul>
        <li>Bitcoin (BTC)</li>
        <li>Ethereum (ETH)</li>
        <li>Binance Coin (BNB)</li>
        <li>Solana (SOL)</li>
      </ul>
    `,
    image: 'crypto-intro.jpg',
    readTime: '5 min',
    date: '2023-10-15',
    featured: true
  },
  {
    id: 'edu-1002',
    title: 'Understanding Market Orders vs Limit Orders',
    description: 'Learn the difference between market and limit orders in trading.',
    category: 'trading',
    type: 'article',
    content: `
      <h2>Market Orders</h2>
      <p>A market order is an order to buy or sell an asset immediately at the current market price.</p>
      <h2>Limit Orders</h2>
      <p>A limit order is an order to buy or sell an asset at a specific price or better.</p>
      <h2>When to Use Each</h2>
      <p>Use market orders when immediate execution is the priority. Use limit orders when price is the priority.</p>
    `,
    image: 'orders.jpg',
    readTime: '7 min',
    date: '2023-10-20',
    featured: false
  },
  {
    id: 'edu-1003',
    title: 'Technical Analysis Fundamentals',
    description: 'Learn how to read charts and identify trading patterns.',
    category: 'advanced',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: '',
    duration: '15 min',
    date: '2023-11-01',
    featured: true
  },
  {
    id: 'edu-1004',
    title: 'Risk Management Strategies',
    description: 'Learn how to protect your investment portfolio from significant losses.',
    category: 'trading',
    type: 'article',
    content: `
      <h2>What is Risk Management?</h2>
      <p>Risk management involves identifying, analyzing, and mitigating investment uncertainties.</p>
      <h2>Position Sizing</h2>
      <p>Never risk more than a small percentage of your portfolio on a single trade.</p>
      <h2>Stop Loss Orders</h2>
      <p>Always use stop loss orders to limit potential losses.</p>
      <h2>Diversification</h2>
      <p>Spread your investments across different assets to reduce risk.</p>
    `,
    image: 'risk-management.jpg',
    readTime: '10 min',
    date: '2023-11-10',
    featured: false
  },
  {
    id: 'edu-1005',
    title: 'Fundamental Analysis: Evaluating Crypto Projects',
    description: 'Learn how to evaluate the fundamental value of cryptocurrency projects.',
    category: 'advanced',
    type: 'webinar',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: '',
    duration: '45 min',
    date: '2023-11-15',
    featured: false
  }
];

// Courses
const mockCourses = [
  {
    id: 'course-101',
    title: 'Crypto Trading Fundamentals',
    description: 'A comprehensive course for beginners to learn cryptocurrency trading basics.',
    category: 'beginner',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Cryptocurrency',
        lessons: [
          { id: 'lesson-1-1', title: 'What is Cryptocurrency?', completed: true, resource: 'edu-1001' },
          { id: 'lesson-1-2', title: 'History of Bitcoin and Blockchain', completed: true, resource: null },
          { id: 'lesson-1-3', title: 'How Blockchain Works', completed: false, resource: null }
        ]
      },
      {
        id: 'module-2',
        title: 'Trading Basics',
        lessons: [
          { id: 'lesson-2-1', title: 'Order Types', completed: false, resource: 'edu-1002' },
          { id: 'lesson-2-2', title: 'Reading Charts', completed: false, resource: null },
          { id: 'lesson-2-3', title: 'Basic Trading Strategies', completed: false, resource: null }
        ]
      }
    ],
    enrollmentStatus: 'enrolled',
    progress: 33,
    instructor: 'Alex Johnson',
    duration: '4 weeks',
    image: 'trading-fundamentals.jpg'
  },
  {
    id: 'course-102',
    title: 'Technical Analysis Masterclass',
    description: 'Advanced course covering technical analysis methods for cryptocurrency trading.',
    category: 'advanced',
    modules: [
      {
        id: 'module-1',
        title: 'Chart Patterns',
        lessons: [
          { id: 'lesson-1-1', title: 'Support and Resistance', completed: false, resource: null },
          { id: 'lesson-1-2', title: 'Trend Lines', completed: false, resource: null },
          { id: 'lesson-1-3', title: 'Common Chart Patterns', completed: false, resource: 'edu-1003' }
        ]
      },
      {
        id: 'module-2',
        title: 'Technical Indicators',
        lessons: [
          { id: 'lesson-2-1', title: 'Moving Averages', completed: false, resource: null },
          { id: 'lesson-2-2', title: 'RSI and MACD', completed: false, resource: null },
          { id: 'lesson-2-3', title: 'Fibonacci Retracement', completed: false, resource: null }
        ]
      }
    ],
    enrollmentStatus: 'not-enrolled',
    progress: 0,
    instructor: 'Sarah Chen',
    duration: '6 weeks',
    image: 'technical-analysis.jpg'
  }
];

const initialState = {
  resources: mockResources,
  courses: mockCourses,
  bookmarks: [],
  categories: ['beginner', 'intermediate', 'advanced', 'trading', 'investment', 'crypto'],
  filters: {
    type: null,
    category: null,
    search: ''
  },
  activeResource: null,
  activeCourse: null,
  status: 'idle',
  error: null
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    fetchResourcesStart(state) {
      state.status = 'loading';
    },
    fetchResourcesSuccess(state, action) {
      state.status = 'succeeded';
      state.resources = action.payload;
    },
    fetchResourcesFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    
    setActiveResource(state, action) {
      state.activeResource = action.payload;
    },
    
    setActiveCourse(state, action) {
      state.activeCourse = action.payload;
    },
    
    toggleBookmark(state, action) {
      const resourceId = action.payload;
      const bookmarkIndex = state.bookmarks.indexOf(resourceId);
      
      if (bookmarkIndex >= 0) {
        state.bookmarks.splice(bookmarkIndex, 1);
      } else {
        state.bookmarks.push(resourceId);
      }
    },
    
    enrollInCourse(state, action) {
      const courseId = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      
      if (course) {
        course.enrollmentStatus = 'enrolled';
      }
    },
    
    completeLessonStart(state) {
      state.status = 'loading';
    },
    
    completeLessonSuccess(state, action) {
      state.status = 'succeeded';
      const { courseId, moduleId, lessonId } = action.payload;
      
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        const module = course.modules.find(m => m.id === moduleId);
        if (module) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            lesson.completed = true;
            
            // Update course progress
            const totalLessons = course.modules.reduce(
              (total, module) => total + module.lessons.length, 0
            );
            const completedLessons = course.modules.reduce(
              (total, module) => total + module.lessons.filter(l => l.completed).length, 0
            );
            
            course.progress = Math.round((completedLessons / totalLessons) * 100);
          }
        }
      }
    },
    
    completeLessonFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    resetEducationState: () => initialState
  }
});

export const {
  fetchResourcesStart,
  fetchResourcesSuccess,
  fetchResourcesFailure,
  setFilters,
  clearFilters,
  setActiveResource,
  setActiveCourse,
  toggleBookmark,
  enrollInCourse,
  completeLessonStart,
  completeLessonSuccess,
  completeLessonFailure,
  resetEducationState
} = educationSlice.actions;

// Thunk for fetching educational resources
export const fetchResources = () => async (dispatch) => {
  try {
    dispatch(fetchResourcesStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(fetchResourcesSuccess(mockResources));
  } catch (error) {
    dispatch(fetchResourcesFailure(error.message || 'Failed to fetch educational resources'));
  }
};

// Thunk for marking a lesson as completed
export const completeLesson = (courseId, moduleId, lessonId) => async (dispatch) => {
  try {
    dispatch(completeLessonStart());
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(completeLessonSuccess({ courseId, moduleId, lessonId }));
    return { success: true };
  } catch (error) {
    dispatch(completeLessonFailure(error.message || 'Failed to mark lesson as completed'));
    return { success: false, error: error.message };
  }
};

// Selectors
export const selectResources = state => {
  const { resources, filters } = state.education || { resources: [], filters: initialState.filters };
  
  return resources.filter(resource => {
    // Filter by type
    if (filters.type && resource.type !== filters.type) {
      return false;
    }
    
    // Filter by category
    if (filters.category && resource.category !== filters.category) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });
};

export const selectFeaturedResources = state => 
  (state.education?.resources || []).filter(resource => resource.featured);

export const selectCourses = state => state.education?.courses || [];
export const selectEnrolledCourses = state => 
  (state.education?.courses || []).filter(course => course.enrollmentStatus === 'enrolled');

export const selectActiveResource = state => {
  const resourceId = state.education?.activeResource;
  if (!resourceId) return null;
  
  return (state.education?.resources || []).find(r => r.id === resourceId);
};

export const selectActiveCourse = state => {
  const courseId = state.education?.activeCourse;
  if (!courseId) return null;
  
  return (state.education?.courses || []).find(c => c.id === courseId);
};

export const selectBookmarks = state => {
  const bookmarkIds = state.education?.bookmarks || [];
  return (state.education?.resources || []).filter(r => bookmarkIds.includes(r.id));
};

export const selectEducationStatus = state => state.education?.status || 'idle';
export const selectEducationError = state => state.education?.error;

export default educationSlice.reducer;
