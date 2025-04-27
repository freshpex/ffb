import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaCheck,
  FaCalendarAlt,
  FaExclamationCircle,
  FaUser,
  FaTag,
  FaFilter,
  FaComment,
  FaArrowRight,
} from "react-icons/fa";
import {
  fetchSupportTickets,
  selectSupportTickets,
  selectSupportPagination,
  selectSupportStatus,
} from "../../redux/slices/adminSupportSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import Pagination from "./common/Pagination";
import StatusBadge from "./common/StatusBadge";
import SearchFilter from "./common/SearchFilter";

const AdminSupport = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();

  const tickets = useSelector(selectSupportTickets);
  const pagination = useSelector(selectSupportPagination);
  const status = useSelector(selectSupportStatus);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const isLoading = status === "loading";

  useEffect(() => {
    document.title = "Support Tickets | Admin Dashboard";
    loadTickets();
  }, [page, limit]);

  const loadTickets = () => {
    dispatch(fetchSupportTickets({ page, limit }));
  };

  const handleSearch = ({ searchTerm, filters }) => {
    setPage(1); // Reset to first page when applying new search/filters

    dispatch(
      fetchSupportTickets({
        page: 1,
        limit,
        search: searchTerm,
        status: filters.status,
        priority: filters.priority,
      }),
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Define status filter options
  const statusFilterOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "responded", label: "Responded" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  // Define priority filter options
  const priorityFilterOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Format date to local format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate time elapsed since a date
  const timeElapsed = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHr / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;

    return formatDate(dateString);
  };

  // Get priority color class
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          bg: darkMode ? "bg-red-900/30" : "bg-red-100",
          text: "text-red-600 dark:text-red-400",
        };
      case "high":
        return {
          bg: darkMode ? "bg-orange-900/30" : "bg-orange-100",
          text: "text-orange-600 dark:text-orange-400",
        };
      case "medium":
        return {
          bg: darkMode ? "bg-yellow-900/30" : "bg-yellow-100",
          text: "text-yellow-600 dark:text-yellow-400",
        };
      case "low":
      default:
        return {
          bg: darkMode ? "bg-green-900/30" : "bg-green-100",
          text: "text-green-600 dark:text-green-400",
        };
    }
  };

  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Support Tickets
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Manage and respond to customer support inquiries
          </p>
        </div>

        <SearchFilter
          onSearch={handleSearch}
          searchPlaceholder="Search by ticket ID, subject or user..."
          filters={[
            {
              id: "status",
              label: "Status",
              options: statusFilterOptions,
              placeholder: "All Statuses",
            },
            {
              id: "priority",
              label: "Priority",
              options: priorityFilterOptions,
              placeholder: "All Priorities",
            },
          ]}
          className="mb-6"
        />

        {isLoading ? (
          <ComponentLoader
            height="400px"
            message="Loading support tickets..."
          />
        ) : (
          <div>
            <div
              className={`rounded-lg overflow-hidden ${
                darkMode
                  ? "border border-gray-700"
                  : "border border-gray-200 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2
                  className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Support Tickets
                </h2>
                <div className="flex items-center space-x-2">
                  <label
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Show:
                  </label>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className={`rounded-md text-sm ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? "bg-gray-700/30" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ticket Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p
                              className={`text-lg font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              No tickets found
                            </p>
                            <p
                              className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Try adjusting your search or filter to find what
                              you're looking for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className={
                            darkMode
                              ? "hover:bg-gray-700/30"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/admin/support/${ticket.id}`}
                              className="block"
                            >
                              <div className="text-sm font-medium truncate max-w-xs">
                                {ticket.subject}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                #{ticket.ticketNumber} •{" "}
                                {timeElapsed(ticket.createdAt)}
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`h-8 w-8 rounded-full mr-2 flex items-center justify-center ${
                                  darkMode ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              >
                                <FaUser
                                  className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                />
                              </div>
                              <div>
                                <div className="text-sm">
                                  {ticket.user.fullName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {ticket.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                            >
                              <FaTag className="mr-1 h-3 w-3" />{" "}
                              {ticket.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority).bg} ${getPriorityColor(ticket.priority).text}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={ticket.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {timeElapsed(
                              ticket.lastUpdated || ticket.createdAt,
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/support/${ticket.id}`}
                                className={`p-1.5 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                }`}
                                title="View Ticket"
                              >
                                <FaEye size={14} />
                              </Link>
                              {(ticket.status === "open" ||
                                ticket.status === "in_progress") && (
                                <Link
                                  to={`/admin/support/${ticket.id}?action=respond`}
                                  className={`p-1.5 rounded-full ${
                                    darkMode
                                      ? "bg-gray-700 text-green-400 hover:bg-gray-600"
                                      : "bg-green-50 text-green-600 hover:bg-green-100"
                                  }`}
                                  title="Respond to Ticket"
                                >
                                  <FaComment size={14} />
                                </Link>
                              )}
                              {ticket.status !== "closed" &&
                                ticket.status !== "resolved" && (
                                  <Link
                                    to={`/admin/support/${ticket.id}?action=resolve`}
                                    className={`p-1.5 rounded-full ${
                                      darkMode
                                        ? "bg-gray-700 text-purple-400 hover:bg-gray-600"
                                        : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                                    }`}
                                    title="Resolve Ticket"
                                  >
                                    <FaCheck size={14} />
                                  </Link>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalTickets}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>

            {/* Tickets Statistics */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Support Ticket Overview
                </h3>
                <Link
                  to="/admin/analytics/support"
                  className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                >
                  Full Statistics <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Open Tickets
                  </p>
                  <p className={`mt-1 text-xl font-semibold text-yellow-500`}>
                    {tickets.filter((t) => t.status === "open").length}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    In Progress
                  </p>
                  <p className={`mt-1 text-xl font-semibold text-blue-500`}>
                    {tickets.filter((t) => t.status === "in_progress").length}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Resolved
                  </p>
                  <p className={`mt-1 text-xl font-semibold text-green-500`}>
                    {
                      tickets.filter(
                        (t) => t.status === "resolved" || t.status === "closed",
                      ).length
                    }
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Urgent Priority
                  </p>
                  <p className={`mt-1 text-xl font-semibold text-red-500`}>
                    {
                      tickets.filter(
                        (t) =>
                          t.priority === "urgent" &&
                          (t.status === "open" || t.status === "in_progress"),
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminSupport;
