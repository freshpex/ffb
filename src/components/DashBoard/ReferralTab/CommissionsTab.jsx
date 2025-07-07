import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommissionHistory,
  selectReferralPagination,
  selectReferralStatistics,
  selectReferralStatus,
  fetchCommissionHistory,
  setCurrentPage,
} from "../../../redux/slices/referralSlice";
import Pagination from "../../common/Pagination";
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaFileExport,
  FaFileDownload,
  FaFilter,
} from "react-icons/fa";
import { format } from "date-fns";

const CommissionsTab = () => {
  const dispatch = useDispatch();
  const commissions = useSelector(selectCommissionHistory);
  const statistics = useSelector(selectReferralStatistics);
  const status = useSelector(selectReferralStatus);
  const pagination = useSelector(selectReferralPagination);

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    // Fetch commissions with filters when they change
    const params = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    };

    if (filterStatus !== "all") {
      params.status = filterStatus;
    }

    if (dateRange !== "all") {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (startDate) {
        params.startDate = startDate.toISOString();
        params.endDate = new Date().toISOString();
      }
    }

    dispatch(fetchCommissionHistory(params));
  }, [dispatch, filterStatus, dateRange, pagination.currentPage]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "h:mm a");
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-500 border border-green-500">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500 border border-yellow-500">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-500 border border-blue-500">
            Processing
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-500">
            {status}
          </span>
        );
    }
  };

  // Get commission type badge
  const getCommissionTypeBadge = (type) => {
    switch (type) {
      case "signup_bonus":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-500 border border-purple-500">
            Signup Bonus
          </span>
        );
      case "deposit_commission":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-500 border border-blue-500">
            Deposit
          </span>
        );
      case "trade_commission":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-500 border border-green-500">
            Trading
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-500">
            {type || "Commission"}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-900/30 mr-4">
              <FaMoneyBillWave className="text-primary-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-xl font-bold text-gray-100">
                {formatCurrency(statistics.totalEarnings || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-900/30 mr-4">
              <FaArrowDown className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Paid Commissions</p>
              <p className="text-xl font-bold text-green-500">
                {formatCurrency(
                  statistics.totalEarnings - statistics.pendingCommissions || 0,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-900/30 mr-4">
              <FaArrowUp className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending Commissions</p>
              <p className="text-xl font-bold text-yellow-500">
                {formatCurrency(statistics.pendingCommissions || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-900/30 mr-4">
              <FaCircle className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Commission Rate</p>
              <p className="text-xl font-bold text-blue-500">Up to 10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions Row */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>

          <select
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>

          <button
            className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 hover:bg-gray-700 flex items-center"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <FaFilter className="mr-2" />
            <span>More Filters</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
            <FaFileExport className="mr-2" />
            <span>Export</span>
          </button>
          <button className="flex items-center bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700">
            <FaFileDownload className="mr-2" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Commission History Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Referral
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {status === "loading" ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                  Loading commission data...
                </td>
              </tr>
            ) : commissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                  No commission history found
                </td>
              </tr>
            ) : (
              commissions.map((commission) => (
                <tr key={commission._id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">
                      {formatDate(commission.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(commission.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-200">
                      {commission.metadata?.refereeEmail || "Unknown user"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {commission.reference && (
                        <span className="flex items-center">
                          Ref: {commission.reference.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getCommissionTypeBadge(commission.metadata?.commissionType)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-500">
                    {formatCurrency(commission.amount)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(commission.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommissionsTab;
