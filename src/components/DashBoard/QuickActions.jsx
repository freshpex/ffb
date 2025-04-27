import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaExchangeAlt,
  FaUserFriends,
} from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Deposit",
      icon: <FaArrowDown className="text-green-500" />,
      bgColor: "bg-green-900/20",
      borderColor: "border-green-500/30",
      path: "/login/deposit",
    },
    {
      title: "Withdraw",
      icon: <FaArrowUp className="text-red-500" />,
      bgColor: "bg-red-900/20",
      borderColor: "border-red-500/30",
      path: "/login/withdraw",
    },
    {
      title: "Trade",
      icon: <FaExchangeAlt className="text-blue-500" />,
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-500/30",
      path: "/login/trading",
    },
    {
      title: "Invest",
      icon: <FaChartLine className="text-purple-500" />,
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-500/30",
      path: "/login/investmentplans",
    },
    {
      title: "Refer",
      icon: <FaUserFriends className="text-yellow-500" />,
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-500/30",
      path: "/login/referral",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className={`${action.bgColor} ${action.borderColor} border p-4 rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <span className="text-sm font-medium text-gray-200">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
