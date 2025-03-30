import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaSpinner, FaTimes, FaInfoCircle } from 'react-icons/fa';
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FaSpinner className="animate-spin mr-1" />
          Processing
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg border border-gray-700">
        <thead className="bg-gray-900">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Card Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date Requested
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Currency
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {requests.map((request) => (
            <>
              <tr key={request.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{getCardTypeName(request.type)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {format(new Date(request.submittedAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
              {expandedRequest === request.id && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 bg-gray-750">
                    <div className="text-sm text-gray-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Shipping Address</h4>
                          <p>{request.name}</p>
                          <p>{request.address.street}</p>
                          <p>{request.address.city}, {request.address.postalCode}</p>
                          <p>{request.address.country}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-2">Request Details</h4>
                          <p><span className="text-gray-400">Card Type:</span> {getCardTypeName(request.type)}</p>
                          <p><span className="text-gray-400">Currency:</span> {request.currency}</p>
                          <p><span className="text-gray-400">Status:</span> {request.status}</p>
                          {request.notes && (
                            <p><span className="text-gray-400">Notes:</span> {request.notes}</p>
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
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CardRequestsList.propTypes = {
  requests: PropTypes.array.isRequired,
  onRequestAction: PropTypes.func.isRequired
};

export default CardRequestsList;
