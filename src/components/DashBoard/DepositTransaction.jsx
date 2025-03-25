import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaHistory, FaFileCsv, FaFilter, FaTable, FaListUl,
  FaRegCalendarAlt, FaArrowDown, FaArrowUp, FaExternalLinkAlt,
  FaSortAmountDown, FaSortAmountUp, FaEye, FaFileDownload, 
  FaBitcoin, FaEthereum, FaUniversity, FaMoneyBillWave,
  FaTimes, FaInfoCircle
} from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import TransactionStatusBadge from "../common/TransactionStatusBadge";
import Button from "../common/Button";
import { selectDepositHistory } from "../../redux/slices/depositSlice";

const DepositTransaction = () => {
  // Get transaction data from Redux store
  const depositHistory = useSelector(selectDepositHistory);
  
  // State
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  const itemsPerPage = 5;
  
  // Initialize transactions from Redux
  useEffect(() => {
    setTransactions(depositHistory);
    setFilteredTransactions(depositHistory);
  }, [depositHistory]);
  
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
          item.amount.includes(query) ||
          (item.address && item.address.toLowerCase().includes(query))
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
    
    // Apply amount filter
    if (amountRange.min) {
      result = result.filter(item => {
        const amount = parseFloat(item.amount.replace(/,/g, ''));
        return amount >= parseFloat(amountRange.min);
      });
    }
    
    if (amountRange.max) {
      result = result.filter(item => {
        const amount = parseFloat(item.amount.replace(/,/g, ''));
        return amount <= parseFloat(amountRange.max);
      });
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortField === 'amount') {
        const valueA = parseFloat(a[sortField].replace(/,/g, ''));
        const valueB = parseFloat(b[sortField].replace(/,/g, ''));
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
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
  }, [searchQuery, statusFilter, methodFilter, dateRange, amountRange, transactions, sortField, sortDirection]);

  // Get current page items
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
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
    setAmountRange({ min: "", max: "" });
    setCurrentPage(1);
  };
  
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };
  
  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };
  
  const getMethodIcon = (methodType) => {
    const method = methodType.toLowerCase();
    switch (method) {
      case 'bitcoin':
        return <FaBitcoin className="text-yellow-500" />;
      case 'ethereum':
        return <FaEthereum className="text-blue-400" />;
      case 'bank':
      case 'bank transfer':
        return <FaUniversity className="text-gray-400" />;
      default:
        return <FaMoneyBillWave className="text-green-400" />;
    }
  };
  
  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      // Headers
      ['ID', 'Date', 'Method', 'Amount', 'Status', 'Confirmations'].join(','),
      // Data rows
      ...filteredTransactions.map(tx => [
        tx.id, 
        tx.date, 
        tx.method, 
        tx.amount,
        tx.status,
        tx.confirmations
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `deposit-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Render transaction details modal
  const renderTransactionDetails = () => {
    if (!selectedTransaction) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseDetails}
      >
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white">Deposit Details</h3>
            <button 
              onClick={handleCloseDetails}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <TransactionStatusBadge status={selectedTransaction.status} />
            <span className="text-sm text-gray-400">{selectedTransaction.date}</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Transaction ID</div>
              <div className="text-gray-200 font-medium overflow-x-auto">{selectedTransaction.id}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Method</div>
                <div className="text-gray-200 font-medium flex items-center">
                  {getMethodIcon(selectedTransaction.method)}
                  <span className="ml-2">{selectedTransaction.method}</span>
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Confirmations</div>
                <div className="text-gray-200 font-medium">{selectedTransaction.confirmations}</div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Deposit Address</div>
              <div className="text-gray-200 font-medium break-all">{selectedTransaction.address}</div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Amount</div>
              <div className="text-gray-200 font-medium">${selectedTransaction.amount}</div>
            </div>
            
            {selectedTransaction.transactionId && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Transaction Hash</div>
                <div className="text-gray-200 font-medium break-all">{selectedTransaction.transactionId}</div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleCloseDetails}
              fullWidth
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Deposit History</h1>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsTableView(!isTableView)}
            >
              {isTableView ? <FaListUl className="mr-2" /> : <FaTable className="mr-2" />}
              {isTableView ? 'Card View' : 'Table View'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToCSV}
            >
              <FaFileCsv className="mr-2" /> Export CSV
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Search and filter section */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, method, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Advanced filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Status filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* Method filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Method</label>
                    <select
                      value={methodFilter}
                      onChange={(e) => setMethodFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                    >
                      <option value="all">All Methods</option>
                      <option value="bitcoin">Bitcoin</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  {/* Date range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date Range</label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Amount range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount Range</label>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={amountRange.min}
                          onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-full pl-8 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={amountRange.max}
                          onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full pl-8 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {filteredTransactions.length > 0 ? (
            <>
              {/* Table view */}
              {isTableView ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('id')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>ID</span>
                            {sortField === 'id' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            {sortField === 'date' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('method')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Method</span>
                            {sortField === 'method' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Amount</span>
                            {sortField === 'amount' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('confirmations')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Confirmations</span>
                            {sortField === 'confirmations' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortField === 'status' && (
                              <span>{sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}</span>
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/50">
                      {currentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-800/80 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{transaction.id}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{transaction.date}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-300">
                              <span className="mr-2">{getMethodIcon(transaction.method)}</span>
                              {transaction.method}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">${transaction.amount}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{transaction.confirmations}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <TransactionStatusBadge status={transaction.status} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetails(transaction)}
                              className="p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-full hover:bg-gray-700"
                              title="View Details"
                            >
                              <FaEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Card view */
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <span className="mr-2">{getMethodIcon(transaction.method)}</span>
                          <span className="text-white font-medium">{transaction.method}</span>
                        </div>
                        <TransactionStatusBadge status={transaction.status} />
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3">
                        ID: <span className="text-gray-300">{transaction.id}</span>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3">
                        Date: <span className="text-gray-300">{transaction.date}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400">Amount</div>
                          <div className="text-white text-sm font-medium">${transaction.amount}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Confirmations</div>
                          <div className="text-gray-300 text-sm">{transaction.confirmations}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors text-sm flex items-center justify-center"
                      >
                        <FaEye className="mr-2" /> View Details
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`ml-3 px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                    <div>
                      <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-gray-200">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                        <span className="font-medium text-gray-200">
                          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
                        </span>{' '}
                        of <span className="font-medium text-gray-200">{filteredTransactions.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 ${
                            currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <FaArrowLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                          const pageNumber = idx + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${
                                currentPage === pageNumber
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 ${
                            currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <FaArrowDown className="h-5 w-5 rotate-270" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <FaInfoCircle className="mx-auto text-4xl text-gray-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No deposits found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search terms.</p>
              {(searchQuery || statusFilter !== "all" || methodFilter !== "all" || dateRange.start || dateRange.end || amountRange.min || amountRange.max) && (
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Transaction details modal */}
      <AnimatePresence>
        {selectedTransaction && renderTransactionDetails()}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DepositTransaction;