import { useState, useEffect } from "react";
import { UserAuth } from "../AuthPage/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "/src/css/dashboard.css";
import "/src/css/tradingDashboard.css";
import { 
  FaUser, FaUserTie, FaCaretDown, FaSignOutAlt, FaHistory, 
  FaBars, FaTimes, FaWallet, FaPlusCircle, FaMinusCircle,
  FaHome, FaCog, FaChartLine, FaRegCalendarAlt, FaBell
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TradingViewWidget from "./TradingViewWidget";
import AdvancedTradingView from "./AdvancedTradingView";
import DashBoardData from "./DashBoardData";
import MarketOverview from "./MarketOverview";
import MarketPulse from "./MarketPulse";
import MarketNews from "./MarketNews";
import FinancialHighlights from "./FinancialHighlights";
import Loader from "../Loader";

const DashBoardPage = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showComponent, setShowComponent] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [userDropdownActive, setUserDropdownActive] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [useAdvancedChart, setUseAdvancedChart] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Check if the current path matches a given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    // Simulate loading delay
    const delay = 2000;
    const preloaderTimeout = setTimeout(() => {
      setIsLoading(false);
      setShowComponent(true);
    }, delay);

    // Clean up
    return () => clearTimeout(preloaderTimeout);
  }, []);

  // Handle window resize and mobile sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      if (window.innerWidth > 992) {
        setMobileActive(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (windowWidth <= 992) {
      setMobileActive(!mobileActive);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (windowWidth <= 992) {
      setMobileActive(false);
    }
  };

  const toggleUserDropdown = () => {
    setUserDropdownActive(!userDropdownActive);
    if (notificationsActive) setNotificationsActive(false);
  };

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive);
    if (userDropdownActive) setUserDropdownActive(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Mobile overlay*/}
      <AnimatePresence>
        {mobileActive && (
          <motion.div 
            className={`mobile-overlay ${mobileActive ? 'active' : ''}`}
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileActive ? 'mobile-active' : ''}`}>
          <div className="sidebar-logo">
            <Link to="/" className="link">
              <h1>FFB</h1>
              <p>Fidelity First Brokers</p>
            </Link>
          </div>
          
          <div className="sidebar-user">
            <div className="user-avatar">
              <FaUserTie />
            </div>
            <div className="user-info">
              <div className="user-email">{user?.email || 'user@example.com'}</div>
              <div className="user-balance">$0.00</div>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li className="nav-item">
                <Link 
                  to="/login/dashboardpage" 
                  className={`nav-link ${isActive('/login/dashboardpage') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/dashboardpage')}
                >
                  <FaHome />
                  <span className="nav-link-text">Dashboard</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/deposit" 
                  className={`nav-link ${isActive('/login/deposit') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/deposit')}
                >
                  <FaPlusCircle />
                  <span className="nav-link-text">Deposit</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/withdraw" 
                  className={`nav-link ${isActive('/login/withdraw') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/withdraw')}
                >
                  <FaMinusCircle />
                  <span className="nav-link-text">Withdraw</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/deposittransaction" 
                  className={`nav-link ${isActive('/login/deposittransaction') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/deposittransaction')}
                >
                  <FaHistory />
                  <span className="nav-link-text">Deposit History</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/withdrawtransaction" 
                  className={`nav-link ${isActive('/login/withdrawtransaction') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/withdrawtransaction')}
                >
                  <FaHistory />
                  <span className="nav-link-text">Withdraw History</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/accountsettings" 
                  className={`nav-link ${isActive('/login/accountsettings') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/accountsettings')}
                >
                  <FaCog />
                  <span className="nav-link-text">Account Settings</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span className="nav-link-text">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="dashboard-content">
          <header className="dashboard-header">
            <button 
              className="toggle-sidebar-btn" 
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {mobileActive ? <FaTimes /> : <FaBars />}
            </button>
            
            <div className="header-actions">
              <div className="header-user-info">
                Welcome, {user?.email?.split('@')[0] || 'User'}
              </div>
              
              <button 
                className="header-action-btn" 
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <FaBell />
                <span className="notification-badge"></span>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsActive && (
                    <motion.div 
                      className="header-dropdown active"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="dropdown-item">
                        <p>You have no notifications</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              <div className="header-user" onClick={toggleUserDropdown}>
                <div className="header-user-avatar">
                  <FaUser />
                </div>
                <FaCaretDown />
                
                {/* User dropdown */}
                <AnimatePresence>
                  {userDropdownActive && (
                    <motion.div 
                      className="header-dropdown active"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Link to="/login/accountsettings" className="dropdown-item">
                        <FaCog />
                        <span>Account Settings</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
          
          <div className="content-wrapper">
            {/* Trading Widget with toggle option */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Market Chart</h2>
                <button 
                  onClick={() => setUseAdvancedChart(!useAdvancedChart)}
                  className="view-all-btn"
                >
                  {useAdvancedChart ? "Simple View" : "Advanced View"}
                </button>
              </div>
              <div className="trading-widget-container" style={{ height: useAdvancedChart ? '600px' : '400px' }}>
                {useAdvancedChart ? <AdvancedTradingView /> : <TradingViewWidget />}
              </div>
            </div>
            
            {/* Market Pulse */}
            <MarketPulse />
            
            {/* Market Overview */}
            <MarketOverview />
            
            {/* Market News Feed */}
            <MarketNews />
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="stat-icon balance">
                  <FaWallet />
                </div>
                <div className="stat-info">
                  <h3>$0.00</h3>
                  <p>Account Balance</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="stat-icon earnings">
                  <FaChartLine />
                </div>
                <div className="stat-info">
                  <h3>$0.00</h3>
                  <p>Total Earnings</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-icon date">
                  <FaRegCalendarAlt />
                </div>
                <div className="stat-info">
                  <h3>{new Date().toLocaleDateString()}</h3>
                  <p>Registered Date</p>
                </div>
              </motion.div>
            </div>
            
            {/* Financial Highlights */}
            <FinancialHighlights />
            
            {/* Recent Transactions */}
            <DashBoardData />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
