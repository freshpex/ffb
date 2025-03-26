import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserPlus,
  FaUsers,
  FaMoneyBillWave,
  FaLink,
  FaClipboard,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaTelegram,
  FaCheck,
  FaCopy,
  FaRedo,
  FaChartLine,
  FaSyncAlt,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaPercent
} from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';
import Button from '../common/Button';
import Alert from '../common/Alert';
import {
  fetchReferrals,
  fetchCommissionHistory,
  generateNewReferralLink,
  selectReferrals,
  selectCommissionHistory,
  selectReferralLink,
  selectReferralCode,
  selectReferralStatistics,
  selectReferralStatus,
  selectReferralError
} from '../../redux/slices/referralSlice';

const ReferralProgram = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const referrals = useSelector(selectReferrals);
  const commissionHistory = useSelector(selectCommissionHistory);
  const referralLink = useSelector(selectReferralLink);
  const referralCode = useSelector(selectReferralCode);
  const statistics = useSelector(selectReferralStatistics);
  const status = useSelector(selectReferralStatus);
  const error = useSelector(selectReferralError);
  
  // Local state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'referrals', 'commissions'
  const [showStats, setShowStats] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [emailInput, setEmailInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [shareDropdown, setShareDropdown] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchReferrals());
    dispatch(fetchCommissionHistory());
  }, [dispatch]);
  
  // Hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // Filter referrals based on search query and status filter
  const filteredReferrals = referrals.filter(referral => {
    const matchesQuery = searchQuery
      ? referral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesStatus = statusFilter !== 'all'
      ? referral.status === statusFilter
      : true;
      
    return matchesQuery && matchesStatus;
  });
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        setAlertMessage({
          type: 'error',
          message: 'Failed to copy link: ' + err.message
        });
        setShowAlert(true);
      });
  };
  
  const handleGenerateNewLink = () => {
    dispatch(generateNewReferralLink());
    setAlertMessage({
      type: 'success',
      message: 'New referral link generated successfully!'
    });
    setShowAlert(true);
  };
  
  const handleSendInvite = (e) => {
    e.preventDefault();
    
    if (!emailInput || !emailInput.includes('@')) {
      setAlertMessage({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      setShowAlert(true);
      return;
    }
    
    // In a real app, this would make an API call to send an invitation
    // For now, just show a success message
    setAlertMessage({
      type: 'success',
      message: `Invitation sent to ${emailInput}`
    });
    setShowAlert(true);
    setEmailInput('');
  };
  
  const handleShare = (platform) => {
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on Fidelity First Brokers and get exclusive trading benefits!')}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Join me on Fidelity First Brokers: ${referralLink}`)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on Fidelity First Brokers and get exclusive trading benefits!')}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareDropdown(false);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Render statistics cards
  const renderStatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Referrals */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Total Referrals</div>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <FaUsers size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{statistics.totalReferrals}</div>
        <div className="mt-2 text-sm text-gray-400">
          <span className="text-blue-400">{statistics.activeReferrals} active</span> referrals
        </div>
      </div>
      
      {/* Total Commission */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Total Commission</div>
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <FaMoneyBillWave size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{formatCurrency(statistics.totalCommission)}</div>
        <div className="mt-2 text-sm text-gray-400">
          Lifetime earnings
        </div>
      </div>
      
      {/* Pending Commission */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Pending Commission</div>
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
            <FaRegClock size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{formatCurrency(statistics.pendingCommission)}</div>
        <div className="mt-2 text-sm text-gray-400">
          Processing soon
        </div>
      </div>
      
      {/* Conversion Rate */}
      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">Conversion Rate</div>
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <FaPercent size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{statistics.conversionRate}%</div>
        <div className="mt-2 text-sm text-gray-400">
          Registration to activation
        </div>
      </div>
    </div>
  );
  
  // Render referral link section
  const renderReferralLinkSection = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Your Referral Link</h3>
          <p className="text-gray-400 text-sm">
            Share this link with friends and earn up to 10% commission on their trading activity
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleGenerateNewLink}
          className="whitespace-nowrap"
        >
          <FaRedo className="mr-2" /> Generate New Link
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="flex-1 relative w-full">
          <div className="bg-gray-700 py-3 px-4 rounded-lg text-gray-300 border border-gray-600 w-full overflow-hidden overflow-ellipsis whitespace-nowrap pr-10">
            {referralLink}
          </div>
          <button
            onClick={handleCopyReferralLink}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaClipboard />}
          </button>
        </div>
        
        <div className="relative">
          <Button
            onClick={() => setShareDropdown(!shareDropdown)}
            className="flex items-center"
          >
            <FaLink className="mr-2" /> Share
            <FaChevronDown className="ml-2" />
          </Button>
          
          {shareDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
              <div className="p-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  <FaFacebook className="mr-3 text-blue-500" /> Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  <FaTwitter className="mr-3 text-blue-400" /> Twitter
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  <FaWhatsapp className="mr-3 text-green-500" /> WhatsApp
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  <FaLinkedin className="mr-3 text-blue-600" /> LinkedIn
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                >
                  <FaTelegram className="mr-3 text-blue-500" /> Telegram
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-600 flex items-center">
          <div className="mr-3 text-gray-400">
            <FaClipboard />
          </div>
          <div>
            <div className="text-xs text-gray-400">Your Referral Code</div>
            <div className="text-white font-medium">{referralCode}</div>
          </div>
        </div>
        
        <form onSubmit={handleSendInvite} className="flex-1 flex gap-3 w-full">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter friend's email"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
          />
          <Button type="submit">
            <FaEnvelope className="mr-2" /> Invite
          </Button>
        </form>
      </div>
    </div>
  );
  
  // Render referral program info
  const renderReferralInfo = () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <h3 className="text-lg font-medium text-white mb-4">How the Referral Program Works</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="w-12 h-12 flex items-center justify-center bg-primary-500/20 rounded-full mb-3 text-primary-400">
            <FaUserPlus size={20} />
          </div>
          <h4 className="text-white font-medium mb-2">Invite Friends</h4>
          <p className="text-gray-400 text-sm">Share your unique referral link or code with friends interested in trading.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="w-12 h-12 flex items-center justify-center bg-primary-500/20 rounded-full mb-3 text-primary-400">
            <FaUsers size={20} />
          </div>
          <h4 className="text-white font-medium mb-2">Friends Sign Up</h4>
          <p className="text-gray-400 text-sm">Your friends register using your link and start trading on the platform.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-lg">
          <div className="w-12 h-12 flex items-center justify-center bg-primary-500/20 rounded-full mb-3 text-primary-400">
            <FaMoneyBillWave size={20} />
          </div>
          <h4 className="text-white font-medium mb-2">Earn Commissions</h4>
          <p className="text-gray-400 text-sm">Earn up to 10% commission on their trading fees and deposits for 12 months.</p>
        </div>
      </div>
    </div>
  );
  
  // Render the referrals tab content
  const renderReferralsTab = () => (
    <div>
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="registered">Registered</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                      />
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
                    <select
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-200"
                    >
                      <option value="date-desc">Date (Newest First)</option>
                      <option value="date-asc">Date (Oldest First)</option>
                      <option value="commission-desc">Commission (Highest First)</option>
                      <option value="commission-asc">Commission (Lowest First)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      fullWidth
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name / Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-white">{referral.name}</div>
                          <div className="text-sm text-gray-400">{referral.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(referral.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${referral.status === 'active' ? 'bg-green-100 text-green-800' : 
                          referral.status === 'registered' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
                      {formatCurrency(referral.commission)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <FaUsers className="text-4xl mb-4 text-gray-500" />
                      <p className="text-lg font-medium">No referrals found</p>
                      <p className="text-sm mt-1">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'Start sharing your referral link to invite friends'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  // Render the commissions tab content
  const renderCommissionsTab = () => (
    <div>
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Commission History</h3>
          <Button variant="outline" size="sm">
            <FaFileDownload className="mr-2" /> Export
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Referral
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {commissionHistory.length > 0 ? (
                commissionHistory.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{commission.referralName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(commission.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${commission.type === 'deposit' ? 'bg-blue-100 text-blue-800' : 
                          commission.type === 'trading' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {commission.type.charAt(0).toUpperCase() + commission.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${commission.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-white">
                      {formatCurrency(commission.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <FaMoneyBillWave className="text-4xl mb-4 text-gray-500" />
                      <p className="text-lg font-medium">No commission history</p>
                      <p className="text-sm mt-1">
                        Commission will be recorded here when your referrals start trading
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <FaUserPlus className="mr-3 text-primary-500" /> Referral Program
          </h1>
          
          <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "referrals"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("referrals")}
            >
              My Referrals
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === "commissions"
                  ? "bg-primary-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("commissions")}
            >
              Commissions
            </button>
          </div>
        </div>
        
        {/* Show alert if needed */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Alert
                type={alertMessage.type}
                message={alertMessage.message}
                onDismiss={() => setShowAlert(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Display tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStatisticsCards()}
              {renderReferralLinkSection()}
              {renderReferralInfo()}
            </motion.div>
          )}
          
          {activeTab === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderReferralsTab()}
            </motion.div>
          )}
          
          {activeTab === 'commissions' && (
            <motion.div
              key="commissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCommissionsTab()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default ReferralProgram;
