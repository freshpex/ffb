import PropTypes from 'prop-types';
import { FaCreditCard, FaUniversity, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';

const PaymentMethodCard = ({ method, onRemove, onSetDefault }) => {
  const isCard = method.type === 'card';
  
  // Format expiry date for cards
  const getExpiryDate = () => {
    if (isCard && method.expiryMonth && method.expiryYear) {
      return `${method.expiryMonth.toString().padStart(2, '0')}/${method.expiryYear.toString().substring(2)}`;
    }
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
            ${isCard ? 'bg-blue-900/20 text-blue-500' : 'bg-green-900/20 text-green-500'}
            mr-4
          `}>
            {isCard ? <FaCreditCard size={20} /> : <FaUniversity size={20} />}
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
              {isCard ? (
                <span>
                  •••• {method.last4} 
                  {getExpiryDate() && <span className="ml-2">Expires {getExpiryDate()}</span>}
                </span>
              ) : (
                <span>
                  {method.bankName} •••{method.last4}
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
    last4: PropTypes.string.isRequired,
    isDefault: PropTypes.bool.isRequired,
    // Card specific props
    expiryMonth: PropTypes.number,
    expiryYear: PropTypes.number,
    // Bank specific props
    bankName: PropTypes.string,
    accountName: PropTypes.string
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onSetDefault: PropTypes.func.isRequired
};

export default PaymentMethodCard;
