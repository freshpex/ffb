import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaSearch, FaHistory, FaFileCsv, FaFilter, 
  FaTable, FaCreditCard, FaEthereum, FaBitcoin, 
  FaSortAmountDown, FaSortAmountUp, FaRegCalendarAlt,
  FaListUl 
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";

const DepositTransaction = () => {
  // Sample transaction data - in a real app this would come from an API
  const mockTransactions = [
    {
      id: "DEP10023",
      date: "2023-11-28",
      method: "Bitcoin",
      methodIcon: <FaBitcoin />,
      amount: "1,500.00",
      status: "Completed"
    },
    {
      id: "DEP10022",
      date: "2023-11-25",
      method: "Credit Card",
      methodIcon: <FaCreditCard />,
      amount: "500.00",
      status: "Completed"
    },
    {
      id: "DEP10021",
      date: "2023-11-20",
      method: "Ethereum",
      methodIcon: <FaEthereum />,
      amount: "800.00",
      status: "Pending"
    },
    {
      id: "DEP10020",
      date: "2023-11-15",
      method: "Bitcoin",
      methodIcon: <FaBitcoin />,
      amount: "2,000.00",
      status: "Completed"
    },
    {
      id: "DEP10019",
      date: "2023-11-10",
      method: "Credit Card",
      methodIcon: <FaCreditCard />,
      amount: "750.00",
      status: "Failed"
    }
  ];

  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Monitor window width for responsive layout
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Auto-switch to card view on smaller screens
    if (windowWidth <= 768) {
      setIsTableView(false);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  // Apply search and filters
  useEffect(() => {
    let result = transactions;
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.id.toLowerCase().includes(query) || 
          item.method.toLowerCase().includes(query) ||
          item.amount.includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply method filter
    if (methodFilter !== "all") {
      result = result.filter(item => item.method.toLowerCase().includes(methodFilter.toLowerCase()));
    }
    
    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(item => new Date(item.date) >= new Date(dateRange.start));
    }
    
    if (dateRange.end) {
      result = result.filter(item => new Date(item.date) <= new Date(dateRange.end));
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortField === 'amount') {
        const amountA = parseFloat(a.amount.replace(/,/g, ''));
        const amountB = parseFloat(b.amount.replace(/,/g, ''));
        return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
      } else if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      } else {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });
    
    setFilteredTransactions(result);
  }, [searchQuery, statusFilter, methodFilter, dateRange, transactions, sortField, sortDirection]);

  // Get current page items
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Deposit History
      </motion.h1>
      
      <motion.div 
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-header">
          <h2 className="card-title">Your Deposit Transactions</h2>
          <div className="card-actions">
            <div className="toggle-view">
              <button 
                className={isTableView ? 'active' : ''} 
                onClick={() => setIsTableView(true)}
              >
                <FaTable /> Table
              </button>
              <button 
                className={!isTableView ? 'active' : ''} 
                onClick={() => setIsTableView(false)}
              >
                <FaListUl /> Cards
              </button>
            </div>
            <button className="export-btn">
              <FaFileCsv /> Export
            </button>
            <button 
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filter
            </button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div 
            className="filter-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Payment Method</label>
                <select
                  className="filter-select"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="all">All Methods</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="card">Credit Card</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Date From</label>
                <input
                  type="date"
                  className="filter-date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Date To</label>
                <input
                  type="date"
                  className="filter-date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="filter-reset" onClick={resetFilters}>Reset</button>
              <button className="filter-apply" onClick={() => setShowFilters(false)}>Apply Filters</button>
            </div>
          </motion.div>
        )}
        
        <div className="card-body">
          <div className="search-box">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isTableView ? (
            <div className="table-responsive">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      Transaction ID {sortField === 'id' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                    </th>
                    <th onClick={() => handleSort('date')}>
                      Date {sortField === 'date' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                    </th>
                    <th onClick={() => handleSort('method')}>
                      Method {sortField === 'method' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                    </th>
                    <th onClick={() => handleSort('amount')}>
                      Amount {sortField === 'amount' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                    </th>
                    <th onClick={() => handleSort('status')}>
                      Status {sortField === 'status' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.length > 0 ? currentTransactions.map((item, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td>{item.id}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.methodIcon} {item.method}
                        </div>
                      </td>
                      <td className="transaction-amount">${item.amount}</td>
                      <td>
                        <span className={`transaction-status status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <FaHistory />
                          </div>
                          <h3>No deposit history</h3>
                          <p>Your deposit transactions will appear here</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="transaction-cards">
              {currentTransactions.length > 0 ? currentTransactions.map((item, index) => (
                <motion.div 
                  className="transaction-card"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="transaction-card-header">
                    <div className="transaction-card-id">{item.id}</div>
                    <div className="transaction-card-date">
                      <FaRegCalendarAlt /> {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="transaction-card-body">
                    <div className="transaction-card-method">
                      <div className="transaction-card-method-icon">
                        {item.methodIcon}
                      </div>
                      {item.method}
                    </div>
                    <div className="transaction-card-amount">${item.amount}</div>
                  </div>
                  
                  <div className="transaction-card-footer">
                    <span className={`transaction-card-status status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                    <button className="transaction-card-action">View Details</button>
                  </div>
                </motion.div>
              )) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FaHistory />
                  </div>
                  <h3>No deposit history</h3>
                  <p>Your deposit transactions will appear here</p>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {filteredTransactions.length > itemsPerPage && (
            <div className="pagination">
              <button 
                className="pagination-item"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`pagination-item ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
              
              <button 
                className="pagination-item"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DepositTransaction;