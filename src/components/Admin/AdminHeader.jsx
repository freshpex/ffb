import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaCog,
} from "react-icons/fa";
import { logoutAdmin } from "../../redux/slices/adminAuthSlice";
import {
  fetchAdminNotifications,
  selectUnreadCount,
} from "../../redux/slices/adminNotificationSlice";
import NotificationsPanel from "./NotificationsPanel";

const AdminHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadNotificationsCount = useSelector(selectUnreadCount);
  const { admin } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    dispatch(fetchAdminNotifications({ limit: 1 }));
    console.log("Admin notification", dispatch(fetchAdminNotifications({ limit: 1 })));

    // Set up polling every 2 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchAdminNotifications({ limit: 1 }));
    }, 120000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    window.location.href = "/admin/login";
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      // Fetch latest notifications when opening panel
      dispatch(fetchAdminNotifications());
    }
  };

  return (
    <header className="bg-gray-900 shadow-md py-3 px-4 fixed w-full z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center">
          <div className="relative ml-3">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
            >
              <FaBell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            <NotificationsPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Profile dropdown */}
          <div className="relative ml-3">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Open user menu</span>
              <FaUser className="h-5 w-5 mr-2" />
              <span className="hidden md:block">{admin?.name || "Admin"}</span>
            </button>

            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUser className="mr-2 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaCog className="mr-2 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="mr-2 text-gray-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
