import { useState, useEffect } from "react";
import { UserAuth } from "../AuthPage/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUser, FaUserTie, FaCaretDown, FaSignOutAlt, FaHistory, 
  FaBars, FaTimes, FaPlusCircle, FaMinusCircle,
  FaHome, FaCog, FaBell, FaChartLine, FaMoneyBillWave,
  FaKey, FaExchangeAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import "/src/css/dashboard.css";
import TouchSidebarHandler from './TouchSidebarHandler';

const DashboardLayout = ({ children }) => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [userDropdownActive, setUserDropdownActive] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Check if the current path matches a given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      if (window.innerWidth > 992) {
        setMobileActive(false); // Auto-close mobile sidebar on larger screens
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

  const openSidebar = () => {
    if (windowWidth <= 992) {
      setMobileActive(true);
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

  return (
    <>
      {/* Touch handler for swipe gestures */}
      <TouchSidebarHandler 
        onOpenSidebar={openSidebar}
        onCloseSidebar={closeSidebar}
        isOpen={mobileActive}
      />
      
      {/* Mobile overlay - clicking it closes the sidebar */}
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
                  to="/login/trading" 
                  className={`nav-link ${isActive('/login/trading') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/trading')}
                >
                  <FaExchangeAlt />
                  <span className="nav-link-text">Trading</span>
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
                  to="/login/investmentplans" 
                  className={`nav-link ${isActive('/login/investmentplans') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/investmentplans')}
                >
                  <FaChartLine />
                  <span className="nav-link-text">Investment Plans</span>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/login/api-keys" 
                  className={`nav-link ${isActive('/login/api-keys') ? 'active' : ''}`}
                  onClick={() => navigateTo('/login/api-keys')}
                >
                  <FaKey />
                  <span className="nav-link-text">API Keys</span>
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
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;
