// Mock API Service to replace backend calls

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock endpoints for various data needs
const mockApiService = {
  // Auth related mock endpoints
  auth: {
    login: async (credentials) => {
      await delay(800); // Simulate network delay
      // Authentication is handled by Firebase, this is just for API simulation
      return {
        success: true,
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        user: {
          id: 'user_' + Math.random().toString(36).substring(2),
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'user'
        }
      };
    },
    
    register: async (userData) => {
      await delay(1000);
      return {
        success: true,
        message: 'User registered successfully'
      };
    }
  },
  
  // User related mock endpoints
  user: {
    getProfile: async () => {
      await delay(500);
      return {
        id: 'user_' + Math.random().toString(36).substring(2),
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        phoneNumber: '+1234567890',
        address: '123 Main St, City, Country',
        balance: 25000.00,
        role: 'user',
        kycVerified: true,
        referralCode: 'DEMO123',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    },
    
    updateProfile: async (profileData) => {
      await delay(700);
      return {
        success: true,
        message: 'Profile updated successfully',
        user: {
          ...profileData,
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
  
  // Transactions mock endpoints
  transactions: {
    getDeposits: async (params = {}) => {
      await delay(800);
      
      // Generate mock transactions
      const transactions = Array(10).fill().map((_, index) => ({
        id: `dep_${Math.random().toString(36).substring(2)}`,
        type: 'deposit',
        amount: Math.floor(Math.random() * 10000) / 100,
        currency: 'USD',
        method: ['bank', 'bitcoin', 'ethereum', 'credit_card'][Math.floor(Math.random() * 4)],
        status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000 + 3600000).toISOString()
      }));
      
      return {
        transactions,
        totalCount: 30,
        page: params.page || 1,
        limit: params.limit || 10
      };
    },
    
    getWithdrawals: async (params = {}) => {
      await delay(800);
      
      // Generate mock transactions
      const transactions = Array(10).fill().map((_, index) => ({
        id: `with_${Math.random().toString(36).substring(2)}`,
        type: 'withdrawal',
        amount: Math.floor(Math.random() * 5000) / 100,
        currency: 'USD',
        method: ['bank', 'bitcoin', 'ethereum'][Math.floor(Math.random() * 3)],
        status: ['completed', 'pending', 'failed', 'cancelled'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000 + 3600000).toISOString()
      }));
      
      return {
        transactions,
        totalCount: 25,
        page: params.page || 1,
        limit: params.limit || 10
      };
    },
    
    createDeposit: async (depositData) => {
      await delay(1000);
      return {
        success: true,
        message: 'Deposit request created successfully',
        transaction: {
          id: `dep_${Math.random().toString(36).substring(2)}`,
          type: 'deposit',
          amount: depositData.amount,
          currency: 'USD',
          method: depositData.method,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    
    createWithdrawal: async (withdrawalData) => {
      await delay(1000);
      return {
        success: true,
        message: 'Withdrawal request created successfully',
        transaction: {
          id: `with_${Math.random().toString(36).substring(2)}`,
          type: 'withdrawal',
          amount: withdrawalData.amount,
          currency: 'USD',
          method: withdrawalData.method,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
  },
  
  // Investments mock endpoints
  investments: {
    getInvestments: async () => {
      await delay(700);
      
      return [
        {
          id: 'inv_101',
          planId: 'plan_starter',
          planName: 'Starter Plan',
          amount: 2500,
          expectedReturn: 125, // 5% of 2500
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          currentValue: 2562.50, // Principal + accrued interest
          status: 'active',
          progress: 50, // Percentage complete
          roi: 5,
          duration: 30
        },
        {
          id: 'inv_102',
          planId: 'plan_growth',
          planName: 'Growth Plan',
          amount: 8000,
          expectedReturn: 680, // 8.5% of 8000
          startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
          endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
          currentValue: 8226.67, // Principal + accrued interest
          status: 'active',
          progress: 33, // Percentage complete
          roi: 8.5,
          duration: 60
        },
        {
          id: 'inv_095',
          planId: 'plan_starter',
          planName: 'Starter Plan',
          amount: 1500,
          returnAmount: 75, // 5% of 1500
          startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          status: 'completed',
          roi: 5,
          duration: 30
        },
        {
          id: 'inv_098',
          planId: 'plan_advanced',
          planName: 'Advanced Plan',
          amount: 12000,
          returnAmount: 1440, // 12% of 12000
          startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          status: 'completed',
          roi: 12,
          duration: 90
        },
        {
          id: 'inv_099',
          planId: 'plan_growth',
          planName: 'Growth Plan',
          amount: 5000,
          returnAmount: 0, // Early withdrawal, no return
          startDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago
          endDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(), // Cancelled after 10 days
          status: 'cancelled',
          roi: 8.5,
          duration: 60
        }
      ];
    },
    
    getPlans: async () => {
      await delay(500);
      
      return [
        {
          id: 'plan_starter',
          name: 'Starter Plan',
          description: 'Begin your investment journey with low risk and steady returns.',
          minAmount: 1000,
          maxAmount: 10000,
          roi: 5, // Percentage
          duration: 30, // Days
          features: [
            'Low risk profile',
            'Daily interest payments',
            'Principal returned at maturity',
            'Early withdrawal available (with fee)'
          ],
          riskLevel: 'Low',
          category: 'beginner',
          popularity: 'high',
          recommended: true,
          image: '/images/investment/starter-plan.svg'
        },
        {
          id: 'plan_growth',
          name: 'Growth Plan',
          description: 'Accelerate your capital growth with balanced risk and higher returns.',
          minAmount: 5000,
          maxAmount: 50000,
          roi: 8.5, // Percentage
          duration: 60, // Days
          features: [
            'Moderate risk profile',
            'Weekly interest payments',
            'Principal returned at maturity',
            'Trading signals access'
          ],
          riskLevel: 'Medium',
          category: 'intermediate',
          popularity: 'medium',
          recommended: false,
          image: '/images/investment/growth-plan.svg'
        },
        {
          id: 'plan_advanced',
          name: 'Advanced Plan',
          description: 'Maximize returns with cryptocurrency market opportunities.',
          minAmount: 10000,
          maxAmount: 100000,
          roi: 12, // Percentage
          duration: 90, // Days
          features: [
            'Higher risk profile',
            'Higher potential returns',
            'Bi-weekly interest payments',
            'Crypto market analysis reports',
            'Dedicated account manager'
          ],
          riskLevel: 'High',
          category: 'advanced',
          popularity: 'medium',
          recommended: false,
          image: '/images/investment/advanced-plan.svg'
        },
        {
          id: 'plan_premium',
          name: 'Premium Plan',
          description: 'For sophisticated investors seeking maximum returns.',
          minAmount: 25000,
          maxAmount: null, // No maximum
          roi: 18, // Percentage
          duration: 180, // Days
          features: [
            'High risk profile',
            'Highest potential returns',
            'Monthly portfolio rebalancing',
            'Advanced trading algorithms',
            'Priority customer support',
            'Exclusive investment webinars'
          ],
          riskLevel: 'Very High',
          category: 'expert',
          popularity: 'low',
          recommended: false,
          image: '/images/investment/premium-plan.svg'
        }
      ];
    },
    
    createInvestment: async (investmentData) => {
      await delay(1200);
      
      // Create a new investment with appropriate fields
      const now = new Date();
      const endDate = new Date(now);
      
      // Find the plan - we'll use plan data from our defined plans
      const plans = [
        { id: 'plan_starter', name: 'Starter Plan', roi: 5, duration: 30 },
        { id: 'plan_growth', name: 'Growth Plan', roi: 8.5, duration: 60 },
        { id: 'plan_advanced', name: 'Advanced Plan', roi: 12, duration: 90 },
        { id: 'plan_premium', name: 'Premium Plan', roi: 18, duration: 180 }
      ];
      
      const plan = plans.find(p => p.id === investmentData.planId) || plans[0];
      
      // Add days to end date
      endDate.setDate(now.getDate() + plan.duration);
      
      const amount = parseFloat(investmentData.amount);
      const expectedReturn = amount * (plan.roi / 100);
      
      const investment = {
        id: 'inv_' + Math.random().toString(36).substring(2, 10),
        planId: plan.id,
        planName: plan.name,
        amount: amount,
        expectedReturn: expectedReturn,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        currentValue: amount, // Start with just the principal
        status: 'active',
        progress: 0, // Just started
        roi: plan.roi,
        duration: plan.duration
      };
      
      return {
        success: true,
        message: 'Investment created successfully',
        investment: investment
      };
    }
  },
  
  // Market data mock endpoints
  market: {
    getPrices: async () => {
      await delay(300);
      
      return {
        BTC: { price: 64352.12, change: 2.45 },
        ETH: { price: 3450.78, change: -1.23 },
        LTC: { price: 78.34, change: 0.95 },
        XRP: { price: 0.67, change: 3.21 },
        ADA: { price: 0.48, change: -0.67 },
        DOT: { price: 5.93, change: 1.17 },
        LINK: { price: 17.82, change: -0.32 }
      };
    },
    
    getNews: async () => {
      await delay(600);
      
      return [
        {
          id: 1,
          title: "Bitcoin Surges Past $64,000 as Institutional Interest Grows",
          snippet: "Major financial institutions continue to increase their cryptocurrency holdings as Bitcoin reaches new highs for the year.",
          source: "Crypto Daily",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          url: "#"
        },
        {
          id: 2,
          title: "Fed Signals Potential Rate Cuts, Markets React Positively",
          snippet: "In its latest meeting, the Federal Reserve indicated that it may consider interest rate cuts in the coming months, leading to positive reactions in both traditional and crypto markets.",
          source: "Financial Times",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          url: "#"
        },
        {
          id: 3,
          title: "New Regulatory Framework for Cryptocurrencies Proposed",
          snippet: "Lawmakers have introduced a bill that would create a comprehensive regulatory framework for digital assets, potentially bringing more institutional investors into the space.",
          source: "Bloomberg",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          url: "#"
        }
      ];
    }
  }
};

export default mockApiService;
