import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PaymentMethodCard = ({ 
  icon, 
  name, 
  details, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center shadow-md">
      <div className="mr-4 text-2xl text-primary-500">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-200">{name}</h3>
        <p className="text-sm text-gray-400">{details}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-primary-500 transition-colors rounded-full hover:bg-gray-700"
          aria-label={`Edit ${name}`}
        >
          <FaEdit />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-700"
          aria-label={`Delete ${name}`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PaymentMethodCard;
