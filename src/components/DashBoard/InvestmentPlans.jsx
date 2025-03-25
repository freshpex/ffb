import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChartLine, 
  FaInfoCircle, 
  FaExclamationCircle, 
  FaLock, 
  FaSpinner,
  FaArrowDown
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import Button from "../common/Button";
import Alert from "../common/Alert";
import InvestmentPlanCard from "./InvestmentPlanCard";
import InvestmentHistoryCard from "./InvestmentHistoryCard";
import InvestmentModal from "./InvestmentModal";
import InvestmentSuccessModal from "./InvestmentSuccessModal";
import {
  fetchInvestmentPlans,
  selectInvestmentPlans,
  selectUserInvestments,
  selectInvestmentModal,
  selectSuccessModal,
  selectInvestmentStatus,
  selectInvestmentError,
  openInvestmentModal,
  closeInvestmentModal,
  closeSuccessModal
} from "../../redux/slices/investmentSlice";

const InvestmentPlans = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const plans = useSelector(selectInvestmentPlans);
  const userInvestments = useSelector(selectUserInvestments);
  const { open: isModalOpen, planId } = useSelector(selectInvestmentModal);
  const { open: isSuccessModalOpen, investmentId } = useSelector(selectSuccessModal);
  const status = useSelector(selectInvestmentStatus);
  const error = useSelector(selectInvestmentError);
  
  // Local state
  const [activeTab, setActiveTab] = useState("plans"); // "plans" | "investments"
  const [alert, setAlert] = useState(null);
  
  // Fetch plans on component mount
  useEffect(() => {
    if (plans.length === 0) {
      dispatch(fetchInvestmentPlans());
    }
  }, [dispatch, plans.length]);
  
  // Dismiss alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  // Get the selected plan data
  const selectedPlan = plans.find(plan => plan.id === planId);
  
  // Get success investment data
  const successInvestment = userInvestments.find(inv => inv.id === investmentId);
  
  const handleInvest = (planId) => {
    dispatch(openInvestmentModal(planId));
  };
  
  const handleModalClose = () => {
    dispatch(closeInvestmentModal());
  };
  
  const handleSuccessModalClose = () => {
    dispatch(closeSuccessModal());
  };
  
  const renderContent = () => {
    if (status === 'loading' && plans.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <FaSpinner size={40} className="text-primary-500" />
          </motion.div>
          <p className="text-gray-300">Loading investment plans...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 mt-6 text-center">
          <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-medium text-red-300 mb-2">Failed to load investment plans</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <Button
            onClick={() => dispatch(fetchInvestmentPlans())}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    if (activeTab === "plans") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {plans.map((plan) => (
            <InvestmentPlanCard
              key={plan.id}
              plan={plan}
              onInvest={handleInvest}
            />
          ))}
        </div>
      );
    }
    
    if (activeTab === "investments") {
      return userInvestments.length > 0 ? (
        <div className="space-y-6 mt-6">
          {userInvestments.map((investment) => (
            <InvestmentHistoryCard
              key={investment.id}
              investment={investment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 mt-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center text-gray-500">
            <FaChartLine size={24} />
          </div>
          <h3 className="text-xl font-medium text-gray-200 mb-2">No active investments</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start your investment journey by exploring our investment plans. Diversify your portfolio and grow your wealth with us.
          </p>
          <Button onClick={() => setActiveTab("plans")}>
            View Investment Plans
          </Button>
        </div>
      );
    }
  };
  
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Investment Plans</h1>
          
          <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "plans"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("plans")}
            >
              Available Plans
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "investments"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("investments")}
            >
              My Investments
            </button>
          </div>
        </div>

        {/* Info box at the top */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mr-4 text-primary-500 flex-shrink-0 mb-4 md:mb-0">
              <FaInfoCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Investing with Fidelity First Brokers</h3>
              <p className="text-gray-300 mb-3">
                Our investment plans offer a range of opportunities to grow your wealth. Choose from various risk levels and investment durations that suit your financial goals. All investments are managed by our team of experienced financial advisors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center bg-gray-700/50 rounded p-2">
                  <FaLock className="text-green-400 mr-2" />
                  <span className="text-gray-200">Secure investments</span>
                </div>
                <div className="flex items-center bg-gray-700/50 rounded p-2">
                  <FaChartLine className="text-blue-400 mr-2" />
                  <span className="text-gray-200">Competitive returns</span>
                </div>
                <div className="flex items-center bg-gray-700/50 rounded p-2">
                  <FaArrowDown className="text-purple-400 mr-2" />
                  <span className="text-gray-200">Low minimum deposits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onDismiss={() => setAlert(null)}
            className="mb-6"
          />
        )}
        
        {renderContent()}
      </motion.div>
      
      {/* Investment modal */}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        plan={selectedPlan}
      />
      
      {/* Success modal */}
      <InvestmentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        investment={successInvestment}
      />
    </DashboardLayout>
  );
};

export default InvestmentPlans;
