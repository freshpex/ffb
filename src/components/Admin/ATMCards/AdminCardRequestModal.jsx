import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCreditCard, FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const AdminCardRequestModal = ({ isOpen, onClose, card, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  
  if (!card) return null;
  
  const handleApprove = () => {
    onApprove(card._id);
  };
  
  const handleShowRejectForm = () => {
    setIsRejecting(true);
  };
  
  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(card._id, rejectionReason);
    }
  };
  
  const handleClose = () => {
    setRejectionReason('');
    setIsRejecting(false);
    onClose();
  };
  
  // Format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={`Card Request Details${card.status !== 'pending' ? ` (${card.status})` : ''}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <FaUser className="text-primary-500 mr-2" /> Customer Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{card.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{card.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-medium">{card.user._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Request Date</p>
                <p className="font-medium">{new Date(card.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Information */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <FaCreditCard className="text-primary-500 mr-2" /> Card Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Card Type</p>
                <p className="font-medium capitalize">{card.type.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className={`font-medium capitalize ${
                  card.status === 'active' ? 'text-green-600 dark:text-green-400' : 
                  card.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                  card.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>{card.status}</p>
              </div>
              
              {/* Only display card details for approved cards */}
              {(card.status === 'active' || card.status === 'frozen') && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Card Number</p>
                    <p className="font-medium">{card.cardNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                    <p className="font-medium">{card.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CVV</p>
                    <p className="font-medium">{card.cvv}</p>
                  </div>
                </>
              )}
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                <p className="font-medium">{card.currency}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping Address (if applicable) */}
        {card.shippingAddress && ['standard-debit', 'premium-debit'].includes(card.type) && (
          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <FaMapMarkerAlt className="text-primary-500 mr-2" /> Shipping Address
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="font-medium">{formatAddress(card.shippingAddress)}</p>
            </div>
          </div>
        )}
        
        {/* Rejection Reason (if applicable) */}
        {card.status === 'rejected' && card.rejectionReason && (
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Rejection Reason</h3>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
              {card.rejectionReason}
            </div>
          </div>
        )}
        
        {/* Processing Timeline (if applicable) */}
        {['processing', 'shipped'].includes(card.status) && (
          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <FaCalendarAlt className="text-primary-500 mr-2" /> Processing Timeline
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Request Submitted: {new Date(card.createdAt).toLocaleString()}</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Request Approved: {new Date().toLocaleString()}</span>
                </li>
                {card.status === 'shipped' && card.shippedAt && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Card Shipped: {new Date(card.shippedAt).toLocaleString()}</span>
                  </li>
                )}
                {card.status === 'processing' && (
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm">Card Production: In Progress</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {/* Admin Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5">
          {card.status === 'pending' ? (
            !isRejecting ? (
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleShowRejectForm}>
                  Reject
                </Button>
                <Button variant="success" onClick={handleApprove}>
                  Approve
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Please provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={() => setIsRejecting(false)}>
                    Back
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={handleReject} 
                    disabled={!rejectionReason.trim()}
                  >
                    Submit Rejection
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

AdminCardRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  card: PropTypes.object,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default AdminCardRequestModal;