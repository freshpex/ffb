import { useSelector } from "react-redux";
import {
  FaRegCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import {
  selectFinancialHighlights,
  selectDashboardComponentStatus,
} from "../../redux/slices/dashboardSlice";
import CardLoader from "../common/CardLoader";

const FinancialHighlights = () => {
  const financialData = useSelector(selectFinancialHighlights);
  const componentStatus = useSelector((state) =>
    selectDashboardComponentStatus(state, "financialHighlights"),
  );

  if (componentStatus === "loading") {
    return <CardLoader title="Financial Highlights" height="h-64" />;
  }

  const formatCurrency = (value) => {
    return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Financial Highlights
        </h2>
        <span className="text-sm text-gray-400 flex items-center">
          <FaRegCalendarAlt className="inline mr-2" />
          {financialData?.period || "This Month"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Totals */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
            <FaDollarSign className="mr-2 text-green-500" />
            Transaction Totals
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Deposit Total</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(financialData?.depositTotal || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Withdrawal Total</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(financialData?.withdrawalTotal || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Investment Total</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(financialData?.investmentTotal || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Returns</span>
              <span className="text-gray-200 font-medium">
                {formatCurrency(financialData?.totalReturns || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Investment Performance */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-500" />
            Investment Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active Investments</span>
              <span className="text-gray-200 font-medium">
                {financialData?.activeInvestments || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Profit/Loss</span>
              <span
                className={`font-medium ${
                  financialData?.profitLoss >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(financialData?.profitLoss || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Profit Percentage</span>
              <span
                className={`font-medium flex items-center ${
                  financialData?.profitPercentage >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {financialData?.profitPercentage >= 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {Math.abs(financialData?.profitPercentage || 0).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHighlights;
