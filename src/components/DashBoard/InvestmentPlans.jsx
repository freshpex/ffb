import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvestmentPlans,
  fetchUserInvestments,
  setSelectedPlan,
  selectInvestmentStatus,
  selectInvestmentError,
  cancelInvestment,
  withdrawInvestment
} from '../../redux/slices/investmentSlice';
import { selectUserBalance } from '../../redux/slices/userSlice';
import DashboardLayout from './DashboardLayout';
import InvestmentPlanCard from './InvestmentPlanCard';
import InvestmentHistoryCard from './InvestmentHistoryCard';
import InvestmentModal from './InvestmentModal';
import InvestmentSuccessModal from './InvestmentSuccessModal';
import ComponentLoader from '../common/ComponentLoader';
import InfoCard from '../common/InfoCard';
import {
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaAngleRight,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaPercent,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';
import Tabs from '../common/Tabs';
import { 
  selectInvestmentPlans, 
  selectActiveInvestments, 
  selectHistoryInvestments,
  selectInvestmentStatistics 
} from '../../redux/selectors/selectors';

const InvestmentPlans = () => {
  const dispatch = useDispatch();
  const plans = useSelector(selectInvestmentPlans);
  console.log("Plans", plans);
  const activeInvestments = useSelector(selectActiveInvestments);
  const historyInvestments = useSelector(selectHistoryInvestments);
  console.log("History", historyInvestments);
  const status = useSelector(selectInvestmentStatus);
  const error = useSelector(selectInvestmentError);
  const stats = useSelector(selectInvestmentStatistics);
  const balance = useSelector(selectUserBalance);
  
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [riskFilter, setRiskFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  
  useEffect(() => {
    dispatch(fetchInvestmentPlans());
    dispatch(fetchUserInvestments());
  }, [dispatch]);
  
  const handlePlanClick = (plan) => {
    setSelectedPlanForModal(plan);
    setShowInvestModal(true);
  };
  
  const handleCloseInvestModal = () => {
    setShowInvestModal(false);
    setSelectedPlanForModal(null);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleCancelInvestment = async (investmentId) => {
    if (window.confirm('Are you sure you want to cancel this investment? You will not receive any returns.')) {
      try {
        await dispatch(cancelInvestment(investmentId));
      } catch (error) {
        console.error('Failed to cancel investment:', error);
      }
    }
  };
  
  const handleWithdrawInvestment = async (investmentId) => {
    if (window.confirm('Are you sure you want to withdraw from this investment? Returns will be pro-rated based on time invested.')) {
      try {
        await dispatch(withdrawInvestment(investmentId));
      } catch (error) {
        console.error('Failed to withdraw from investment:', error);
      }
    }
  };
  
  // Filter and sort plans
  const filteredAndSortedPlans = [...plans]
    .filter(plan => {
      if (riskFilter === 'all') return true;
      return plan.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    })
    .filter(plan => {
      if (durationFilter === 'all') return true;
      switch (durationFilter) {
        case 'short': return plan.duration <= 30;
        case 'medium': return plan.duration > 30 && plan.duration <= 90;
        case 'long': return plan.duration > 90;
        default: return true;
      }
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'roi':
          comparison = a.roi - b.roi;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'minAmount':
          comparison = a.minAmount - b.minAmount;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Investment Plans</h1>
        
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-primary-900/30 p-3 rounded-full mr-4">
                <FaMoneyBillWave className="text-primary-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-xl font-bold text-gray-100">${stats.totalInvested?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-green-900/30 p-3 rounded-full mr-4">
                <FaChartLine className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Returns</p>
                <p className="text-xl font-bold text-green-500">+${stats.totalReturns?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                <FaPercent className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average ROI</p>
                <p className="text-xl font-bold text-blue-500">{stats.averageROI?.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="bg-purple-900/30 p-3 rounded-full mr-4">
                <FaClock className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Investments</p>
                <p className="text-xl font-bold text-purple-500">{stats?.activeInvestments}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs
          tabs={[
            { id: 'plans', label: 'Investment Plans', icon: <FaChartLine className="mr-2" /> },
            { id: 'active', label: 'Active Investments', icon: <FaMoneyBillWave className="mr-2" />, count: activeInvestments?.length },
            { id: 'history', label: 'Investment History', icon: <FaCalendarAlt className="mr-2" />, count: historyInvestments?.length }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {status === 'loading' && !plans.length ? (
          <ComponentLoader text="Loading investment data..." />
        ) : error ? (
          <InfoCard
            icon={<FaExclamationTriangle className="text-red-500" size={24} />}
            title="Error loading investment data"
            message={error}
            type="error"
          />
        ) : (
          <>
            {/* Investment Plans Tab */}
            {activeTab === 'plans' && (
              <div className="mt-6">
                {/* Filters and Sorting */}
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                      <FaFilter className="text-gray-400 mr-2" />
                      <select
                        className="bg-transparent text-gray-300 focus:outline-none"
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                        <option value="very high">Very High Risk</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <select
                        className="bg-transparent text-gray-300 focus:outline-none"
                        value={durationFilter}
                        onChange={(e) => setDurationFilter(e.target.value)}
                      >
                        <option value="all">All Durations</option>
                        <option value="short">Short Term (≤ 30 days)</option>
                        <option value="medium">Medium Term (31-90 days)</option>
                        <option value="long">Long Term (&gt; 90 days)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    {sortDirection === 'asc' ? (
                      <FaSortAmountUp className="text-gray-400 mr-2" />
                    ) : (
                      <FaSortAmountDown className="text-gray-400 mr-2" />
                    )}
                    <select
                      className="bg-transparent text-gray-300 focus:outline-none"
                      value={sortField}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="roi">Sort by ROI</option>
                      <option value="duration">Sort by Duration</option>
                      <option value="minAmount">Sort by Minimum Amount</option>
                    </select>
                  </div>
                </div>
                
                {/* Investment Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedPlans.map((plan) => (
                    <InvestmentPlanCard
                      key={plan.id}
                      plan={plan}
                      userBalance={balance}
                      onClick={() => handlePlanClick(plan)}
                    />
                  ))}
                </div>
                
                {filteredAndSortedPlans.length === 0 && (
                  <InfoCard
                    icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
                    title="No plans found"
                    message="No investment plans match your current filters."
                    type="warning"
                  />
                )}
              </div>
            )}
            
            {/* Active Investments Tab */}
            {activeTab === 'active' && (
              <div className="mt-6">
                {activeInvestments.length === 0 ? (
                  <InfoCard
                    icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
                    title="No active investments"
                    message="You don't have any active investments. Start investing to grow your capital!"
                    type="warning"
                    action={{
                      label: "Explore Investment Plans",
                      onClick: () => setActiveTab('plans')
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {activeInvestments.map((investment) => (
                      <InvestmentHistoryCard
                        key={investment.id}
                        investment={investment}
                        type="active"
                        onCancel={() => handleCancelInvestment(investment.id)}
                        onWithdraw={() => handleWithdrawInvestment(investment.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Investment History Tab */}
            {activeTab === 'history' && (
              <div className="mt-6">
                {historyInvestments.length === 0 ? (
                  <InfoCard
                    icon={<FaExclamationTriangle className="text-yellow-500" size={24} />}
                    title="No investment history"
                    message="You don't have any completed or cancelled investments yet."
                    type="warning"
                  />
                ) : (
                  <div className="space-y-4">
                    {historyInvestments.map((investment) => (
                      <InvestmentHistoryCard
                        key={investment.id}
                        investment={investment}
                        type="history"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Investment Modal */}
      {showInvestModal && selectedPlanForModal && (
        <InvestmentModal
          plan={selectedPlanForModal}
          onClose={handleCloseInvestModal}
          userBalance={balance}
        />
      )}
      
      {/* Success Modal is handled by the InvestmentSuccessModal component that listens to the redux state */}
      <InvestmentSuccessModal />
    </DashboardLayout>
  );
};

export default InvestmentPlans;
