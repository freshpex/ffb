import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaWallet, 
  FaExchangeAlt, 
  FaUserAlt, 
  FaSignOutAlt, 
  FaTimes, 
  FaChevronDown, 
  FaChevronRight, 
  FaHome, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaUsers, 
  FaBookOpen,
  FaCreditCard,
  FaQuestionCircle,
  FaTachometerAlt
} from 'react-icons/fa';
import { toggleSidebar } from '../../redux/slices/layoutSlice';
import { selectUserProfile, selectUserName, selectUserBalance, fetchUserProfile, selectUserLoading, selectUserEmail } from '../../redux/slices/userSlice';
import { useAuth } from '../AuthPage/AuthContext';

// Navigation item groups with nested routes
const navigationGroups = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: <FaTachometerAlt />, 
        path: '/login/dashboardpage',
        badge: 'New'
      },
      { 
        id: 'invest', 
        label: 'Invest', 
        icon: <FaChartLine />, 
        path: '/login/investmentplans' 
      },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    items: [
      { 
        id: 'deposit', 
        label: 'Deposit', 
        icon: <FaMoneyBillWave />, 
        path: '/login/deposit' 
      },
      { 
        id: 'withdraw', 
        label: 'Withdraw', 
        icon: <FaWallet />, 
        path: '/login/withdraw' 
      },
      { 
        id: 'cards', 
        label: 'Cards', 
        icon: <FaCreditCard />, 
        path: '/login/cards',
        badge: 'Beta'
      }
    ]
  },
  {
    id: 'trading',
    label: 'Trading',
    items: [
      { 
        id: 'trading', 
        label: 'Trading Terminal', 
        icon: <FaExchangeAlt />, 
        path: '/login/trading' 
      },
      { 
        id: 'tradingplatform', 
        label: 'Advanced Platform', 
        icon: <FaChartBar />, 
        path: '/login/tradingplatform',
        badge: 'Pro'
      }
    ]
  },
  {
    id: 'other',
    label: 'Other',
    items: [
      { 
        id: 'education', 
        label: 'Education', 
        icon: <FaBookOpen />, 
        path: '/login/education' 
      },
      { 
        id: 'referral', 
        label: 'Refer & Earn', 
        icon: <FaUsers />, 
        path: '/login/referral' 
      },
      { 
        id: 'account', 
        label: 'Account Settings', 
        icon: <FaUserAlt />, 
        path: '/login/accountsettings' 
      }
    ]
  }
];

const DashboardSidebar = ({ isMobile }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const userProfile = useSelector(selectUserProfile);
  const userName = useSelector(selectUserName);
  const userBalance = useSelector(selectUserBalance);
  const user = useSelector(state => state.user.profile);
  const userEmail = useSelector(selectUserEmail);
  const isLoading = useSelector(selectUserLoading);
  
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Initialize expanded groups
  useEffect(() => {
    const initialExpanded = {};
    navigationGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => location.pathname === item.path);
      initialExpanded[group.id] = !isMobile || hasActiveItem;
    });
    setExpandedGroups(initialExpanded);
  }, [location.pathname, isMobile]);
  
  // Toggle group expansion
  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const items = [];
    
    navigationGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.label.toLowerCase().includes(query)) {
          items.push(item);
        }
      });
    });
    
    setFilteredItems(items);
  }, [searchQuery]);
  
  // Handle navigation item click
  const handleNavItemClick = (path) => {
    if (isMobile) {
      dispatch(toggleSidebar(false));
    }
  };
  
  // Check if a navigation item is active
  const isItemActive = (path) => {
    return location.pathname === path;
  };
  
  // Render navigation item
  const renderNavItem = (item) => {
    const active = isItemActive(item.path);
    
    return (
      <li key={item.id}>
        <Link
          to={item.path}
          onClick={() => handleNavItemClick(item.path)}
          className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
            active 
              ? 'bg-primary-700 text-white shadow-lg shadow-primary-700/30' 
              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
          }`}
        >
          <span className={`${active ? 'text-white' : 'text-gray-400'} mr-3`}>
            {item.icon}
          </span>
          <span className="flex-grow truncate">{item.label}</span>
          
          {item.badge && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 ${
              item.badge === 'New' ? 'bg-green-500 text-white' :
              item.badge === 'Pro' ? 'bg-purple-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };
  
  const handleCloseSidebar = () => {
    if (isMobile) {
      dispatch(toggleSidebar(false));
    }
  };
  
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);
  
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ duration: 0.2 }}
      className={`fixed lg:relative z-30 w-64 h-full bg-gray-800 flex-shrink-0 shadow-xl overflow-hidden flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <Link to="/login/dashboardpage" className="flex items-center">
          <img 
            src="/favicon.ico" 
            alt="Fidelity First Bank" 
            className="h-8 w-8 mr-2"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Fidelity First</h1>
            <span className="text-xs text-primary-400">Wealth Management</span>
          </div>
        </Link>
        
        {isMobile && (
          <button 
            onClick={handleCloseSidebar}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>
      
      {/* User Profile in Sidebar */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold">
            {(userName?.charAt(0)) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium text-white truncate">
              {userName || 'User Name'}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {user && user.email}
            </p>
          </div>
        </div>
        
        <div className="mt-3 bg-gray-700/50 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Account Balance</span>
            <span className="text-xs text-gray-400">+3.5%</span>
          </div>
          <div className="text-white font-bold">${userBalance}</div>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="flex-shrink-0 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            className="w-full bg-gray-700/50 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Search Results Dropdown */}
          {showSearch && filteredItems.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
              <ul>
                {filteredItems.map(item => (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        handleNavItemClick(item.path);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center px-4 py-2 w-full text-left text-sm hover:bg-gray-600"
                    >
                      <span className="text-gray-400 mr-3">{item.icon}</span>
                      <span className="text-white">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-grow overflow-y-auto py-2 px-3 space-y-1">
        {navigationGroups.map(group => (
          <div key={group.id} className="mb-3">
            <button
              onClick={() => toggleGroupExpansion(group.id)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <span>{group.label}</span>
              <span className="text-xs">
                {expandedGroups[group.id] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </button>
            
            <AnimatePresence>
              {expandedGroups[group.id] && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {group.items.map(item => renderNavItem(item))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
