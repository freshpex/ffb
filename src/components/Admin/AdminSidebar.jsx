import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaExchangeAlt, 
  FaTicketAlt, 
  FaIdCard, 
  FaCog, 
  FaBell, 
  FaUserCircle,
  FaChartLine,
  FaAngleDown,
  FaAngleUp,
  FaChartPie,
  FaChartBar,
  FaDollarSign,
  FaHome,
  FaCreditCard
} from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const AdminSidebar = ({ isOpen, isMinimized, toggleSidebar }) => {
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const sidebarRef = useRef();
  
  // Track expanded state for menu items with submenus
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: false
  });
  
  const toggleExpanded = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  // Check if a route is active
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  // Check if a submenu should be expanded (if any path in the submenu is active)
  useEffect(() => {
    if (location.pathname.includes('/admin/analytics')) {
      setExpandedMenus(prev => ({ ...prev, analytics: true }));
    }
  }, [location.pathname]);
  
  // Handle clicks outside the sidebar (for mobile view)
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    }

    // Only attach listener if sidebar is open and we're on mobile
    if (isOpen && window.innerWidth < 1024) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);
  
const sidebarItems = [
    {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: FaTachometerAlt
    },
    {
        name: 'Analytics',
        icon: FaChartLine,
        hasSubmenu: true,
        menu: 'analytics',
        subItems: [
            {
                name: 'Overview',
                path: '/admin/analytics',
                icon: FaChartPie
            },
            {
                name: 'Transactions',
                path: '/admin/analytics/transactions',
                icon: FaExchangeAlt
            },
            {
                name: 'User Growth',
                path: '/admin/analytics/users',
                icon: FaUsers
            },
            {
                name: 'Performance',
                path: '/admin/analytics/performance',
                icon: FaChartBar
            },
            {
                name: 'Financial',
                path: '/admin/analytics/financial',
                icon: FaDollarSign
            },
        ]
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: FaUsers
    },
    {
      name: 'ATM Cards',
      path: '/admin/cards',
      icon: FaCreditCard
    },
    {
        name: 'Transactions',
        path: '/admin/transactions',
        icon: FaExchangeAlt
    },
    {
        name: 'KYC Verification',
        path: '/admin/kyc',
        icon: FaIdCard
    },
    {
        name: 'Support Tickets',
        path: '/admin/support',
        icon: FaTicketAlt
    },
    {
        name: 'Settings',
        path: '/admin/settings',
        icon: FaCog
    },
    {
        name: 'Notifications',
        path: '/admin/notifications',
        icon: FaBell
    },
    {
        name: 'My Profile',
        path: '/admin/profile',
        icon: FaUserCircle
    }
];
  
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          darkMode
            ? 'bg-gray-900 border-r border-gray-800'
            : 'bg-white border-r border-gray-200'
        }`}
        style={{ width: isMinimized ? '5rem' : '240px' }}
      >
        <div className="flex flex-col h-full">
          <div className={`h-16 flex items-center ${isMinimized ? 'justify-center' : 'px-4'} border-b border-gray-200 dark:border-gray-800`}>
            <Link to="/admin" className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
                FF
              </div>
              {!isMinimized && (
                <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Admin Panel
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  {item.hasSubmenu ? (
                    <div className="mb-2">
                      <button
                        onClick={() => toggleExpanded(item.menu)}
                        className={`flex items-center w-full ${isMinimized ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-md ${
                          expandedMenus[item.menu]
                            ? darkMode
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-100 text-gray-900'
                            : darkMode
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={isMinimized ? item.name : ''}
                      >
                        <item.icon className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
                        {!isMinimized && (
                          <>
                            <span className="flex-1 text-left">{item.name}</span>
                            {expandedMenus[item.menu] ? (
                              <FaAngleUp className="h-4 w-4" />
                            ) : (
                              <FaAngleDown className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </button>
                      
                      {expandedMenus[item.menu] && !isMinimized && (
                        <ul className="mt-1 pl-8 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                to={subItem.path}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                  isActive(subItem.path)
                                    ? darkMode
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-primary-50 text-primary-700'
                                    : darkMode
                                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <subItem.icon className="h-4 w-4 mr-3" />
                                <span>{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center ${isMinimized ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? darkMode
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-50 text-primary-700'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      title={isMinimized ? item.name : ''}
                    >
                      <item.icon className={`h-5 w-5 ${isMinimized ? '' : 'mr-3'}`} />
                      {!isMinimized && <span>{item.name}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
