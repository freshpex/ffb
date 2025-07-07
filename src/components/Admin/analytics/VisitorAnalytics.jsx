import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUsers,
  FaMobile,
  FaDesktop,
  FaGlobe,
  FaChrome,
  FaFirefox,
  FaEdge,
  FaSafari,
  FaOpera,
  FaWindows,
  FaApple,
  FaAndroid,
  FaLinux,
  FaSyncAlt,
  FaTablet,
  FaFilter,
  FaCalendar,
  FaLink,
  FaGlobeAmericas,
  FaQuestion,
} from "react-icons/fa";
import {
  fetchVisitorAnalytics,
  selectVisitorAnalytics,
  selectVisitorAnalyticsStatus,
  selectVisitorAnalyticsError,
} from "../../../redux/slices/visitorAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import VisitorDetails from "./VisitorDetails"

const VisitorAnalytics = () => {
  const dispatch = useDispatch();
  const visitorData = useSelector(selectVisitorAnalytics);
  console.log("Visitor Data", visitorData);
  const status = useSelector((state) =>
    selectVisitorAnalyticsStatus(state, "visitors"),
  );
  const error = useSelector((state) =>
    selectVisitorAnalyticsError(state, "visitors"),
  );

  const [period, setPeriod] = useState("30d");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch, period, customDateRange.startDate, customDateRange.endDate]);

  const loadData = () => {
    let queryParams = { period };

    if (period === "custom" && customDateRange.startDate && customDateRange.endDate) {
      queryParams = {
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate,
      };
    }

    console.log("Dispatch query Data", queryParams);
    console.log("Dispatch data Data", dispatch(fetchVisitorAnalytics(queryParams)));
    dispatch(fetchVisitorAnalytics(queryParams));
  };

  const handleRefresh = () => {
    loadData();
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setShowPeriodDropdown(false);
    
    if (newPeriod === "custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCustomDates = () => {
    setShowCustomDatePicker(false);
    loadData();
  };

  // Colors for charts
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#6366f1", // indigo
    "#14b8a6", // teal
  ];

  const deviceTypeMap = {
    mobile: <FaMobile className="text-blue-400" />,
    desktop: <FaDesktop className="text-green-400" />,
    tablet: <FaTablet className="text-amber-400" />,
    unknown: <FaQuestion className="text-gray-400" />,
  };

  const browserIconMap = {
    Chrome: <FaChrome className="text-blue-400" />,
    Firefox: <FaFirefox className="text-orange-400" />,
    Safari: <FaSafari className="text-blue-400" />,
    Edge: <FaEdge className="text-teal-400" />,
    Opera: <FaOpera className="text-red-400" />,
    Unknown: <FaGlobe className="text-gray-400" />,
  };

  const osIconMap = {
    Windows: <FaWindows className="text-blue-400" />,
    macOS: <FaApple className="text-gray-400" />,
    iOS: <FaApple className="text-gray-400" />,
    Android: <FaAndroid className="text-green-400" />,
    Linux: <FaLinux className="text-yellow-400" />,
    Unknown: <FaQuestion className="text-gray-400" />,
  };

  if (status === "loading") {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-40 bg-gray-700 rounded"></div>
            ))}
          </div>
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
          <p className="text-red-400">Error loading visitor analytics: {error}</p>
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

  if (!visitorData) return null;

  // Format visitor trend data
  const formatTrendData = (data) => {
    return data.map((item) => ({
      date: item._id,
      visits: item.count,
    }));
  };

  // Format distribution data for pie charts
  const formatDistributionData = (data) => {
    return data.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
    }));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaUsers className="mr-2 text-blue-400" />
          Visitor Analytics
        </h2>

        <div className="flex items-center gap-3">
          {/* Time period selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              <FaCalendar />
              {period === "24h"
                ? "Last 24 Hours"
                : period === "7d"
                ? "Last 7 Days"
                : period === "30d"
                ? "Last 30 Days"
                : period === "90d"
                ? "Last 90 Days"
                : period === "1y"
                ? "Last Year"
                : period === "custom"
                ? "Custom Range"
                : "Last 30 Days"}
              <FaFilter className="ml-1" />
            </button>

            {showPeriodDropdown && (
              <div className="absolute z-10 right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => handlePeriodChange("24h")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Last 24 Hours
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePeriodChange("7d")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Last 7 Days
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePeriodChange("30d")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Last 30 Days
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePeriodChange("90d")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Last 90 Days
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePeriodChange("1y")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Last Year
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePeriodChange("custom")}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                    >
                      Custom Range
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-700 text-blue-400 rounded hover:bg-gray-600"
            title="Refresh data"
          >
            <FaSyncAlt className={status === "loading" ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Custom date picker */}
      {showCustomDatePicker && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm text-gray-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={customDateRange.startDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm text-gray-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={customDateRange.endDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
            />
          </div>
          <div className="self-end">
            <button
              onClick={handleApplyCustomDates}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Visitors */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaUsers className="mr-1 text-blue-400" />
                Total Visitors
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {visitorData.totalVisitors.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {visitorData.uniqueVisitors.toLocaleString()} unique visitors
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <FaUsers className="text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaMobile className="mr-1 text-green-400" />
                Device Types
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {/* Get the most common device type */}
                {visitorData.deviceDistribution && visitorData.deviceDistribution.length > 0 
                  ? visitorData.deviceDistribution[0]._id || "Unknown" 
                  : "Unknown"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Most common device type
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/20">
              <FaDesktop className="text-green-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium flex items-center">
                <FaGlobeAmericas className="mr-1 text-purple-400" />
                Top Countries
              </h3>
              <p className="text-white text-2xl font-semibold mt-1">
                {visitorData.countryDistribution && visitorData.countryDistribution.length > 0 
                  ? visitorData.countryDistribution[0]._id || "Unknown" 
                  : "Unknown"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Most common visitor location
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/20">
              <FaGlobeAmericas className="text-purple-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Trend Chart */}
      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 mb-6">
        <h3 className="text-lg font-medium text-gray-200 mb-4">
          Visitor Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formatTrendData(visitorData.visitTrend || [])}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Device Distribution */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Device Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatDistributionData(visitorData.deviceDistribution || [])}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {(visitorData.deviceDistribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} visitors`,
                    `Device: ${name}`,
                  ]}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Browser Distribution */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Browser Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatDistributionData(visitorData.browserDistribution || [])}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {(visitorData.browserDistribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} visitors`,
                    `Browser: ${name}`,
                  ]}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* OS and Country Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* OS Distribution */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Operating System Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatDistributionData(visitorData.osDistribution || [])}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Top Visitor Countries
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatDistributionData(visitorData.countryDistribution || [])}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Pages and New vs Returning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Most Visited Pages
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Page Path
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Visits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {(visitorData.topPages || []).map((page, index) => (
                  <tr key={index} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <FaLink className="text-blue-400 mr-2" />
                        {page._id}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {page.visits.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(visitorData.topPages || []).length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-center text-gray-400"
                    >
                      No page data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New vs Returning */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            New vs Returning Visitors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "New", value: visitorData.visitorTypes?.new || 0 },
                    { name: "Returning", value: visitorData.visitorTypes?.returning || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} visitors`,
                    `${name} visitors`,
                  ]}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <VisitorDetails/>
    </div>
  );
};

export default VisitorAnalytics;