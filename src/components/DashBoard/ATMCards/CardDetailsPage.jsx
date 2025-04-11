import { useEffect, useState } from 'react';
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
  FaSlidersH
} from 'react-icons/fa';
import { 
  fetchCardTransactions, 
  selectCardById, 
  selectCardTransactions,
  selectATMCardsStatus,
  freezeCard,
  unfreezeCard,
  cancelCardRequest 
} from '../../../redux/slices/atmCardsSlice';
import DashboardLayout from '../DashboardLayout';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import Alert from '../../common/Alert';
import CardLimitsModal from './CardLimitsModal';
import { format } from 'date-fns';

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
  console.log("card", card)
  const transactions = useSelector(state => selectCardTransactions(state, cardId));
  console.log("transactions", transactions);
  const status = useSelector(selectATMCardsStatus);
  
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  
  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardTransactions({ cardId }));
    }
  }, [dispatch, cardId]);
  
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
    await dispatch(freezeCard(card.id));
    setAlertMessage({
      type: 'success',
      message: 'Card frozen successfully. You can unfreeze it anytime.'
    });
    setShowAlert(true);
  };
  
  const handleUnfreezeCard = async () => {
    await dispatch(unfreezeCard(card.id));
    setAlertMessage({
      type: 'success',
      message: 'Card unfrozen successfully. You can now use your card again.'
    });
    setShowAlert(true);
  };
  
  const handleCancelCard = async () => {
    if (window.confirm('Are you sure you want to cancel this card? This action cannot be undone.')) {
      await dispatch(cancelCardRequest(card.id));
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
      return txDate >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return txDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return txDate >= monthAgo;
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
            {card.frozen ? (
              <Button
                variant="success"
                onClick={handleUnfreezeCard}
                disabled={status === 'loading'}
              >
                <FaUnlock className="mr-2" /> Unfreeze Card
              </Button>
            ) : (
              <Button
                variant="warning"
                onClick={handleFreezeCard}
                disabled={status === 'loading'}
              >
                <FaLock className="mr-2" /> Freeze Card
              </Button>
            )}
            
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
              <div className={`${cardDesigns[card.type]} p-6 relative h-48`}>
                {card.frozen && (
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
                    {card.cardNumber}
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
                    ${card.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Daily Limit</p>
                    <p className="text-white font-medium">
                      ${card.limits.daily.toLocaleString()}
                    </p>
                    <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-400 h-full"
                        style={{ width: `${(card.limits.dailyUsed / card.limits.daily) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${card.limits.dailyUsed.toLocaleString()} used
                    </p>
                  </div>
                  
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Monthly Limit</p>
                    <p className="text-white font-medium">
                      ${card.limits.monthly.toLocaleString()}
                    </p>
                    <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-400 h-full"
                        style={{ width: `${(card.limits.monthlyUsed / card.limits.monthly) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${card.limits.monthlyUsed.toLocaleString()} used
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
                    <p className="text-white text-xl font-semibold">$1,245.78</p>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="bg-green-600/30 text-green-400 p-3 rounded-lg mr-3">
                    <FaMoneyBillWave size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">ATM Withdrawals</p>
                    <p className="text-white text-xl font-semibold">$400.00</p>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                  <div className="bg-blue-600/30 text-blue-400 p-3 rounded-lg mr-3">
                    <FaHistory size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Transactions</p>
                    <p className="text-white text-xl font-semibold">{transactions?.data?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category Summary (Simplified) */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
              <h3 className="text-white font-medium mb-4">Spending by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-600/30 text-red-400 p-2 rounded-lg mr-2">
                      <FaShoppingBag size={14} />
                    </div>
                    <span className="text-white text-sm">Shopping</span>
                  </div>
                  <p className="text-white font-medium">$350.22</p>
                  <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-yellow-600/30 text-yellow-400 p-2 rounded-lg mr-2">
                      <FaUtensils size={14} />
                    </div>
                    <span className="text-white text-sm">Food</span>
                  </div>
                  <p className="text-white font-medium">$275.50</p>
                  <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-600/30 text-green-400 p-2 rounded-lg mr-2">
                      <FaMoneyBillWave size={14} />
                    </div>
                    <span className="text-white text-sm">ATM</span>
                  </div>
                  <p className="text-white font-medium">$400.00</p>
                  <div className="mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
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
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-750">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      tx.type === 'purchase' 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'bg-green-900/30 text-green-400'
                    }`}>
                      {categoryIcons[tx.category] || categoryIcons.default}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium">{tx.merchantName}</h4>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(tx.date), 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-white'}`}>
                      {tx.type === 'withdrawal' ? '-' : ''}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm">
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
      
      <CardLimitsModal
        isOpen={isLimitsModalOpen}
        onClose={() => setIsLimitsModalOpen(false)}
        card={card}
        onSuccess={handleLimitsUpdate}
      />
    </DashboardLayout>
  );
};

export default CardDetailsPage;
