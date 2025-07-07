import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthContextProvider } from "./components/AuthPage/AuthContext";
import ProtectedRoute from "./components/AuthPage/ProtectedRoute";
import VisitorTracker from './components/VisitorTracker';
import Loader from "./components/Loader";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/LandingPage/Home"));
const AboutPage = lazy(() => import("./pages/About/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"));
const Login = lazy(() => import("./components/AuthPage/Login"));
const SignUp = lazy(() => import("./components/AuthPage/SignUp"));
const ServicePage = lazy(() => import("./pages/ServicesPage/ServicePage"));
const PricingPage = lazy(() => import("./pages/PricingPage/PricingPage"));
const DashBoardPage = lazy(
  () => import("./components/DashBoard/DashBoardPage"),
);
const Deposit = lazy(
  () => import("./components/DashBoard/Transaction/Deposit"),
);
const Withdraw = lazy(
  () => import("./components/DashBoard/Transaction/Withdraw"),
);
const TaskDashboard = lazy(
  () => import("./components/DashBoard/Tasks/TaskDashboard"),
);
const DepositTransaction = lazy(
  () => import("./components/DashBoard/Transaction/DepositTransaction"),
);
const WithdrawTransaction = lazy(
  () => import("./components/DashBoard/Transaction/WithdrawTransaction"),
);
const AccountSettings = lazy(
  () => import("./components/DashBoard/Settings/AccountSettings"),
);
const InvestmentPlans = lazy(
  () => import("./components/DashBoard/Investment/InvestmentPlans"),
);
const ReferralProgram = lazy(
  () => import("./components/DashBoard/ReferralProgram"),
);
const EducationCenter = lazy(
  () => import("./components/DashBoard/EducationCenter"),
);
const ATMCardsPage = lazy(
  () => import("./components/DashBoard/ATMCards/ATMCardsPage"),
);
const CardRequestsList = lazy(
  () => import("./components/DashBoard/ATMCards/CardRequestsList"),
);
const CardDetailsPage = lazy(
  () => import("./components/DashBoard/ATMCards/CardDetailsPage"),
);
const Tradingplatform = lazy(
  () => import("./components/trading/TradingPlatform"),
);
const TradingDashboard = lazy(
  () => import("./components/trading/TradingDashboard"),
);

// Legal pages
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Admin components
const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./components/Admin/AdminUsers"));
const UserDetail = lazy(() => import("./components/Admin/UserDetail"));
const UserEdit = lazy(() => import("./components/Admin/UserEdit"));
const AdminTransactions = lazy(
  () => import("./components/Admin/AdminTransactions"),
);
const TransactionDetail = lazy(
  () => import("./components/Admin/TransactionDetail"),
);
const AdminKyc = lazy(() => import("./components/Admin/AdminKyc"));
const KycDetail = lazy(() => import("./components/Admin/KycDetail"));
const AdminSupport = lazy(() => import("./components/Admin/AdminSupport"));
const SupportTicketDetail = lazy(
  () => import("./components/Admin/SupportTicketDetail"),
);
const AdminSettings = lazy(() => import("./components/Admin/AdminSettings"));
const AdminNotifications = lazy(
  () => import("./components/Admin/AdminNotifications"),
);
const AdminProfile = lazy(() => import("./components/Admin/AdminProfile"));
const AnalyticsOverview = lazy(
  () => import("./components/Admin/analytics/AnalyticsOverview"),
);
const TransactionAnalytics = lazy(
  () => import("./components/Admin/analytics/TransactionAnalytics"),
);
const UserGrowthAnalytics = lazy(
  () => import("./components/Admin/analytics/UserGrowthAnalytics"),
);
const PerformanceAnalytics = lazy(
  () => import("./components/Admin/analytics/PerformanceAnalytics"),
);
const FinancialAnalytics = lazy(
  () => import("./components/Admin/analytics/FinancialAnalytics"),
);
const AdminATMCardsPage = lazy(
  () => import("./components/Admin/ATMCards/AdminATMCardsPage"),
);
const VisitorAnalytics = lazy(
  () => import("./components/Admin/analytics/VisitorAnalytics"),
);

// Error page
const ErrorPage = lazy(() => import("./components/ErrorPage"));

// Admin protected route component
const AdminProtectedRoute = lazy(
  () => import("./components/Admin/AdminProtectedRoute"),
);

function App() {
  return (
    <AuthContextProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Protected Dashboard routes*/}
          <Route
            path="/login/dashboardpage"
            element={
              <ProtectedRoute>
                <DashBoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/tasks"
            element={
              <ProtectedRoute>
                <TaskDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/deposittransaction"
            element={
              <ProtectedRoute>
                <DepositTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/withdrawtransaction"
            element={
              <ProtectedRoute>
                <WithdrawTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/accountsettings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/investmentplans"
            element={
              <ProtectedRoute>
                <InvestmentPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/trading"
            element={
              <ProtectedRoute>
                <TradingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/referral"
            element={
              <ProtectedRoute>
                <ReferralProgram />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/education"
            element={
              <ProtectedRoute>
                <EducationCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/cards"
            element={
              <ProtectedRoute>
                <ATMCardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/cards/requests"
            element={
              <ProtectedRoute>
                <CardRequestsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/cards/:cardId"
            element={
              <ProtectedRoute>
                <CardDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login/tradingplatform"
            element={
              <ProtectedRoute>
                <Tradingplatform />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Analytics routes */}
            <Route path="analytics" element={<AnalyticsOverview />} />
            <Route
              path="analytics/transactions"
              element={<TransactionAnalytics />}
            />
            <Route
              path="analytics/financial"
              element={<FinancialAnalytics />}
            />
            <Route path="analytics/users" element={<UserGrowthAnalytics />} />
            <Route
              path="analytics/performance"
              element={<PerformanceAnalytics />}
            />
            <Route
              path="analytics/visitors"
              element={<VisitorAnalytics />}
            />

            {/* User management routes */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="users/:userId/edit" element={<UserEdit />} />

            {/* User Cards Approval Page  */}
            <Route path="cards" element={<AdminATMCardsPage />} />

            {/* Transaction management routes */}
            <Route path="transactions" element={<AdminTransactions />} />
            <Route
              path="transactions/:transactionId"
              element={<TransactionDetail />}
            />

            {/* KYC management routes */}
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="kyc/:requestId" element={<KycDetail />} />

            {/* Support ticket management routes */}
            <Route path="support" element={<AdminSupport />} />
            <Route path="support/:ticketId" element={<SupportTicketDetail />} />

            {/* Admin settings and profile routes */}
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Error route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <VisitorTracker />
      </Suspense>
    </AuthContextProvider>
  );
}

export default App;
