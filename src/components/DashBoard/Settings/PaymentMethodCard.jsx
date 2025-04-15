import PropTypes from 'prop-types';
import { FaCreditCard, FaUniversity, FaTrash, FaStar, FaRegStar, FaBitcoin } from 'react-icons/fa';

const PaymentMethodCard = ({ method, onRemove, onSetDefault }) => {
  const isCard = method.type === 'card';
  const isBank = method.type === 'bank_account';
  const isCrypto = method.type === 'crypto_wallet';
  
  // Format expiry date for cards
  const getExpiryDate = () => {
    if (isCard && method.expiryMonth && method.expiryYear) {
      return `${method.expiryMonth.toString().padStart(2, '0')}/${method.expiryYear.toString().substring(2)}`;
    }
    return null;
  };
  
  const getIconBackground = () => {
    if (isCard) return 'bg-blue-900/20 text-blue-500';
    if (isBank) return 'bg-green-900/20 text-green-500';
    if (isCrypto) return 'bg-yellow-900/20 text-yellow-500';
    return 'bg-gray-900/20 text-gray-500';
  };
  
  const getIcon = () => {
    if (isCard) return <FaCreditCard size={20} />;
    if (isBank) return <FaUniversity size={20} />;
    if (isCrypto) return <FaBitcoin size={20} />;
    return null;
  };
  
  return (
    <div className={`
      bg-gray-800 
      border ${method.isDefault ? 'border-primary-500' : 'border-gray-700'} 
      rounded-lg p-4 
      transition-all duration-200 
      ${method.isDefault ? 'shadow-md shadow-primary-900/20' : ''}
    `}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`
            w-12 h-12 
            flex items-center justify-center 
            rounded-full 
            ${getIconBackground()}
            mr-4
          `}>
            {getIcon()}
          </div>
          
          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-200">{method.name}</h4>
              {method.isDefault && (
                <span className="ml-2 px-2 py-0.5 bg-primary-900/20 text-primary-500 text-xs rounded-full">
                  Default
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-400 mt-1">
              {isCard && (
                <span>
                  •••• {method.last4} 
                  {getExpiryDate() && <span className="ml-2">Expires {getExpiryDate()}</span>}
                </span>
              )}
              
              {isBank && (
                <span>
                  {method.bankName} •••{method.last4}
                </span>
              )}
              
              {isCrypto && (
                <span>
                  {method.cryptocurrency} • {method.walletAddress.substring(0, 6)}...{method.walletAddress.substring(method.walletAddress.length - 4)}
                  {method.network && method.network !== 'mainnet' && (
                    <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                      {method.network}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!method.isDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
              title="Set as default"
            >
              <FaRegStar size={16} />
            </button>
          )}
          
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove payment method"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    last4: PropTypes.string,
    isDefault: PropTypes.bool.isRequired,
    expiryMonth: PropTypes.number,
    expiryYear: PropTypes.number,
    bankName: PropTypes.string,
    accountName: PropTypes.string,
    cryptocurrency: PropTypes.string,
    walletAddress: PropTypes.string,
    network: PropTypes.string
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onSetDefault: PropTypes.func.isRequired
};

export default PaymentMethodCard;
