import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaChartLine, 
  FaHistory, 
  FaLock, 
  FaUnlock, 
  FaTimes,
  FaShoppingBag,
  FaUtensils,
  FaCar,
  FaPlane,
  FaMoneyBillWave,
  FaHome,
  FaFilter,
  FaDownload,
  FaSlidersH,
  FaPlus,
  FaExchangeAlt
} from 'react-icons/fa';
import { 
  fetchCardTransactions, 
  selectCardById, 
  selectCardTransactions,
  selectATMCardsStatus,
  selectTransactionStatus,
  selectTransactionError,
  freezeCard,
  unfreezeCard,
  cancelCardRequest,
  createCardTransaction,
  clearTransactionStatus
} from '../../../redux/slices/atmCardsSlice';
import DashboardLayout from '../DashboardLayout';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import Alert from '../../common/Alert';
import CardLimitsModal from './CardLimitsModal';
import FundCardModal from './FundCardModal';
import { format, subDays, startOfMonth, isAfter } from 'date-fns';
import Modal from '../../common/Modal';

// Card designs with gradients
const cardDesigns = {
  'virtual-debit': 'bg-gradient-to-r from-gray-700 to-gray-900',
  'standard-debit': 'bg-gradient-to-r from-blue-600 to-indigo-800',
  'premium-debit': 'bg-gradient-to-r from-yellow-500 to-purple-800'
};

// Transaction category icons
const categoryIcons = {
  shopping: <FaShoppingBag />,
  food: <FaUtensils />,
  transport: <FaCar />,
  travel: <FaPlane />,
  atm: <FaMoneyBillWave />,
  bills: <FaHome />,
  default: <FaShoppingBag />
};

const CardDetailsPage = () => {
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const card = useSelector(state => selectCardById(state, cardId));
  const transactions = useSelector(state => selectCardTransactions(state, cardId));
  const status = useSelector(selectATMCardsStatus);
  const transactionStatus = useSelector(selectTransactionStatus);
  const transactionError = useSelector(selectTransactionError);
  
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isFundCardModalOpen, setIsFundCardModalOpen] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    merchantName: '',
    category: 'shopping',
    type: 'purchase',
    description: ''
  });
  
  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardTransactions({ cardId }));
    }
  }, [dispatch, cardId]);
  
  // Handle transaction status changes
  useEffect(() => {
    if (transactionStatus === 'succeeded') {
      setAlertMessage({
        type: 'success',
        message: 'Transaction created successfully'
      });
      setShowAlert(true);
      setIsTransactionModalOpen(false);
      setTransactionForm({
        amount: '',
        merchantName: '',
        category: 'shopping',
        type: 'purchase',
        description: ''
      });
      dispatch(clearTransactionStatus());
    } else if (transactionStatus === 'failed' && transactionError) {
      setAlertMessage({
        type: 'error',
        message: transactionError
      });
      setShowAlert(true);
      dispatch(clearTransactionStatus());
    }
  }, [transactionStatus, transactionError, dispatch]);
  
  // Calculate spending metrics based on real transaction data
  const spendingMetrics = useMemo(() => {
    if (!transactions?.data?.length) {
      return {
        monthlySpending: 0,
        atmWithdrawals: 0,
        totalTransactions: 0,
        categorySpending: {}
      };
    }
    
    const firstDayOfMonth = startOfMonth(new Date());
    let monthlySpending = 0;
    let atmWithdrawals = 0;
    const categorySpending = {};
    
    // Process all transactions
    transactions.data.forEach(tx => {
      // Handle purchase and withdrawal transactions for spending
      if (['purchase', 'withdrawal'].includes(tx.type)) {
        // Monthly spending calculation
        const txDate = new Date(tx.date);
        if (isAfter(txDate, firstDayOfMonth)) {
          monthlySpending += tx.amount;
        }
        
        // ATM withdrawals total
        if (tx.type === 'withdrawal' || tx.category === 'atm') {
          atmWithdrawals += tx.amount;
        }
        
        // Category spending totals
        const category = tx.category || 'other';
        if (!categorySpending[category]) {
          categorySpending[category] = 0;
        }
        categorySpending[category] += tx.amount;
      }
    });
    
    // Calculate category percentages
    const totalSpent = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);
    const categoryBreakdown = Object.entries(categorySpending).map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
    })).sort((a, b) => b.amount - a.amount).slice(0, 3); // Top 3 categories
    
    return {
      monthlySpending,
      atmWithdrawals,
      totalTransactions: transactions.data.length,
      categoryBreakdown
    };
  }, [transactions]);
  
  if (!card) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="outline" onClick={() => navigate('/login/cards')}>
              <FaArrowLeft className="mr-2" /> Back to Cards
            </Button>
          </div>
          
          {status === 'loading' ? (
            <div className="flex justify-center py-20">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl text-white mb-2">Card Not Found</h2>
              <p className="text-gray-400 mb-6">The card you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/login/cards')}>
                View All Cards
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }
  
  const handleFreezeCard = async () => {
    await dispatch(freezeCard(card.id || card._id));
    setAlertMessage({
      type: 'success',
      message: 'Card frozen successfully. You can unfreeze it anytime.'
    });
    setShowAlert(true);
  };
  
  const handleUnfreezeCard = async () => {
    await dispatch(unfreezeCard(card.id || card._id));
    setAlertMessage({
      type: 'success',
      message: 'Card unfrozen successfully. You can now use your card again.'
    });
    setShowAlert(true);
  };
  
  const handleCancelCard = async () => {
    if (window.confirm('Are you sure you want to cancel this card? This action cannot be undone.')) {
      await dispatch(cancelCardRequest(card.id || card._id));
      setAlertMessage({
        type: 'success',
        message: 'Card canceled successfully.'
      });
      setShowAlert(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login/cards');
      }, 2000);
    }
  };
  
  const handleLimitsUpdate = (message) => {
    setIsLimitsModalOpen(false);
    setAlertMessage({
      type: 'success',
      message
    });
    setShowAlert(true);
  };
  
  const handleFundCardSuccess = (message) => {
    setIsFundCardModalOpen(false);
    setAlertMessage({
      type: 'success',
      message
    });
    setShowAlert(true);
  };
  
  const handleCreateTransaction = () => {
    if (!transactionForm.amount || isNaN(parseFloat(transactionForm.amount)) || parseFloat(transactionForm.amount) <= 0) {
      setAlertMessage({
        type: 'error',
        message: 'Please enter a valid amount'
      });
      setShowAlert(true);
      return;
    }
    
    if (!transactionForm.merchantName) {
      setAlertMessage({
        type: 'error',
        message: 'Please enter a merchant name'
      });
      setShowAlert(true);
      return;
    }
    
    dispatch(createCardTransaction({
      cardId: card.id || card._id,
      transaction: {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount)
      }
    }));
  };
  
  const handleTransactionFormChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm({
      ...transactionForm,
      [name]: value
    });
  };
  
  // Filter transactions
  const filteredTransactions = transactions?.data?.filter(tx => {
    // Filter by category
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
      return false;
    }
    
    // Filter by date
    const txDate = new Date(tx.date);
    const now = new Date();
    
    if (dateFilter === 'today') {
      const today = new Date(now.setHours(0, 0, 0, 0));
      return isAfter(txDate, today);
    } else if (dateFilter === 'week') {
      const weekAgo = subDays(now, 7);
      return isAfter(txDate, weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = startOfMonth(now);
      return isAfter(txDate, monthAgo);
    }
    
    return true;
  }) || [];
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/login/cards')}>
            <FaArrowLeft className="mr-2" /> Back to Cards
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => setIsFundCardModalOpen(true)}
              disabled={card.status !== 'active'}
            >
              <FaExchangeAlt className="mr-2" /> Fund Card
            </Button>
            
            <Button
              variant="primary"
              onClick={() => setIsTransactionModalOpen(true)}
              disabled={card.status !== 'active'}
            >
              <FaPlus className="mr-2" /> New Transaction
            </Button>
            
            {card.status === 'active' ? (
              <Button
                variant="warning"
                onClick={handleFreezeCard}
                disabled={status === 'loading'}
              >
                <FaLock className="mr-2" /> Freeze Card
              </Button>
            ) : card.status === 'frozen' ? (
              <Button
                variant="success"
                onClick={handleUnfreezeCard}
                disabled={status === 'loading'}
              >
                <FaUnlock className="mr-2" /> Unfreeze Card
              </Button>
            ) : null}
            
            <Button
              variant="outline"
              onClick={() => setIsLimitsModalOpen(true)}
            >
              <FaSlidersH className="mr-2" /> Limits
            </Button>
            
            <Button
              variant="danger"
              onClick={handleCancelCard}
              disabled={status === 'loading'}
            >
              <FaTimes className="mr-2" /> Cancel Card
            </Button>
          </div>
        </div>
        
        {showAlert && (
          <div className="mb-6">
            <Alert
              type={alertMessage.type}
              message={alertMessage.message}
              onDismiss={() => setShowAlert(false)}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Display */}
          <div className="col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className={`${cardDesigns[card.type] || 'bg-gradient-to-r from-gray-700 to-gray-900'} p-6 relative h-48`}>
                {card.status === 'frozen' && (
                  <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium border border-gray-600">
                    <FaLock className="inline mr-1" size={10} /> Frozen
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg">Fidelity First Bank</h3>
                    <p className="text-gray-300 text-xs">
                      {card.type === 'virtual-debit' ? 'Virtual Card' : 
                       card.type === 'standard-debit' ? 'Standard Card' : 'Premium Card'}
                    </p>
                  </div>
                  <FaCreditCard className="text-white/50" size={24} />
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-300 text-xs mb-1">Card Number</p>
                  <p className="text-white font-mono font-medium text-lg tracking-wider">
                    {card.cardNumber ? `**** **** **** ${card.cardNumber.slice(-4)}` : 'XXXX XXXX XXXX XXXX'}
                  </p>
                </div>
                
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-gray-300 text-xs mb-1">Card Holder</p>
                    <p className="text-white font-medium">{card.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs mb-1">Expires</p>
                    <p className="text-white font-medium">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Card Balance</p>
                  <p className="text-white text-2xl font-semibold">
                    ${(card.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Daily Limit</p>
                    <p className="text-white font-medium">
                      ${(card.limits?.daily || 0).toLocaleString()}
                    </p>
                    <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-400 h-full"
                        style={{ width: `${card.limits?.daily ? ((card.limits?.dailyUsed || 0) / card.limits?.daily) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(card.limits?.dailyUsed || 0).toLocaleString()} used
                    </p>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Monthly Limit</p>
                    <p className="text-white font-medium">
                      ${(card.limits?.monthly || 0).toLocaleString()}
                    </p>
                    <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-400 h-full"
                        style={{ width: `${card.limits?.monthly ? ((card.limits?.monthlyUsed || 0) / card.limits?.monthly) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(card.limits?.monthlyUsed || 0).toLocaleString()} used
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transaction Summary */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="bg-primary-600/30 text-primary-400 p-3 rounded-lg mr-3">
                    <FaChartLine size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Monthly Spending</p>
                    <p className="text-white text-xl font-semibold">
                      ${spendingMetrics.monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="bg-green-600/30 text-green-400 p-3 rounded-lg mr-3">
                    <FaMoneyBillWave size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">ATM Withdrawals</p>
                    <p className="text-white text-xl font-semibold">
                      ${spendingMetrics.atmWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="bg-blue-600/30 text-blue-400 p-3 rounded-lg mr-3">
                    <FaHistory size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Transactions</p>
                    <p className="text-white text-xl font-semibold">{spendingMetrics.totalTransactions}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category Summary */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
              <h3 className="text-white font-medium mb-4">Spending by Category</h3>
              {spendingMetrics.categoryBreakdown?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {spendingMetrics.categoryBreakdown.map(category => (
                    <div className="bg-gray-700/50 p-3 rounded-lg" key={category.category}>
                      <div className="flex items-center mb-2">
                        <div className={`bg-${category.category === 'shopping' ? 'red' : category.category === 'food' ? 'yellow' : 'green'}-600/30 text-${category.category === 'shopping' ? 'red' : category.category === 'food' ? 'yellow' : 'green'}-400 p-2 rounded-lg mr-2`}>
                          {categoryIcons[category.category] || categoryIcons.default}
                        </div>
                        <span className="text-white text-sm capitalize">{category.category}</span>
                      </div>
                      <p className="text-white font-medium">
                        ${category.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className={`bg-${category.category === 'shopping' ? 'red' : category.category === 'food' ? 'yellow' : 'green'}-500 h-full`} 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No spending data available</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">Transaction History</h3>
            
            <div className="flex space-x-2">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-gray-700 border border-gray-600 text-white px-3 py-1 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="shopping">Shopping</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="travel">Travel</option>
                  <option value="atm">ATM</option>
                  <option value="bills">Bills</option>
                  <option value="other">Other</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
              </div>
              
              {/* Date Filter */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-gray-700 border border-gray-600 text-white px-3 py-1 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
              </div>
              
              <Button
                variant="outline"
                size="sm"
              >
                <FaDownload className="mr-2" /> Export
              </Button>
            </div>
          </div>
          
          {status === 'loading' ? (
            <div className="flex justify-center py-20">
              <Loader size="lg" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {filteredTransactions.map((tx) => (
                <div key={tx._id || tx.id || tx.transactionId} className="p-4 flex items-center justify-between hover:bg-gray-750">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      tx.type === 'purchase' || tx.type === 'withdrawal'
                        ? 'bg-red-900/30 text-red-400' 
                        : 'bg-green-900/30 text-green-400'
                    }`}>
                      {categoryIcons[tx.category] || categoryIcons.default}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium">{tx.merchantName}</h4>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(tx.date || tx.createdAt), 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-medium ${
                      tx.type === 'purchase' || tx.type === 'withdrawal' ? 
                      'text-red-400' : 'text-green-400'
                    }`}>
                      {tx.type === 'purchase' || tx.type === 'withdrawal' ? '-' : '+'}
                      ${(tx.amount || 0).toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm capitalize">
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-gray-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Transactions Found</h3>
              <p className="text-gray-400">
                {categoryFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try changing your filters to see more transactions.'
                  : 'Start using your card to see transactions here.'}
              </p>
              {card.status === 'active' && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setIsTransactionModalOpen(true)}
                >
                  <FaPlus className="mr-2" /> Create Transaction
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Card Limits Modal */}
      <CardLimitsModal
        isOpen={isLimitsModalOpen}
        onClose={() => setIsLimitsModalOpen(false)}
        card={card}
        onSuccess={handleLimitsUpdate}
      />
      
      {/* Fund Card Modal */}
      <FundCardModal
        isOpen={isFundCardModalOpen}
        onClose={() => setIsFundCardModalOpen(false)}
        card={card}
        onSuccess={handleFundCardSuccess}
      />
      
      {/* Create Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        title="Create New Transaction"
      >
        <div className="p-5">
          {transactionStatus === 'loading' ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleCreateTransaction(); }}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={handleTransactionFormChange}
                    placeholder="0.00"
                    className="bg-gray-800 text-white pl-8 pr-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="merchantName" className="block text-sm font-medium text-gray-300 mb-1">
                  Merchant Name
                </label>
                <input
                  type="text"
                  id="merchantName"
                  name="merchantName"
                  value={transactionForm.merchantName}
                  onChange={handleTransactionFormChange}
                  placeholder="Enter merchant name"
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={transactionForm.category}
                  onChange={handleTransactionFormChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="shopping">Shopping</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="travel">Travel</option>
                  <option value="atm">ATM</option>
                  <option value="bills">Bills</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                  Transaction Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionFormChange}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="purchase">Purchase</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="refund">Refund</option>
                  <option value="deposit">Deposit</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={transactionForm.description}
                  onChange={handleTransactionFormChange}
                  placeholder="Enter transaction description"
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="primary"
                  type="submit"
                >
                  Create Transaction
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CardDetailsPage;
