import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaSpinner, FaTimes, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { cancelCardRequest } from '../../../redux/slices/atmCardsSlice';
import Button from '../../common/Button';

const getCardTypeName = (type) => {
  switch (type) {
    case 'virtual-debit': return 'Virtual Card';
    case 'standard-debit': return 'Standard Card';
    case 'premium-debit': return 'Premium Card';
    default: return 'Credit Card';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Pending
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Approved
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          <FaSpinner className="animate-spin mr-1" />
          Processing
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {status}
        </span>
      );
  }
};

const CardRequestsList = ({ requests, onRequestAction }) => {
  const dispatch = useDispatch();
  const [expandedRequest, setExpandedRequest] = useState(null);
  
  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this card request?')) {
      await dispatch(cancelCardRequest(requestId));
      onRequestAction('cancelRequest', 'Card request canceled successfully.');
    }
  };
  
  const toggleExpandRequest = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };
  
  return (
    <div>
      {/* Desktop View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Card Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date Requested
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Currency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{getCardTypeName(request.type)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {format(new Date(request.submittedAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {request.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toggleExpandRequest(request.id)}
                      className="text-primary-500 hover:text-primary-400"
                    >
                      <FaInfoCircle />
                    </button>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {getCardTypeName(request.type)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format(new Date(request.submittedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(request.status)}
                  <button
                    onClick={() => toggleExpandRequest(request.id)}
                    className="ml-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    {expandedRequest === request.id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Currency: <span className="text-gray-900 dark:text-white">{request.currency}</span>
                </span>
              </div>
              
              {expandedRequest === request.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address</h4>
                      <p className="text-sm text-gray-900 dark:text-white">{request.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{request.address.street}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {request.address.city}, {request.address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{request.address.country}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Request Details</h4>
                      <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">Card Type:</span> <span className="text-gray-900 dark:text-white">{getCardTypeName(request.type)}</span></p>
                      <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">Currency:</span> <span className="text-gray-900 dark:text-white">{request.currency}</span></p>
                      <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">Status:</span> <span className="text-gray-900 dark:text-white">{request.status}</span></p>
                      {request.notes && (
                        <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">Notes:</span> <span className="text-gray-900 dark:text-white">{request.notes}</span></p>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick actions below */}
            {request.status === 'pending' && expandedRequest !== request.id && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 text-right border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => handleCancelRequest(request.id)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Expanded request details for desktop */}
      {expandedRequest && (
        <div className="hidden md:block mt-4 bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          {requests.filter(r => r.id === expandedRequest).map(request => (
            <div key={`detail-${request.id}`} className="text-sm text-gray-600 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                  <p>{request.name}</p>
                  <p>{request.address.street}</p>
                  <p>{request.address.city}, {request.address.postalCode}</p>
                  <p>{request.address.country}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Request Details</h4>
                  <p><span className="text-gray-500 dark:text-gray-400">Card Type:</span> {getCardTypeName(request.type)}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Currency:</span> {request.currency}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Status:</span> {request.status}</p>
                  {request.notes && (
                    <p><span className="text-gray-500 dark:text-gray-400">Notes:</span> {request.notes}</p>
                  )}
                </div>
              </div>
              {request.status === 'pending' && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelRequest(request.id)}
                  >
                    Cancel Request
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CardRequestsList.propTypes = {
  requests: PropTypes.array.isRequired,
  onRequestAction: PropTypes.func.isRequired
};

export default CardRequestsList;
