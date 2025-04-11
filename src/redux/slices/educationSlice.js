import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiService';

// Async thunk for fetching all education resources
export const fetchResources = createAsyncThunk(
  'education/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      try {
        const response = await apiClient.get('/education/resources');
        return response.data;
      } catch (apiError) {
        console.log("Could not fetch from API, using mock data instead");
        
        const mockResources = [
          {
            id: '1',
            title: 'Introduction to Cryptocurrency',
            description: 'Learn the basics of cryptocurrency, blockchain technology, and how it\'s changing the financial world.',
            type: 'article',
            category: 'beginner',
            level: 'beginner',
            date: '2025-04-01',
            image: 'crypto-intro.jpg',
            readTime: '5 min',
            content: '<p>Cryptocurrency is a digital or virtual currency that uses cryptography for security.</p><p>Bitcoin, the first cryptocurrency, was created in 2009 by an individual or group known by the pseudonym Satoshi Nakamoto.</p><p>Unlike traditional currencies issued by governments (fiat currencies), cryptocurrencies operate on decentralized systems based on blockchain technology – a distributed ledger enforced by a network of computers.</p><h3>Key Concepts</h3><p>1. <strong>Blockchain</strong>: A distributed database that maintains a continuously growing list of records called blocks.</p><p>2. <strong>Mining</strong>: The process of validating transactions and adding them to the blockchain.</p><p>3. <strong>Wallet</strong>: Software that stores your public and private keys, allowing you to send and receive cryptocurrency.</p>'
          },
          {
            id: '2',
            title: 'Advanced Trading Strategies',
            description: 'Master advanced trading techniques used by professional traders in the cryptocurrency market.',
            type: 'article',
            category: 'advanced',
            level: 'advanced',
            date: '2025-03-15',
            image: 'trading-strategies.jpg',
            readTime: '12 min',
            content: '<p>This guide covers advanced trading strategies used in cryptocurrency markets.</p><h3>Technical Analysis Patterns</h3><p>Chart patterns provide insights into market psychology and can help predict future price movements.</p><h4>1. Head and Shoulders</h4><p>A reversal pattern that signals a trend change from bullish to bearish or vice versa.</p><h4>2. Cup and Handle</h4><p>A bullish continuation pattern that resembles a cup with a handle.</p><h3>Risk Management</h3><p>Proper risk management is essential for long-term trading success.</p><p>Never risk more than 1-2% of your trading capital on a single trade.</p>'
          },
          {
            id: '3',
            title: 'Understanding Market Cycles',
            description: 'Learn how to identify different market cycles and position your investments accordingly.',
            type: 'article',
            category: 'intermediate',
            level: 'intermediate',
            date: '2025-03-28',
            image: 'market-cycles.jpg',
            readTime: '8 min',
            content: '<p>Financial markets tend to move in cycles, with periods of growth followed by periods of decline.</p><h3>The Four Phases of Market Cycles</h3><p>1. <strong>Accumulation Phase</strong>: The market has bottomed, and knowledgeable investors begin to buy.</p><p>2. <strong>Mark-Up Phase</strong>: Prices begin to rise as more investors enter the market.</p><p>3. <strong>Distribution Phase</strong>: Sellers begin to dominate, and prices stagnate.</p><p>4. <strong>Mark-Down Phase</strong>: Prices fall as selling accelerates.</p>'
          },
          {
            id: '4',
            title: 'Fundamental Analysis in Crypto Markets',
            description: 'How to analyze cryptocurrency projects based on fundamental factors.',
            type: 'article',
            category: 'intermediate',
            level: 'intermediate',
            date: '2025-04-05',
            image: 'fundamental-analysis.jpg',
            readTime: '10 min',
            content: '<p>Fundamental analysis involves evaluating a cryptocurrency\'s intrinsic value.</p><h3>Key Factors to Consider</h3><p>1. <strong>Team</strong>: Experience and track record of the development team.</p><p>2. <strong>Technology</strong>: Innovation, scalability, and security of the blockchain.</p><p>3. <strong>Tokenomics</strong>: Distribution, supply mechanics, and economic model.</p><p>4. <strong>Adoption</strong>: Real-world use cases and growing user base.</p>'
          },
          {
            id: '5',
            title: 'Introduction to DeFi',
            description: 'Explore the world of decentralized finance and its revolutionary potential.',
            type: 'video',
            category: 'beginner',
            level: 'beginner',
            date: '2025-03-10',
            image: 'defi-intro.jpg',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            id: '6',
            title: 'Mastering Technical Analysis',
            description: 'Learn how to read charts and use technical indicators to improve your trading results.',
            type: 'video',
            category: 'intermediate',
            level: 'intermediate',
            date: '2025-02-20',
            image: 'technical-analysis.jpg',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            id: '7',
            title: 'NFTs Explained',
            description: 'Everything you need to know about Non-Fungible Tokens and their impact on digital ownership.',
            type: 'video',
            category: 'beginner',
            level: 'beginner',
            date: '2025-03-25',
            image: 'nft-explained.jpg',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            id: '8',
            title: 'Live Trading Session: Market Analysis',
            description: 'Join our expert traders for a live session analyzing current market conditions and trading opportunities.',
            type: 'webinar',
            category: 'advanced',
            level: 'advanced',
            date: '2025-04-08',
            image: 'live-trading.jpg',
            duration: '60 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            id: '9',
            title: 'Risk Management Workshop',
            description: 'Learn proven strategies to protect your capital and manage risk effectively in volatile markets.',
            type: 'webinar',
            category: 'intermediate',
            level: 'intermediate',
            date: '2025-03-30',
            image: 'risk-management.jpg',
            duration: '45 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            id: '10',
            title: 'Cryptocurrency Taxation',
            description: 'Understanding tax implications of cryptocurrency trading and how to stay compliant.',
            type: 'webinar',
            category: 'intermediate',
            level: 'intermediate',
            date: '2025-02-28',
            image: 'crypto-tax.jpg',
            duration: '50 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ];
        
        const mockFeaturedResources = [mockResources[0], mockResources[4], mockResources[7]];
        
        const mockCourses = [
          {
            id: 'c1',
            title: 'Cryptocurrency Trading Fundamentals',
            description: 'Learn the essentials of cryptocurrency trading from beginner to advanced concepts.',
            category: 'trading',
            instructor: 'Sarah Johnson',
            duration: '4 weeks',
            image: 'crypto-trading-fundamentals.jpg',
            enrollmentStatus: 'enrolled',
            progress: 65
          },
          {
            id: 'c2',
            title: 'Blockchain Development Bootcamp',
            description: 'Master blockchain technology and build your own decentralized applications.',
            category: 'development',
            instructor: 'Michael Chen',
            duration: '8 weeks',
            image: 'blockchain-development.jpg',
            enrollmentStatus: 'available'
          },
          {
            id: 'c3',
            title: 'DeFi Investment Strategies',
            description: 'Discover how to invest in decentralized finance protocols and maximize your returns.',
            category: 'investment',
            instructor: 'David Wilson',
            duration: '3 weeks',
            image: 'defi-investment.jpg',
            enrollmentStatus: 'available'
          }
        ];
        
        return { 
          resources: mockResources,
          featuredResources: mockFeaturedResources,
          courses: mockCourses
        };
      }
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
      const resource = state.resources.find(r => r.id === resourceId);
      
      if (!resource) return;
      
      const bookmarkIndex = state.bookmarks.findIndex(bookmark => bookmark.id === resourceId);
      
      if (bookmarkIndex === -1) {
        // Add bookmark
        state.bookmarks.push(resource);
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
        
        if (state.resources.length === 0) {
          console.log("No resources were returned from API, using mock data");
          
          const mockResources = [
            {
              id: '1',
              title: 'Introduction to Cryptocurrency',
              description: 'Learn the basics of cryptocurrency, blockchain technology, and how it\'s changing the financial world.',
              type: 'article',
              category: 'beginner',
              level: 'beginner',
              date: '2025-04-01',
              image: 'crypto-intro.jpg',
              readTime: '5 min',
              content: '<p>Cryptocurrency is a digital or virtual currency that uses cryptography for security.</p>'
            },
            {
              id: '2',
              title: 'Advanced Trading Strategies',
              description: 'Master advanced trading techniques used by professional traders in the cryptocurrency market.',
              type: 'article',
              category: 'advanced',
              level: 'advanced',
              date: '2025-03-15',
              image: 'trading-strategies.jpg',
              readTime: '12 min',
              content: '<p>This guide covers advanced trading strategies used in cryptocurrency markets.</p>'
            },
            {
              id: '3',
              title: 'Understanding Market Cycles',
              description: 'Learn how to identify different market cycles and position your investments accordingly.',
              type: 'article',
              category: 'intermediate',
              level: 'intermediate',
              date: '2025-03-28',
              image: 'market-cycles.jpg',
              readTime: '8 min',
              content: '<p>Financial markets tend to move in cycles, with periods of growth followed by periods of decline.</p>'
            }
          ];
          
          state.resources = mockResources;
          state.featuredResources = [mockResources[0]];
          
          state.courses = [
            {
              id: 'c1',
              title: 'Cryptocurrency Trading Fundamentals',
              description: 'Learn the essentials of cryptocurrency trading from beginner to advanced concepts.',
              category: 'trading',
              instructor: 'Sarah Johnson',
              duration: '4 weeks',
              image: 'crypto-trading-fundamentals.jpg',
              enrollmentStatus: 'enrolled',
              progress: 65
            }
          ];
        }
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
export const selectBookmarks = state => state.education.bookmarks;
export const selectEducationStatus = state => state.education.status;

export default educationSlice.reducer;
