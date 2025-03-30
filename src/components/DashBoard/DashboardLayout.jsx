import { useState, useEffect } from "react";
import { UserAuth } from "../AuthPage/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUser, FaUserTie, FaCaretDown, FaSignOutAlt, FaHistory, 
  FaBars, FaTimes, FaPlusCircle, FaMinusCircle,
  FaHome, FaCog, FaBell, FaChartLine, FaMoneyBillWave,
  FaKey, FaExchangeAlt, FaCreditCard
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
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
      {/* Touch handler for swipe gestures*/}
      <TouchSidebarHandler 
        onOpenSidebar={openSidebar}
        onCloseSidebar={closeSidebar}
        isOpen={mobileActive}
      />
      
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileActive && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:static h-full z-40 bg-gray-800 transition-all duration-300 ease-in-out 
            ${sidebarCollapsed ? 'w-20' : 'w-64'} 
            ${mobileActive ? 'left-0' : '-left-64 lg:left-0'}`}
        >
          <div className="p-4 flex items-center justify-center lg:justify-start border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">FFB</h1>
              {!sidebarCollapsed && 
                <p className="ml-2 text-sm hidden lg:block text-gray-400">Fidelity First Brokers</p>
              }
            </Link>
          </div>
          
          <div className={`p-4 border-b border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`${sidebarCollapsed ? 'flex flex-col items-center' : 'flex items-center'}`}>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-primary-500">
                <FaUserTie size={20} />
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <div className="text-sm font-medium truncate max-w-[180px]">{user?.email || 'user@example.com'}</div>
                  <div className="text-xs text-gray-400">$0.00</div>
                </div>
              )}
            </div>
          </div>
          
          <nav className="mt-4 px-2">
            <ul className="space-y-1">
              <NavItem 
                to="/login/dashboardpage" 
                icon={<FaHome />} 
                label="Dashboard"
                isActive={isActive('/login/dashboardpage')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/dashboardpage')}
              />
              
              <NavItem 
                to="/login/trading" 
                icon={<FaExchangeAlt />} 
                label="Trading"
                isActive={isActive('/login/trading')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/trading')}
              />
              
              <NavItem 
                to="/login/deposit" 
                icon={<FaPlusCircle />} 
                label="Deposit"
                isActive={isActive('/login/deposit')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/deposit')}
              />
              
              <NavItem 
                to="/login/withdraw" 
                icon={<FaMinusCircle />} 
                label="Withdraw"
                isActive={isActive('/login/withdraw')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/withdraw')}
              />
              
              <NavItem 
                to="/login/deposittransaction" 
                icon={<FaHistory />} 
                label="Deposit History"
                isActive={isActive('/login/deposittransaction')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/deposittransaction')}
              />
              
              <NavItem 
                to="/login/withdrawtransaction" 
                icon={<FaHistory />} 
                label="Withdraw History"
                isActive={isActive('/login/withdrawtransaction')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/withdrawtransaction')}
              />
              
              <NavItem 
                to="/login/investmentplans" 
                icon={<FaChartLine />} 
                label="Investment Plans"
                isActive={isActive('/login/investmentplans')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/investmentplans')}
              />
              
              <NavItem 
                to="/login/accountsettings" 
                icon={<FaCog />} 
                label="Account Settings"
                isActive={isActive('/login/accountsettings')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/accountsettings')}
              />

              <NavItem 
                to="/login/cards" 
                icon={<FaCreditCard />} 
                label="Payment Cards"
                isActive={isActive('/login/cards')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/cards')}
              />

              <NavItem 
                to="/login/tradingplatform" 
                icon={<FaChartLine />} 
                label="Trading Platform"
                isActive={isActive('/login/tradingplatform')}
                collapsed={sidebarCollapsed}
                onClick={() => navigateTo('/login/tradingplatform')}
              />
              
              <li>
                <button 
                  onClick={handleLogout}
                  className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-700 text-gray-300 hover:text-white`}
                >
                  <FaSignOutAlt className="flex-shrink-0" />
                  {!sidebarCollapsed && <span className="ml-3">Logout</span>}
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-800 border-b border-gray-700 py-4 px-4 sm:px-6 flex items-center">
            <button 
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {mobileActive ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-300">
                Welcome, {user?.email?.split('@')[0] || 'User'}
              </div>
              
              <div className="relative">
                <button 
                  className="p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <FaBell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                </button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsActive && (
                    <motion.div 
                      className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-3 px-4 border-b border-gray-700">
                        <p className="text-sm text-gray-400">You have no notifications</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative">
                <button 
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <FaUser size={14} />
                  </div>
                  <FaCaretDown className="hidden sm:block" size={14} />
                </button>
                
                {/* User dropdown */}
                <AnimatePresence>
                  {userDropdownActive && (
                    <motion.div 
                      className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        <Link 
                          to="/login/accountsettings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <FaCog className="mr-2" size={14} />
                          <span>Account Settings</span>
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <FaSignOutAlt className="mr-2" size={14} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto bg-gray-900 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

// Extracted NavItem component for reusability
const NavItem = ({ to, icon, label, isActive, collapsed, onClick }) => {
  return (
    <li>
      <Link 
        to={to} 
        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-primary-900/50 text-primary-500' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        onClick={onClick}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;
