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
  FaExchangeAlt,
  FaWifi
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
import DashboardLayout from '../Layout/DashboardLayout';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import Alert from '../../common/Alert';
import CardLimitsModal from './CardLimitsModal';
import FundCardModal from './FundCardModal';
import { format, subDays, startOfMonth, isAfter } from 'date-fns';

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
  console.log("Card", card);
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
    type: 'transfer',
    description: ''
  });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
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
  
  const handleFreezeCard = () => {
    dispatch(freezeCard(card.id || card._id));
    setAlertMessage({
      type: 'success',
      message: 'Card frozen successfully. You can unfreeze it anytime.'
    });
    setShowAlert(true);
  };
  
  const handleUnfreezeCard = () => {
    dispatch(unfreezeCard(card.id || card._id));
    setAlertMessage({
      type: 'success',
      message: 'Card unfrozen successfully. You can now use your card again.'
    });
    setShowAlert(true);
  };
  
  const handleCancelCard = () => {
    if (window.confirm('Are you sure you want to cancel this card? This action cannot be undone.')) {
      dispatch(cancelCardRequest(card.id || card._id));
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

  // Function to toggle card flip
  const toggleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <Button variant="outline" onClick={() => navigate('/login/cards')} className="w-full sm:w-auto">
            Back to Cards
          </Button>
          
          <div className="grid grid-cols-2 sm:flex sm:space-x-2 gap-2">
            <Button
              variant="primary"
              onClick={() => setIsFundCardModalOpen(true)}
              disabled={card.status !== 'active'}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >Fund
            </Button>
            
            <Button
              variant="primary"
              onClick={() => setIsTransactionModalOpen(true)}
              disabled={card.status !== 'active'}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >New Tx
            </Button>
            
            {card.status === 'active' ? (
              <Button
                variant="warning"
                onClick={handleFreezeCard}
                disabled={status === 'loading'}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >Freeze
              </Button>
            ) : card.status === 'frozen' ? (
              <Button
                variant="success"
                onClick={handleUnfreezeCard}
                disabled={status === 'loading'}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >Unfreeze
              </Button>
            ) : null}
            
            <Button
              variant="outline"
              onClick={() => setIsLimitsModalOpen(true)}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >Limits
            </Button>
            
            <Button
              variant="danger"
              onClick={handleCancelCard}
              disabled={status === 'loading'}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >Cancel
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
          {/* Enhanced Card Display with Flip Animation */}
          <div className="col-span-1">
            <div className="h-64 w-full perspective-1000">
              <motion.div
                className="relative w-full h-full cursor-pointer transform-style-3d"
                animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                onClick={toggleCardFlip}
                style={{ 
                  transformStyle: "preserve-3d", 
                  transition: "transform 0.5s" 
                }}
              >
                {/* Front of card */}
                <div 
                  className="absolute w-full h-full rounded-xl overflow-hidden shadow-2xl" 
                  style={{ 
                    backfaceVisibility: "hidden"
                  }}
                >
                  <div className={`${cardDesigns[card.type] || 'bg-gradient-to-r from-gray-700 to-gray-900'} p-6 relative h-full`}>
                    {card.status === 'frozen' && (
                      <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium border border-gray-600 z-10">
                        <FaLock className="inline mr-1" size={10} /> Frozen
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-lg">Fidelity First Bank</h3>
                        <p className="text-gray-100/80 text-xs">
                          {card.type === 'virtual-debit' ? 'Virtual Card' : 
                           card.type === 'standard-debit' ? 'Standard Card' : 'Premium Card'}
                        </p>
                      </div>
                      <FaWifi className="text-white/70 rotate-90" size={24} />
                    </div>
                    
                    {/* Chip image */}
                    <div className="mt-4 mb-4">
                      <div className="w-12 h-9 bg-yellow-600/90 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <div className="w-10 h-7 border border-yellow-800/30 rounded-sm bg-gradient-to-bl from-yellow-500/80 to-yellow-600/80"></div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                    <>
                      <span className="mr-3">{card.cardNumber.slice(0, 4)}</span>
                      <span className="mr-3">{card.cardNumber.slice(4, 8)}</span>
                      <span className="mr-3">{card.cardNumber.slice(8, 12)}</span>
                      <span>{card.cardNumber.slice(12, 16)}</span>
                    </>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-gray-200/70 text-xs mb-1">Card Holder</p>
                        <p className="text-white font-medium uppercase">{card.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-200/70 text-xs mb-1">Expires</p>
                        <p className="text-white font-medium">{card.expiryDate}</p>
                      </div>
                    </div>

                    {/* Card type logo */}
                    <div className="absolute bottom-4 right-6">
                      <FaCreditCard className="text-white/80" size={28} />
                    </div>
                  </div>
                </div>
                
                {/* Back of card */}
                <div 
                  className="absolute w-full h-full rounded-xl overflow-hidden shadow-2xl" 
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)" 
                  }}
                >
                  <div className={`${cardDesigns[card.type] || 'bg-gradient-to-r from-gray-700 to-gray-900'} p-0 relative h-full`}>
                    <div className="w-full h-12 bg-gray-900 mt-6"></div>
                    
                    {/* Signature strip */}
                    <div className="p-6">
                      <div className="mt-4 bg-white h-10 rounded-md flex justify-end items-center pr-3">
                        <div className="bg-white px-2 py-1">
                          <p className="text-gray-800 font-mono font-bold">CVV: {card.cvv}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-xs text-gray-200/80">
                        <p>This card is property of Fidelity First Bank. If found, please return to the nearest branch.</p>
                        <p className="mt-2">For customer service, please call: 1-800-123-4567</p>
                      </div>
                      
                      <div className="absolute bottom-6 right-6">
                        <FaCreditCard className="text-white/80" size={28} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mt-4">
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Card Balance</p>
                <p className="text-white text-2xl font-semibold">
                  ${(card.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Limits display remains the same */}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-700 space-y-3 sm:space-y-0">
            <h3 className="text-white font-medium">Transaction History</h3>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
    </DashboardLayout>
  );
};

export default CardDetailsPage;
