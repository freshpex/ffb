import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaIdCard,
  FaLock,
  FaHistory,
  FaEdit,
  FaArrowLeft,
  FaUserCheck,
  FaBan,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import {
  fetchUserById,
  updateUser,
  selectSelectedUser,
  selectUsersStatus,
  selectUserActionStatus,
  selectUsersError,
} from "../../redux/slices/adminUsersSlice";
import { selectAdmin } from "../../redux/slices/adminAuthSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  hasAdminPermission,
  canModifyUser as checkCanModifyUser,
} from "../../utils/adminAuthUtils";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import StatusBadge from "./common/StatusBadge";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();

  const user = useSelector(selectSelectedUser);
  const status = useSelector(selectUsersStatus);
  const actionStatus = useSelector(selectUserActionStatus);
  const error = useSelector(selectUsersError);
  const adminUser = useSelector(selectAdmin);

  const [activeTab, setActiveTab] = useState("profile");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [permissionError, setPermissionError] = useState(null);

  // Check if current admin has permission to modify this user
  const canModifyUser = () => {
    if (!user || !adminUser) return false;

    return checkCanModifyUser(user, adminUser);
  };

  useEffect(() => {
    document.title = "User Details | Admin Dashboard";
    if (userId) {
      dispatch(fetchUserById(userId));
    }

    // Reset error message when component unmounts
    return () => {
      setPermissionError(null);
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      // Extract the error message appropriately
      const errorMsg =
        typeof error === "string"
          ? error
          : error.message || "An error occurred";

      // Check if it's a permission error
      if (
        errorMsg.includes("forbidden") ||
        errorMsg.includes("superadmin") ||
        errorMsg.includes("permission")
      ) {
        setPermissionError(`Permission denied: ${errorMsg}`);
      }
    }
  }, [error]);

  const handleStatusChange = async () => {
    // Validate permissions first to avoid a 403 error
    if (!canModifyUser()) {
      setPermissionError("You do not have permission to modify this user.");
      setShowStatusModal(false);
      return;
    }

    try {
      await dispatch(
        updateUser({
          userId,
          userData: {
            status: newStatus,
            statusNote,
          },
        }),
      ).unwrap();
      setShowStatusModal(false);
      setPermissionError(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      setPermissionError(
        error.toString().includes("superadmin")
          ? "Permission denied: Only superadmins can modify admin users"
          : `Failed to update status: ${error}`,
      );
    }
  };

  // Format date to local format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency with commas and two decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (status === "loading") {
    return <ComponentLoader height="500px" message="Loading user details..." />;
  }

  if (!user) {
    return (
      <div
        className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <FaExclamationTriangle
          className={`mx-auto h-12 w-12 mb-4 ${darkMode ? "text-yellow-500" : "text-yellow-400"}`}
        />
        <h3
          className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          User not found
        </h3>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          The user you are looking for does not exist or was removed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back to Users
          </button>
        </div>
      </div>
    );
  }

  // Show a prominent permission warning if this user is an admin/superadmin and the current user can't modify them
  const showPermissionWarning =
    (user.role === "admin" || user.role === "superadmin") && !canModifyUser();

  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              User Details
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              View and manage user information
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/admin/users")}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <Link
              to={`/admin/users/${user._id || user.id}/edit`}
              className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium ${
                !canModifyUser()
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
              onClick={(e) => {
                if (!canModifyUser()) {
                  e.preventDefault();
                  setPermissionError(
                    "You do not have permission to edit this user.",
                  );
                }
              }}
            >
              <FaEdit className="mr-2" /> Edit User
            </Link>
          </div>
        </div>

        {/* Permission Error Alert */}
        {permissionError && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode
                ? "bg-red-900/20 text-red-400 border border-red-900/50"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-start">
              <FaExclamationTriangle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Permission Error</h3>
                <p className="mt-1 text-sm">{permissionError}</p>
                <button
                  className="mt-2 text-sm underline"
                  onClick={() => setPermissionError(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permission Warning for Admin Users */}
        {showPermissionWarning && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode
                ? "bg-yellow-900/20 text-yellow-400 border border-yellow-900/50"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            <div className="flex items-start">
              <FaInfoCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium">Limited Access</h3>
                <p className="mt-1 text-sm">
                  This is an {user.role} user. You do not have sufficient
                  permissions to modify this user. Only superadmins can modify
                  admin accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Header Card */}
        <div
          className={`mb-6 rounded-lg overflow-hidden ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white shadow-md"
          }`}
        >
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="h-20 w-20 rounded-full overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || ""}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${(user.fullName || "").replace(" ", "+")}&size=80&background=0D8ABC&color=fff`;
                      }}
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center text-2xl font-semibold ${
                        darkMode
                          ? "bg-gray-700 text-primary-400"
                          : "bg-gray-200 text-primary-600"
                      }`}
                    >
                      {user.fullName && user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h2
                      className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {user.fullName}
                      {user.role === "admin" && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Admin
                        </span>
                      )}
                      {user.role === "superadmin" && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          Superadmin
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-wrap items-center mt-1 text-sm">
                      <span
                        className={`inline-flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <FaEnvelope className="mr-1" />
                        {user.email}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span
                        className={`inline-flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <FaIdCard className="mr-1" />
                        {user.accountNumber}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                    <StatusBadge status={user.status} size="large" />
                    <button
                      onClick={() => {
                        if (!canModifyUser()) {
                          setPermissionError(
                            "You do not have permission to change this user's status.",
                          );
                          return;
                        }
                        setNewStatus(user.status);
                        setShowStatusModal(true);
                      }}
                      className={`text-xs px-2 py-1 rounded ${
                        !canModifyUser()
                          ? `cursor-not-allowed opacity-50 ${darkMode ? "text-gray-500" : "text-gray-400"}`
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-500 hover:bg-gray-100"
                      }`}
                      disabled={!canModifyUser()}
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Account Type
                    </p>
                    <p
                      className={`mt-1 ${darkMode ? "text-white" : "text-gray-900"} font-medium capitalize`}
                    >
                      {user.userType || "Basic"}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Balance
                    </p>
                    <p
                      className={`mt-1 font-medium ${
                        user.balance > 0
                          ? "text-green-500"
                          : user.balance < 0
                            ? "text-red-500"
                            : darkMode
                              ? "text-white"
                              : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(user.balance)}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      KYC Status
                    </p>
                    <div className="mt-1 flex items-center">
                      {user.kycVerified ? (
                        <span className="inline-flex items-center text-green-500">
                          <FaCheck className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-500">
                          <FaExclamationTriangle className="mr-1" /> Not
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "profile"
                    ? darkMode
                      ? "border-b-2 border-primary-500 text-primary-500"
                      : "border-b-2 border-primary-600 text-primary-600"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <FaUser className="inline mr-2" /> Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "security"
                    ? darkMode
                      ? "border-b-2 border-primary-500 text-primary-500"
                      : "border-b-2 border-primary-600 text-primary-600"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <FaLock className="inline mr-2" /> Security
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "transactions"
                    ? darkMode
                      ? "border-b-2 border-primary-500 text-primary-500"
                      : "border-b-2 border-primary-600 text-primary-600"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <FaHistory className="inline mr-2" /> Transactions
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div
          className={`rounded-lg ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white shadow-md"
          } p-6`}
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3
                className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Contact Details
                  </h4>
                  <div
                    className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-4`}
                  >
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Full Name
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {user.fullName}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Email Address
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Phone Number
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Country
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {user.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4
                    className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Account Details
                  </h4>
                  <div
                    className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-4`}
                  >
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Account Number
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {user.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Account Type
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"} capitalize`}
                      >
                        {user.userType}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Created At
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Last Activity
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4
                  className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Administrative Actions
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (!canModifyUser()) {
                        setPermissionError(
                          "You do not have permission to change this user's status.",
                        );
                        return;
                      }
                      setNewStatus("active");
                      setShowStatusModal(true);
                    }}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      !canModifyUser()
                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                        : darkMode
                          ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    disabled={!canModifyUser()}
                  >
                    <FaUserCheck className="mr-2" /> Activate
                  </button>
                  <button
                    onClick={() => {
                      if (!canModifyUser()) {
                        setPermissionError(
                          "You do not have permission to change this user's status.",
                        );
                        return;
                      }
                      setNewStatus("suspended");
                      setShowStatusModal(true);
                    }}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      !canModifyUser()
                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                        : darkMode
                          ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                    disabled={!canModifyUser()}
                  >
                    <FaBan className="mr-2" /> Suspend
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3
                className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Security Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Account Security
                  </h4>
                  <div
                    className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-4`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p
                          className={`${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Email Verification
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          User's email address verification status
                        </p>
                      </div>
                      <div>
                        {user.emailVerified ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <FaCheck className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <FaTimes className="mr-1" /> Not Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p
                          className={`${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Two-Factor Authentication
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Additional security for account access
                        </p>
                      </div>
                      <div>
                        {user.twoFactorEnabled ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <FaCheck className="mr-1" /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                            <FaTimes className="mr-1" /> Disabled
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p
                          className={`${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          KYC Verification
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Identity verification status
                        </p>
                      </div>
                      <div>
                        {user.kycVerified ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <FaCheck className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <FaTimes className="mr-1" /> Not Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4
                    className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Account Activity
                  </h4>
                  <div
                    className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-4`}
                  >
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Last Login
                      </p>
                      <p
                        className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatDate(user.lastLogin)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Account Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={user.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4
                  className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Security Actions
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (!canModifyUser()) {
                        setPermissionError(
                          "You do not have permission to perform this action.",
                        );
                        return;
                      }
                      // Would typically show a modal to confirm and send password reset
                      alert(
                        "Password reset functionality would be implemented here.",
                      );
                    }}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      !canModifyUser()
                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                        : darkMode
                          ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                    disabled={!canModifyUser()}
                  >
                    <FaLock className="mr-2" /> Reset Password
                  </button>
                  <button
                    onClick={() => {
                      if (!canModifyUser()) {
                        setPermissionError(
                          "You do not have permission to perform this action.",
                        );
                        return;
                      }
                      // Would typically toggle 2FA status
                      alert(
                        "2FA toggle functionality would be implemented here.",
                      );
                    }}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      !canModifyUser()
                        ? "bg-gray-400 cursor-not-allowed opacity-60"
                        : darkMode
                          ? "bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                    disabled={!canModifyUser()}
                  >
                    {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3
                  className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Recent Transactions
                </h3>
                <Link
                  to={`/admin/transactions?userId=${user._id || user.id}`}
                  className="text-primary-500 hover:text-primary-600 text-sm"
                >
                  View All
                </Link>
              </div>

              {user.recentActivity &&
              user.recentActivity.transactions &&
              user.recentActivity.transactions.length > 0 ? (
                <div
                  className={`rounded-lg overflow-hidden ${
                    darkMode
                      ? "border border-gray-700"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead
                        className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}
                      >
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {user.recentActivity.transactions.map((transaction) => (
                          <tr
                            key={transaction._id}
                            className={
                              darkMode
                                ? "hover:bg-gray-700/30"
                                : "hover:bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                              {transaction.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={
                                  transaction.type === "deposit"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {transaction.type === "deposit" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={transaction.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(transaction.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    No recent transactions found for this user.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Change User Status
                </h3>

                {showPermissionWarning && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      darkMode
                        ? "bg-yellow-900/20 text-yellow-400 border border-yellow-900/50"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <FaInfoCircle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                      <p className="text-sm">
                        Warning: This is an {user.role} user. Only superadmins
                        can modify admin accounts.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border`}
                    disabled={!canModifyUser()}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending_verification">
                      Pending Verification
                    </option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Note (Optional)
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border`}
                    rows="3"
                    placeholder="Add a note about this status change..."
                    disabled={!canModifyUser()}
                  ></textarea>
                </div>
              </div>

              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  darkMode
                    ? "border-t border-gray-700"
                    : "border-t border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={actionStatus === "loading" || !canModifyUser()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === "loading" || !canModifyUser()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === "loading"
                    ? "Updating..."
                    : "Confirm Change"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  disabled={actionStatus === "loading"}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode
                      ? "border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default UserDetail;
