import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";

const DashBoardData = () => {
  // Example data - this would typically come from an API or context
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

  return (
    <motion.div 
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header">
        <h2 className="card-title">Recent Transactions</h2>
        <button className="view-all-btn">View All</button>
      </div>
      
      <div className="card-body">
        {data.length > 0 ? (
          <div className="table-responsive">
            <motion.table 
              className="transaction-table"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction, index) => (
                  <motion.tr 
                    key={transaction.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  >
                    <td>{transaction.id}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.type}</td>
                    <td className="transaction-amount">${transaction.amount}</td>
                    <td>
                      <span className={`transaction-status status-${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        ) : (
          <div className="empty-state">
            <FaInfoCircle className="empty-state-icon" />
            <h3>No transactions yet</h3>
            <p>When you make transactions, they will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashBoardData;
