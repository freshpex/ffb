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
const ReferralProgram = lazy(() => import("./components/DashBoard/ReferralProgram"));
const EducationCenter = lazy(() => import("./components/DashBoard/EducationCenter"));
const ATMCardsPage = lazy(() => import("./components/DashBoard/ATMCards/ATMCardsPage"));
const CardDetailsPage = lazy(() => import("./components/DashBoard/ATMCards/CardDetailsPage"));
const Tradingplatform = lazy(() => import("./components/DashBoard/TradingPlatform"));

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

            {/* Protected Dashboard routes*/}
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
            <Route path="/login/referral" element={
              <ProtectedRoute>
                <ReferralProgram />
              </ProtectedRoute>
            } />
            <Route path="/login/education" element={
              <ProtectedRoute>
                <EducationCenter />
              </ProtectedRoute>
            } />
            <Route path="/login/cards" element={
              <ProtectedRoute>
                <ATMCardsPage />
              </ProtectedRoute>
            } />
            <Route path="/login/cards/:cardId" element={
              <ProtectedRoute>
                <CardDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/login/tradingplatform" element={
              <ProtectedRoute>
                <Tradingplatform />
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
