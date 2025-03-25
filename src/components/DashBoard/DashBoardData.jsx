import { motion } from "framer-motion";
import { FaInfoCircle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashBoardData = () => {
  // Example data - this would typically come from Redux
  const data = [
    {
      id: "TRX123456",
      date: "2023-11-28",
      type: "Deposit",
      amount: "500.00",
      status: "Completed",
    },
    {
      id: "TRX123457",
      date: "2023-11-27",
      type: "Withdrawal",
      amount: "200.00",
      status: "Pending",
    },
    {
      id: "TRX123458",
      date: "2023-11-26",
      type: "Deposit",
      amount: "1000.00",
      status: "Completed",
    },
  ];

  // Stagger animations for table rows
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Status badge styles
  const statusClasses = {
    Completed: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Failed: "bg-red-500/20 text-red-400"
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        <Link 
          to="/login/deposittransaction" 
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          View All
        </Link>
      </div>
      
      <div className="p-6">
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <motion.table 
              className="w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="text-left">
                <tr className="border-b border-gray-700">
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Transaction ID</th>
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Date</th>
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Amount</th>
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 px-2 text-sm font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction, index) => (
                  <motion.tr 
                    key={transaction.id}
                    variants={itemVariants}
                    className="hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-3 px-2 text-gray-300">{transaction.id}</td>
                    <td className="py-3 px-2 text-gray-300">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-gray-300">{transaction.type}</td>
                    <td className="py-3 px-2 font-medium text-white">${transaction.amount}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[transaction.status]}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-full hover:bg-gray-700">
                        <FaEye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <FaInfoCircle className="text-4xl text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No transactions yet</h3>
            <p className="text-gray-400 text-center">When you make transactions, they will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashBoardData;
