import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  selectNotifications,
  selectUnreadCount,
  selectNotificationLoading,
  selectNotificationError,
} from "../../../redux/slices/notificationSlice";
import { FaBell, FaCheck, FaTrash, FaCheckDouble } from "react-icons/fa";
import Loader from "../../common/Loader";

const NotificationsPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isOpen]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const filteredNotifications =
    selectedTab === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md ml-auto bg-white dark:bg-gray-800 h-full shadow-xl flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white flex items-center">
            <FaBell className="mr-2" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {unreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="flex border-b dark:border-gray-700">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              selectedTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setSelectedTab("all")}
          >
            All
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              selectedTab === "unread"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setSelectedTab("unread")}
          >
            Unread
          </button>
        </div>

        <div className="p-2 flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm flex items-center text-blue-500 hover:text-blue-600 mr-2"
            disabled={isLoading || unreadCount === 0}
          >
            <FaCheckDouble className="mr-1" /> Mark all as read
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center flex-grow">
            <Loader />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex-grow overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                {selectedTab === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </div>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification.id || notification._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(
                                notification.id || notification._id,
                              )
                            }
                            className="text-blue-500 hover:text-blue-600"
                            title="Mark as read"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(
                              notification.id || notification._id,
                            )
                          }
                          className="text-red-500 hover:text-red-600"
                          title="Delete notification"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
