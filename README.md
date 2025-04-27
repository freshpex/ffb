# Fidelity First Brokers - Frontend

## Project Overview

Fidelity First Brokers (FFB) is a comprehensive financial platform that provides investment services, trading capabilities, and account management for clients. The frontend application is built with React and offers a rich user experience across public-facing pages and authenticated user dashboards.

## Key Features

### Public-facing Pages

- **Landing Page**: Modern, responsive design showcasing company services, statistics, and trust indicators
- **About Page**: Company history, values, and mission statements
- **Service Pages**: Detailed information about offered financial services
- **Contact Page**: Contact form and support information
- **Pricing Page**: Transparent pricing and fee structure

### Authentication

- Firebase-based authentication system
- Email/password login with validation
- Google login integration
- Password recovery functionality
- Registration flow with verification

### User Dashboard

- **Dashboard Overview**: Account summary, financial highlights, and quick actions
- **Deposit/Withdrawal System**: Multiple payment method support
- **Transaction History**: Detailed transaction logs
- **Investment Plans**: Available investment options with real-time data
- **Trading Platform**: Real-time charts and trading capabilities
- **Referral Program**: User-to-user referral tracking
- **Education Center**: Financial education resources
- **ATM Cards Management**: Virtual and physical card management
- **Account Settings**: Profile, security, and payment methods management

### Admin Dashboard

- **Admin Analytics**: Comprehensive statistics and data visualizations
- **User Management**: User account oversight and modification
- **Transaction Management**: Processing and tracking of financial transactions
- **KYC Verification**: Identity verification workflow
- **Support Ticket System**: Customer support ticket management
- **System Settings**: Platform configuration options

## Technical Stack

- **Framework**: React with React Router for navigation
- **State Management**: Redux with Redux Toolkit
- **Authentication**: Firebase Authentication
- **Styling**: Tailwind CSS with custom components
- **UI/UX**: Responsive design with dark/light mode toggle
- **Charts**: Trading view integration for market data visualization
- **API Integration**: RESTful API connectivity with the backend
- **Real-time Data**: WebSocket integration for live data updates

## Project Structure

The frontend application follows a component-based architecture with the following structure:

```
ffbFrontend/
├── public/               # Static assets and HTML entry point
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point for React
│   ├── assets/           # Static assets like images and icons
│   ├── components/       # Reusable UI components
│   │   ├── About/        # About page components
│   │   ├── Admin/        # Admin dashboard components
│   │   ├── AuthPage/     # Authentication components
│   │   ├── common/       # Shared components
│   │   ├── DashBoard/    # User dashboard components
│   │   └── LandingPage/  # Public landing page components
│   ├── context/          # React context providers
│   ├── css/              # Global CSS and Tailwind configuration
│   ├── redux/            # Redux store, slices, and actions
│   │   ├── actions/      # Redux actions
│   │   ├── reducers/     # Redux reducers
│   │   ├── selectors/    # Redux selectors
│   │   └── slices/       # Redux Toolkit slices
│   ├── services/         # API and third-party service integrations
│   └── utils/            # Utility functions and helpers
├── .env                  # Environment variables
├── package.json          # NPM dependencies and scripts
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file
4. Start the development server:
   ```
   npm run dev
   ```

### Building for Production

```
npm run build
```

### Deployment

The application is configured for deployment on Vercel and Firebase Hosting.

## Features In Detail

### Dark/Light Mode

The application supports both dark and light themes, respecting user preferences while providing a comfortable viewing experience in any lighting condition.

### Responsive Design

All components are fully responsive, providing an optimal experience on devices of all sizes from mobile to desktop.

### Real-time Data

Integration with WebSockets and external API services provides real-time market data, transaction updates, and notifications.

### Security Features

- JWT-based authentication flow
- Protected routes for authenticated areas
- User permission levels
- Secure API communication

### Performance Optimization

- Code splitting and lazy loading
- Caching strategies
- Optimized image loading
- Minimized bundle size

## Backend Integration

This frontend application communicates with a Node.js/Express backend server that provides:

- RESTful API endpoints
- Database connectivity
- Business logic processing
- External service integrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

[License Information]

## Contact

For inquiries and support, please contact support@fidelityfirstbrokers.com
