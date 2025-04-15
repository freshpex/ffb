import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaBell, 
  FaPlus, 
  FaTrash, 
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import { 
  addPriceAlert, 
  removePriceAlert, 
  selectPriceAlerts,
  selectDashboardComponentStatus,
  fetchPriceAlerts
} from '../../redux/slices/dashboardSlice';
import CardLoader from '../common/CardLoader';

const PriceAlerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(selectPriceAlerts);
  const [isLoading, setIsLoading] = useState(true);
  console.log("Alerts", alerts);
  const componentStatus = useSelector(state => 
    selectDashboardComponentStatus(state, 'priceAlerts')
  );
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: 'BTC',
    condition: 'above',
    price: ''
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPriceAlerts());
      } finally {
        setIsLoading(false);
      }
    };
      
    loadData();
  }, [dispatch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddAlert = () => {
    if (!newAlert.price || isNaN(newAlert.price) || parseFloat(newAlert.price) <= 0) {
      return;
    }
    
    dispatch(addPriceAlert({
      id: `alert_${Date.now()}`,
      symbol: newAlert.symbol,
      condition: newAlert.condition,
      price: parseFloat(newAlert.price),
      createdAt: new Date().toISOString()
    }));
    
    setNewAlert({
      symbol: 'BTC',
      condition: 'above',
      price: ''
    });
    setShowAddForm(false);
  };
  
  const handleRemoveAlert = (alertId) => {
    dispatch(removePriceAlert(alertId));
  };
  
  // If the component is loading, show a skeleton loader
  if (componentStatus === 'loading') {
    return <CardLoader title="Price Alerts" height="h-64" />;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Price Alerts</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="text-primary-500 text-sm flex items-center hover:text-primary-400"
        >
          <FaPlus className="mr-1" size={12} /> Add Alert
        </button>
      </div>
      
      {showAddForm && (
        <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-200">New Price Alert</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <FaTimes size={14} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select
                name="symbol"
                value={newAlert.symbol}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="LTC">Litecoin (LTC)</option>
                <option value="XRP">Ripple (XRP)</option>
                <option value="ADA">Cardano (ADA)</option>
              </select>
              
              <select
                name="condition"
                value={newAlert.condition}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 text-sm rounded-lg block w-full p-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
            </div>
            
            <div className="flex">
              <input
                type="text"
                name="price"
                value={newAlert.price}
                onChange={handleInputChange}
                placeholder="Enter price..."
                className="bg-gray-700 border border-gray-600 text-sm rounded-l-lg block w-full p-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddAlert}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg text-sm px-4 py-2 flex items-center"
              >
                <FaCheck className="mr-1" size={12} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert._id} className="bg-gray-700/50 rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-100 font-medium">{alert.symbol}</span>
                <span className="text-gray-400">{alert.condition === 'above' ? 'above' : 'below'}</span>
                <span className="text-primary-500 font-medium">${alert.price.toLocaleString()}</span>
                <p className="text-xs text-gray-400">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemoveAlert(alert._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-700/30 p-4 rounded-lg text-center h-32 flex flex-col items-center justify-center">
          <FaBell className="text-gray-500 mb-2" size={24} />
          <p className="text-gray-400">No price alerts set</p>
          <p className="text-xs text-gray-500">Create an alert to get notified when prices change</p>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
