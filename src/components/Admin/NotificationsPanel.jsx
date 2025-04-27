import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  selectAdminNotifications,
  selectAdminNotificationStatus,
  selectAdminNotificationError,
  selectUnreadCount,
} from "../../redux/slices/adminNotificationSlice";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    if (!notification.read) {
      onRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <div className="bg-green-700/20 p-2 rounded-full text-green-500">
            <FaCheck />
          </div>
        );
      case "warning":
        return (
          <div className="bg-yellow-700/20 p-2 rounded-full text-yellow-500">
            <FaExclamationCircle />
          </div>
        );
      case "error":
        return (
          <div className="bg-red-700/20 p-2 rounded-full text-red-500">
            <FaTimes />
          </div>
        );
      case "transaction":
        return (
          <div className="bg-blue-700/20 p-2 rounded-full text-blue-500">
            <FaCheck />
          </div>
        );
      case "kyc":
        return (
          <div className="bg-purple-700/20 p-2 rounded-full text-purple-500">
            <FaCheck />
          </div>
        );
      case "support":
        return (
          <div className="bg-teal-700/20 p-2 rounded-full text-teal-500">
            <FaCheck />
          </div>
        );
      default:
        return (
          <div className="bg-gray-700/20 p-2 rounded-full text-gray-500">
            <FaBell />
          </div>
        );
    }
  };

  return (
    <div
      className={`flex items-start p-3 border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer ${!notification.read ? "bg-gray-800/40" : ""}`}
      onClick={handleNotificationClick}
    >
      <div className="mr-3">{getIcon()}</div>
      <div className="flex-grow">
        <div className="flex justify-between">
          <h4
            className={`font-medium ${!notification.read ? "text-blue-400" : "text-gray-300"}`}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500">
            {format(new Date(notification.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
      </div>
      <button
        className="p-1 text-gray-500 hover:text-red-500 transition ml-2"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification._id);
        }}
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
};

const NotificationsPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const panelRef = useRef(null);
  const notifications = useSelector(selectAdminNotifications);
  const status = useSelector(selectAdminNotificationStatus);
  const error = useSelector(selectAdminNotificationError);
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAdminNotifications());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    // Handle clicking outside the panel to close it
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/50 overflow-auto">
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full md:w-96 bg-gray-900 shadow-xl overflow-hidden flex flex-col"
        style={{ maxWidth: "100%" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="font-bold text-lg text-gray-100">Notifications</h3>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                className="px-2 py-1 text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                onClick={handleMarkAllAsRead}
              >
                <FaCheckDouble size={14} />
                <span>Mark all as read</span>
              </button>
            )}
            <button
              className="text-gray-400 hover:text-white transition"
              onClick={onClose}
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {status === "loading" && (
            <div className="p-4 text-center text-gray-400">
              <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
              Loading notifications...
            </div>
          )}

          {status === "failed" && (
            <div className="p-4 text-center text-red-400">
              <FaExclamationCircle className="mx-auto mb-2" size={24} />
              {error || "Failed to load notifications"}
            </div>
          )}

          {status === "succeeded" && notifications.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              <FaBell className="mx-auto mb-2" size={24} />
              No notifications yet
            </div>
          )}

          {status === "succeeded" &&
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            ))}
        </div>

        <div className="p-3 border-t border-gray-700 text-center">
          <button
            className="text-gray-400 hover:text-blue-400 transition text-sm"
            onClick={() => {
              onClose();
              // Navigate to full notifications page
              window.location.href = "/admin/notifications";
            }}
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
