import React, { useState } from "react";
import {
  FaChartPie,
  FaUsers,
  FaChartBar,
  FaExchangeAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import AdminLayout from "./AdminLayout";
import AnalyticsOverview from "./analytics/AnalyticsOverview";
import UserGrowthAnalytics from "./analytics/UserGrowthAnalytics";
import FinancialAnalytics from "./analytics/FinancialAnalytics";
import TransactionAnalytics from "./analytics/TransactionAnalytics";
import PerformanceAnalytics from "./analytics/PerformanceAnalytics";

const AdminAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Tab configuration
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaChartPie className="mr-2" />,
    },
    {
      id: "users",
      label: "User Growth",
      icon: <FaUsers className="mr-2" />,
    },
    {
      id: "financial",
      label: "Financial",
      icon: <FaChartBar className="mr-2" />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FaExchangeAlt className="mr-2" />,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <FaTachometerAlt className="mr-2" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Analytics Dashboard
          </h1>
        </div>

        {/* Analytics Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex flex-wrap -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`mr-4 py-2 px-1 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "text-blue-400 border-blue-400"
                    : "text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Content */}
        <div className="mt-6">
          {activeTab === "overview" && <AnalyticsOverview />}
          {activeTab === "users" && <UserGrowthAnalytics />}
          {activeTab === "financial" && <FinancialAnalytics />}
          {activeTab === "transactions" && <TransactionAnalytics />}
          {activeTab === "performance" && <PerformanceAnalytics />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
