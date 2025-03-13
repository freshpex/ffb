import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthContextProvider } from "./components/AuthPage/AuthContext";
import ProtectedRoute from "./components/AuthPage/ProtectedRoute";
import Loader from "./components/Loader";
import FloatingActionButton from "./components/FloatingActionButton";

// Lazy-loaded components
const HomePage = lazy(() => import("./components/LandingPage/Home"));
const AboutPage = lazy(() => import("./components/About/AboutPage"));
const ContactPage = lazy(() => import("./components/ContactPage/ContactPage"));
const Login = lazy(() => import("./components/AuthPage/Login"));
const SignUp = lazy(() => import("./components/AuthPage/SignUp"));
const ServicePage = lazy(() => import("./components/ServicesPage/ServicePage"));
const PricingPage = lazy(() => import("./components/PricingPage/PricingPage"));
const DashBoardPage = lazy(() => import("./components/DashBoard/DashBoardPage"));
const Deposit = lazy(() => import("./components/DashBoard/Deposit"));
const Withdraw = lazy(() => import("./components/DashBoard/Withdraw"));
const DepositTransaction = lazy(() => import("./components/DashBoard/DepositTransaction"));
const WithdrawTransaction = lazy(() => import("./components/DashBoard/WithdrawTransaction"));
const AccountSettings = lazy(() => import("./components/DashBoard/AccountSettings"));
const InvestmentPlans = lazy(() => import("./components/DashBoard/InvestmentPlans"));
const TradingDashboard = lazy(() => import("./components/DashBoard/TradingDashboard"));

// Error page
const ErrorPage = lazy(() => import("./components/ErrorPage"));

function App() {
  return (
    <>
      <AuthContextProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Dashboard routes */}
            <Route path="/login/dashboardpage" element={
              <ProtectedRoute>
                <DashBoardPage />
              </ProtectedRoute>
            } />
            <Route path="/login/deposit" element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            } />
            <Route path="/login/withdraw" element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            } />
            <Route path="/login/deposittransaction" element={
              <ProtectedRoute>
                <DepositTransaction />
              </ProtectedRoute>
            } />
            <Route path="/login/withdrawtransaction" element={
              <ProtectedRoute>
                <WithdrawTransaction />
              </ProtectedRoute>
            } />
            <Route path="/login/accountsettings" element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } />
            <Route path="/login/investmentplans" element={
              <ProtectedRoute>
                <InvestmentPlans />
              </ProtectedRoute>
            } />
            <Route path="/login/trading" element={
              <ProtectedRoute>
                <TradingDashboard />
              </ProtectedRoute>
            } />

            {/* Error route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </AuthContextProvider>
      <FloatingActionButton />
    </>
  );
}

export default App;
