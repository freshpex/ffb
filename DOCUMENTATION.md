# Fidelity First Brokers - Frontend Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Architecture](#project-architecture)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Key Components](#key-components)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Authentication](#authentication)
9. [Styling](#styling)
10. [Third-Party Services](#third-party-services)
11. [Development Workflow](#development-workflow)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Common Issues](#common-issues)
15. [Contributing Guidelines](#contributing-guidelines)

## Introduction

Fidelity First Brokers (FFB) is a comprehensive financial platform providing investment services, trading capabilities, and account management for clients. This documentation provides details for both users and contributors on how to use, modify, and extend the frontend application.

The frontend application is built with React and serves as the client-facing interface for the FFB platform. It includes public-facing pages, authentication flows, user dashboards, and admin panels.

## Project Architecture

The application follows a modern React architecture with the following key characteristics:

- **Component-Based Structure**: Organized around reusable UI components
- **Route-Based Code Splitting**: Lazy loading for optimized performance
- **Redux State Management**: Centralized state with Redux Toolkit
- **Firebase Authentication**: User identity and access management
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **API Integration**: RESTful API and WebSocket connections for real-time data

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or Yarn package manager
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ffbFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`
   - Fill in the required API keys and service configurations

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the development server at `http://localhost:5173`

## Project Structure

```
ffbFrontend/
├── public/                # Static assets and HTML entry point
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point for React
│   ├── firebase.js        # Firebase configuration and auth functions
│   ├── assets/            # Static assets like images and icons
│   ├── components/        # Reusable UI components
│   │   ├── About/         # About page components
│   │   ├── Admin/         # Admin dashboard components
│   │   │   ├── analytics/ # Admin analytics components
│   │   │   ├── common/    # Shared admin components
│   │   ├── AuthPage/      # Authentication components
│   │   ├── common/        # Shared components across the app
│   │   ├── DashBoard/     # User dashboard components
│   │   │   ├── ATMCards/  # ATM card management components
│   │   │   ├── Trading/   # Trading interface components
│   │   │   ├── ReferralTabs/ # Referral program components
│   │   ├── LandingPage/   # Public landing page components
│   ├── context/           # React context providers
│   │   ├── DarkModeContext.jsx  # Dark/light mode management
│   ├── css/               # Global CSS and Tailwind configuration
│   ├── redux/             # Redux store configuration
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   ├── selectors/     # Redux selectors
│   │   ├── slices/        # Redux Toolkit slices
│   │   ├── store.js       # Redux store configuration
│   ├── services/          # API and third-party service integrations
│   │   ├── apiService.js  # Base API service
│   │   ├── secureApiService.js # Authenticated API requests
│   │   ├── websocketService.js # Real-time data handling
│   │   ├── binanceService.js   # Binance API integration
│   │   ├── cryptoService.js    # Cryptocurrency data service
│   │   ├── mockServices.js     # Mock data for development
│   └── utils/             # Utility functions and helpers
├── .env                   # Environment variables (not in version control)
├── .env.example           # Example environment variables
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.cjs     # PostCSS configuration
├── package.json           # NPM dependencies and scripts
├── firebase.json          # Firebase hosting configuration
└── vercel.json            # Vercel deployment configuration
```

## Key Components

### Public Pages

- **Home (LandingPage)**: Marketing landing page with service descriptions
- **About**: Company information and team details
- **Services**: Detailed service offerings
- **Pricing**: Pricing plans and fee structures
- **Contact**: Contact form and support information

### Authentication

- **Login**: Email/password and Google sign-in options
- **SignUp**: New user registration form
- **ProtectedRoute**: Route wrapper to protect authenticated content
- **AuthContext**: React context for authentication state management

### User Dashboard

- **DashboardLayout**: Layout wrapper for all dashboard pages
- **DashboardHeader**: Top navigation with user profile and notifications
- **DashboardSidebar**: Navigation sidebar for dashboard features
- **AccountSummary**: Overview of user's account and balances
- **FinancialHighlights**: Key financial metrics and performance

### Investment Features

- **InvestmentPlans**: Available investment options
- **InvestmentModal**: Interface for making new investments
- **InvestmentSummary**: Current investment portfolio overview
- **InvestmentHistoryCard**: Transaction history for investments

### Trading Platform

- **TradingDashboard**: Main trading interface
- **TradingViewWidget**: Integration with TradingView charts
- **TradingChart**: Chart visualization for market data
- **OrderForm**: Interface for placing buy/sell orders
- **LiveOrderbook**: Real-time order book display

### Admin Panel

- **AdminLayout**: Layout wrapper for all admin pages
- **AdminHeader**: Top navigation bar for admin interface
- **AdminSidebar**: Navigation menu for admin features
- **AdminDashboard**: Overview dashboard for administrators
- **AdminAnalytics**: Data visualizations and statistics
- **AdminUsers**: User management interface
- **AdminTransactions**: Transaction monitoring and management
- **AdminKyc**: KYC verification workflow
- **AdminSupport**: Support ticket management system

## State Management

The application uses Redux with Redux Toolkit for state management.

### Redux Store Structure

```
store/
├── slices/
│   ├── userSlice.js        # User profile and settings
│   ├── authSlice.js        # Authentication state
│   ├── dashboardSlice.js   # Dashboard data
│   ├── investmentSlice.js  # Investment data
│   ├── depositSlice.js     # Deposit functionality
│   ├── withdrawalSlice.js  # Withdrawal functionality
│   ├── tradingSlice.js     # Trading state and orders
│   ├── adminUsersSlice.js  # Admin user management
│   ├── adminKycSlice.js    # Admin KYC verification
│   └── ...                 # Other domain-specific slices
```

### Key State Management Patterns

1. **Entity Adapters**: For normalized collections (users, transactions)
2. **Async Thunks**: For handling API calls with loading/error states
3. **Selectors**: For efficient state access and derived data
4. **Middleware**: For side effects like API calls and logging

## API Integration

### API Services

- **apiService.js**: Base service for non-authenticated API calls
- **secureApiService.js**: Adds authentication headers for protected endpoints
- **websocketService.js**: Manages WebSocket connections for real-time data

### API Endpoints

The frontend communicates with the backend through RESTful API endpoints:

- `/api/auth/*`: Authentication endpoints
- `/api/users/*`: User profile and settings
- `/api/dashboard/*`: Dashboard data and statistics
- `/api/transactions/*`: Transaction history and management
- `/api/investments/*`: Investment plans and user investments
- `/api/trading/*`: Trading functionality and order management
- `/api/admin/*`: Administrative functions

## Authentication

### Firebase Authentication

The application uses Firebase for authentication with the following features:

- Email/password authentication
- Google social login
- Password reset functionality
- Token-based authentication for API requests
- Protected routes requiring authentication

### Authentication Flow

1. User logs in through Firebase authentication
2. Firebase returns a JWT token
3. Token is stored in memory and local storage (for persistence)
4. Token is attached to API requests via the secureApiService
5. Protected routes check authentication status before rendering

## Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with the following customizations:

- Custom color scheme defined in `tailwind.config.js`
- Dark mode support via the DarkModeContext
- Responsive design utilities for all screen sizes
- Component-specific styles with Tailwind classes

### Dark Mode

The application supports both light and dark themes:
- Toggled via the DarkModeContext
- Persisted in local storage
- Respects user's system preferences

## Third-Party Services

### TradingView

- Used for advanced charting capabilities
- Integrated via TradingViewWidget component
- Configured for different timeframes and indicators

### Binance API

- Market data integration for cryptocurrency pricing
- Configured in binanceService.js
- Used for real-time price updates and historical data

### Firebase

- Authentication services
- Hosting configuration
- Analytics integration (optional)

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches

### Commit Conventions

We follow the Conventional Commits specification:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or fixing tests
- `chore`: Maintenance tasks

### Code Review Process

1. Create a Pull Request (PR) targeting the `develop` branch
2. Ensure all tests pass
3. Request review from at least one team member
4. Address review comments
5. Merge after approval

## Testing

### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Testing Tools

- Jest for unit and integration tests
- React Testing Library for component testing
- Cypress for end-to-end testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage report
npm test -- --coverage
```

## Deployment

### Build Process

```bash
# Create production build
npm run build
```

### Deployment Platforms

The application is configured for deployment on:

- **Vercel**: Main deployment platform
- **Firebase Hosting**: Alternative hosting option

### Deployment Commands

```bash
# Deploy to Vercel
vercel

# Deploy to Firebase
firebase deploy
```

## Common Issues

### Authentication Issues

**Problem**: User is redirected to login page despite being logged in.
**Solution**: Check if the JWT token has expired. The application should automatically refresh tokens, but network issues might prevent this.

### API Connection Issues

**Problem**: API requests fail with network errors.
**Solution**: 
1. Verify the API base URL in the `.env` file
2. Check if the backend server is running
3. Verify CORS settings on the backend

### Performance Issues

**Problem**: Dashboard loads slowly on initial load.
**Solution**: 
1. Use the React DevTools profiler to identify slow components
2. Implement memoization for expensive computations
3. Consider implementing virtualization for long lists

## Contributing Guidelines

### Code Style

- Follow the ESLint configuration for the project
- Use Prettier for code formatting
- Follow React best practices and component patterns

### Documentation

- Document all components with JSDoc comments
- Update this documentation for significant changes
- Include comments for complex logic

### Pull Request Process

1. Create a branch from `develop` following the branching strategy
2. Implement your changes with appropriate tests
3. Submit a PR with a clear description of changes
4. Address review comments
5. Once approved, your changes will be merged

### Environment Setup for Contributors

1. Request access to development resources
2. Set up the local development environment following the Getting Started guide
3. Ensure you have access to necessary API keys
4. Join the project communication channels for questions