import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaSyncAlt,
  FaUsers,
  FaIdCard,
  FaHeadset,
  FaServer,
  FaExclamationTriangle,
  FaRegClock,
} from "react-icons/fa";
import {
  fetchPerformanceAnalytics,
  selectPerformanceAnalytics,
  selectAnalyticsStatus,
  selectAnalyticsError,
} from "../../../redux/slices/adminAnalyticsSlice";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const PerformanceAnalytics = () => {
  const dispatch = useDispatch();
  const performanceData = useSelector(selectPerformanceAnalytics);
  const status = useSelector((state) =>
    selectAnalyticsStatus(state, "performance"),
  );
  const error = useSelector((state) =>
    selectAnalyticsError(state, "performance"),
  );

  useEffect(() => {
    dispatch(fetchPerformanceAnalytics());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPerformanceAnalytics());
  };

  // Custom formatter for time durations
  const formatTime = (value, unit) => {
    if (value === undefined || value === null) return "-";

    if (unit === "hours") {
      // Convert to days & hours if > 24 hours
      if (value >= 24) {
        const days = Math.floor(value / 24);
        const hours = Math.round(value % 24);
        return `${days}d ${hours}h`;
      }
      return `${value.toFixed(1)}h`;
    } else if (unit === "minutes") {
      // Convert to hours & minutes if > 60 minutes
      if (value >= 60) {
        const hours = Math.floor(value / 60);
        const minutes = Math.round(value % 60);
        return `${hours}h ${minutes}m`;
      }
      return `${value.toFixed(0)}m`;
    }

    return `${value}`;
  };

  // Determine color based on value (higher is better)
  const getMetricColor = (value, thresholds = { low: 30, medium: 70 }) => {
    if (value >= thresholds.medium) return "#10B981"; // Green
    if (value >= thresholds.low) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  // Determine color based on value (lower is better)
  const getInverseMetricColor = (
    value,
    thresholds = { high: 70, medium: 30 },
  ) => {
    if (value <= thresholds.medium) return "#10B981"; // Green
    if (value <= thresholds.high) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  // Prepare data for the market breadth donut chart
  const prepareBreadthData = () => {
    if (!performanceData || !performanceData.userActivity) return [];

    return [
      {
        name: "Active (30d)",
        value: performanceData.userActivity.activeUsersLast30Days,
        fill: "#10B981", // Green
      },
      {
        name: "Active (90d)",
        value:
          performanceData.userActivity.activeUsersLast90Days -
          performanceData.userActivity.activeUsersLast30Days,
        fill: "#3B82F6", // Blue
      },
      {
        name: "Inactive",
        value:
          performanceData.userActivity.totalActiveUsers -
          performanceData.userActivity.activeUsersLast90Days,
        fill: "#6B7280", // Gray
      },
    ];
  };

  // Prepare performance metrics for radial charts
  const preparePerformanceMetrics = () => {
    if (!performanceData) return [];

    return [
      {
        name: "User Retention",
        value: performanceData.userActivity.retentionRate,
        fill: getMetricColor(performanceData.userActivity.retentionRate),
      },
      {
        name: "System Uptime",
        value: performanceData.system.uptime,
        fill: getMetricColor(performanceData.system.uptime, {
          low: 95,
          medium: 99,
        }),
      },
      {
        name: "Error Rate",
        value: 100 - performanceData.system.errorRate * 100, // Convert to success rate
        fill: getMetricColor(100 - performanceData.system.errorRate * 100),
      },
    ];
  };

  if (status === "loading" && !performanceData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-400">
            Error loading performance analytics: {error}
          </p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm flex items-center"
          >
            <FaSyncAlt className="mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData) return null;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaTachometerAlt className="mr-2 text-indigo-400" />
          Performance Analytics
        </h2>

        <button
          onClick={handleRefresh}
          className="p-1.5 bg-gray-700 text-blue-400 rounded hover:bg-gray-600"
          disabled={status === "loading"}
          title="Refresh data"
        >
          <FaSyncAlt className={status === "loading" ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* System Performance */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaServer className="mr-1 text-blue-400" />
                System Performance
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {performanceData.system.uptime.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-400 mt-1">System Uptime</p>
            </div>

            <div className="text-right">
              <p className="text-white text-xl font-semibold">
                {performanceData.system.averageApiResponseTime}{" "}
                <span className="text-sm font-normal">ms</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg. Response Time</p>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Error Rate</span>
              <span
                className={
                  performanceData.system.errorRate < 0.01
                    ? "text-green-400"
                    : "text-amber-400"
                }
              >
                {(performanceData.system.errorRate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${100 - performanceData.system.errorRate * 100}%`,
                  backgroundColor: getMetricColor(
                    100 - performanceData.system.errorRate * 100,
                  ),
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaUsers className="mr-1 text-green-400" />
                User Activity
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {performanceData.userActivity.activeUsersLast30Days.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">Active Users (30d)</p>
            </div>

            <div className="text-right">
              <p className="text-white text-xl font-semibold">
                {formatTime(
                  performanceData.userActivity.averageSessionDuration,
                  "minutes",
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg. Session Time</p>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Retention Rate</span>
              <span
                className={
                  performanceData.userActivity.retentionRate > 50
                    ? "text-green-400"
                    : "text-amber-400"
                }
              >
                {performanceData.userActivity.retentionRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${performanceData.userActivity.retentionRate}%`,
                  backgroundColor: getMetricColor(
                    performanceData.userActivity.retentionRate,
                  ),
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Operations Efficiency */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaHeadset className="mr-1 text-violet-400" />
                Operations Efficiency
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {formatTime(
                  performanceData.operations.ticketResponseTime,
                  "minutes",
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg. Ticket Response</p>
            </div>

            <div className="text-right">
              <p className="text-white text-xl font-semibold">
                {formatTime(
                  performanceData.operations.kycProcessingTime,
                  "hours",
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg. KYC Processing</p>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Ticket Resolution Time</span>
              <span>
                {formatTime(
                  performanceData.operations.ticketResolutionTime,
                  "hours",
                )}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-violet-500"
                style={{
                  width: `${Math.min(100, (performanceData.operations.ticketResolutionTime / 72) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Distribution */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaUsers className="mr-2 text-blue-400" />
            User Activity Distribution
          </h3>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareBreadthData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {prepareBreadthData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), "Users"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FaTachometerAlt className="mr-2 text-amber-400" />
            Performance Metrics
          </h3>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                barSize={20}
                data={preparePerformanceMetrics()}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    formatter: (value) => `${value.toFixed(0)}%`,
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}%`, "Value"]}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ color: "#ffffff" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Performance Details */}
      <div className="mt-8 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
        <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
          <FaRegClock className="mr-2 text-red-400" />
          Operational Performance Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
              {/* KYC Processing Time */}
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <FaIdCard className="flex-shrink-0 mr-2 text-indigo-400" />
                    <span>KYC Processing Time</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {formatTime(
                    performanceData.operations.kycProcessingTime,
                    "hours",
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      performanceData.operations.kycProcessingTime <= 24
                        ? "bg-green-900/30 text-green-400"
                        : performanceData.operations.kycProcessingTime <= 48
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {performanceData.operations.kycProcessingTime <= 24
                      ? "Excellent"
                      : performanceData.operations.kycProcessingTime <= 48
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                  Average time to process KYC applications
                </td>
              </tr>

              {/* Ticket Response Time */}
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <FaHeadset className="flex-shrink-0 mr-2 text-blue-400" />
                    <span>Ticket Response Time</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {formatTime(
                    performanceData.operations.ticketResponseTime,
                    "minutes",
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      performanceData.operations.ticketResponseTime <= 30
                        ? "bg-green-900/30 text-green-400"
                        : performanceData.operations.ticketResponseTime <= 120
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {performanceData.operations.ticketResponseTime <= 30
                      ? "Excellent"
                      : performanceData.operations.ticketResponseTime <= 120
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                  Average time to first response for support tickets
                </td>
              </tr>

              {/* API Response Time */}
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <FaServer className="flex-shrink-0 mr-2 text-green-400" />
                    <span>API Response Time</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {performanceData.system.averageApiResponseTime} ms
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      performanceData.system.averageApiResponseTime <= 150
                        ? "bg-green-900/30 text-green-400"
                        : performanceData.system.averageApiResponseTime <= 300
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {performanceData.system.averageApiResponseTime <= 150
                      ? "Excellent"
                      : performanceData.system.averageApiResponseTime <= 300
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                  Average API response time in milliseconds
                </td>
              </tr>

              {/* System Uptime */}
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <FaTachometerAlt className="flex-shrink-0 mr-2 text-amber-400" />
                    <span>System Uptime</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {performanceData.system.uptime.toFixed(2)}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      performanceData.system.uptime >= 99.9
                        ? "bg-green-900/30 text-green-400"
                        : performanceData.system.uptime >= 99.5
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {performanceData.system.uptime >= 99.9
                      ? "Excellent"
                      : performanceData.system.uptime >= 99.5
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                  System availability percentage over the last 30 days
                </td>
              </tr>

              {/* Error Rate */}
              <tr className="hover:bg-gray-700/30">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="flex-shrink-0 mr-2 text-red-400" />
                    <span>Error Rate</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {(performanceData.system.errorRate * 100).toFixed(2)}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      performanceData.system.errorRate <= 0.01
                        ? "bg-green-900/30 text-green-400"
                        : performanceData.system.errorRate <= 0.05
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {performanceData.system.errorRate <= 0.01
                      ? "Excellent"
                      : performanceData.system.errorRate <= 0.05
                        ? "Good"
                        : "Needs Improvement"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                  Percentage of API requests resulting in errors
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
