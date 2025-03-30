import mockApiService from './mockApiService';

// Export all mock services for easy importing
export const mockUser = {
  getProfile: async () => {
    return mockApiService.user.getProfile();
  },
  
  updateProfile: async (data) => {
    return mockApiService.user.updateProfile(data);
  }
};

export const mockTransactions = {
  getDeposits: async (params = {}) => {
    return mockApiService.transactions.getDeposits(params);
  },
  
  getWithdrawals: async (params = {}) => {
    return mockApiService.transactions.getWithdrawals(params);
  },
  
  createDeposit: async (data) => {
    return mockApiService.transactions.createDeposit(data);
  },
  
  createWithdrawal: async (data) => {
    return mockApiService.transactions.createWithdrawal(data);
  }
};

export const mockInvestments = {
  getInvestments: async () => {
    return mockApiService.investments.getInvestments();
  },
  
  getPlans: async () => {
    return mockApiService.investments.getPlans();
  },
  
  createInvestment: async (data) => {
    return mockApiService.investments.createInvestment(data);
  }
};

export const mockMarket = {
  getPrices: async () => {
    return mockApiService.market.getPrices();
  },
  
  getNews: async () => {
    return mockApiService.market.getNews();
  }
};

export default mockApiService;
