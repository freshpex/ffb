import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaTimes, 
  FaCheck,
  FaRegCreditCard,
  FaArrowRight
} from 'react-icons/fa';
import { requestCard, selectCardTypes } from '../../../redux/slices/atmCardsSlice';
import { selectUserProfile } from '../../../redux/slices/userSlice';
import Button from '../../common/Button';

const NewCardModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const cardTypes = useSelector(selectCardTypes);
  const userProfile = useSelector(selectUserProfile);
  
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [shipping, setShipping] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setStep(1);
      setSelectedType(null);
      setCurrency('USD');
      setError('');
      
      // Pre-fill shipping info from user profile if available
      if (userProfile) {
        setShipping({
          name: userProfile.fullName || '',
          street: userProfile.address?.street || '',
          city: userProfile.address?.city || '',
          postalCode: userProfile.address?.postalCode || '',
          country: userProfile.address?.country || ''
        });
      }
    }
  }, [isOpen, userProfile]);
  
  const handleNext = () => {
    if (step === 1 && !selectedType) {
      setError('Please select a card type');
      return;
    }
    
    setError('');
    setStep(step + 1);
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
    setError('');
  };
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!selectedType) {
      setError('Please select a card type');
      return false;
    }
    
    if (!currency) {
      setError('Please select a currency');
      return false;
    }
    
    // Only validate shipping address for physical cards
    if (selectedType !== 'virtual-debit') {
      if (!shipping.name.trim()) {
        setError('Please enter your name');
        return false;
      }
      
      if (!shipping.street.trim()) {
        setError('Please enter your street address');
        return false;
      }
      
      if (!shipping.city.trim()) {
        setError('Please enter your city');
        return false;
      }
      
      if (!shipping.postalCode.trim()) {
        setError('Please enter your postal code');
        return false;
      }
      
      if (!shipping.country.trim()) {
        setError('Please enter your country');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      const cardData = {
        type: selectedType,
        currency,
        name: shipping.name,
        address: selectedType === 'virtual-debit' ? null : {
          street: shipping.street,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country
        }
      };
      
      await dispatch(requestCard(cardData));
      
      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to request card. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-gray-900 px-4 py-3 sm:px-6 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-white flex items-center">
              <FaCreditCard className="mr-2 text-primary-500" /> 
              Request New Payment Card
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`flex h-8 w-8 rounded-full items-center justify-center ${
                    step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    1
                  </span>
                  <span className="ml-2 text-sm text-gray-400">Select Card</span>
                </div>
                <div className="w-16 h-1 bg-gray-700">
                  <div className={`h-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-700'}`}></div>
                </div>
                <div className="flex items-center">
                  <span className={`flex h-8 w-8 rounded-full items-center justify-center ${
                    step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    2
                  </span>
                  <span className="ml-2 text-sm text-gray-400">Details</span>
                </div>
                <div className="w-16 h-1 bg-gray-700">
                  <div className={`h-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-700'}`}></div>
                </div>
                <div className="flex items-center">
                  <span className={`flex h-8 w-8 rounded-full items-center justify-center ${
                    step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    3
                  </span>
                  <span className="ml-2 text-sm text-gray-400">Confirm</span>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-900/30 border border-red-600 text-red-500 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Select Card Type</h4>
                    
                    {cardTypes.map((cardType) => (
                      <div 
                        key={cardType.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                          selectedType === cardType.id 
                            ? 'border-primary-500 bg-primary-900/20' 
                            : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedType(cardType.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              cardType.id === 'virtual-debit' ? 'bg-gray-700' :
                              cardType.id === 'standard-debit' ? 'bg-blue-900/30' : 'bg-yellow-900/30'
                            }`}>
                              <FaRegCreditCard 
                                size={24} 
                                className={
                                  cardType.id === 'virtual-debit' ? 'text-gray-400' :
                                  cardType.id === 'standard-debit' ? 'text-blue-400' : 'text-yellow-400'
                                }
                              />
                            </div>
                            <div className="ml-4">
                              <h5 className="text-white font-medium">{cardType.name}</h5>
                              <p className="text-sm text-gray-400">{cardType.description}</p>
                            </div>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedType === cardType.id 
                              ? 'border-primary-500' 
                              : 'border-gray-600'
                          }`}>
                            {selectedType === cardType.id && (
                              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 pl-16">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              Issuance Fee:
                            </div>
                            <div className="text-sm text-white font-medium">
                              {cardType.fee === 0 ? 'Free' : `$${cardType.fee.toFixed(2)}`}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              Monthly Fee:
                            </div>
                            <div className="text-sm text-white font-medium">
                              {cardType.monthlyFee === 0 ? 'Free' : `$${cardType.monthlyFee.toFixed(2)}`}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              Processing Time:
                            </div>
                            <div className="text-sm text-white font-medium">
                              {cardType.processingTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Card Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        {selectedType === 'premium-debit' && (
                          <>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    {selectedType !== 'virtual-debit' && (
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-white font-medium mb-3">Shipping Information</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={shipping.name}
                              onChange={handleShippingChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                            <input
                              type="text"
                              name="street"
                              value={shipping.street}
                              onChange={handleShippingChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                              <input
                                type="text"
                                name="city"
                                value={shipping.city}
                                onChange={handleShippingChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                              <input
                                type="text"
                                name="postalCode"
                                value={shipping.postalCode}
                                onChange={handleShippingChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                            <input
                              type="text"
                              name="country"
                              value={shipping.country}
                              onChange={handleShippingChange}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Confirm Request</h4>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="mb-3">
                        <h5 className="text-white font-medium mb-2">Card Information</h5>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{cardTypes.find(ct => ct.id === selectedType)?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Currency:</span>
                          <span className="text-white">{currency}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Issuance Fee:</span>
                          <span className="text-white">{cardTypes.find(ct => ct.id === selectedType)?.fee === 0 ? 'Free' : `$${cardTypes.find(ct => ct.id === selectedType)?.fee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Processing Time:</span>
                          <span className="text-white">{cardTypes.find(ct => ct.id === selectedType)?.processingTime}</span>
                        </div>
                      </div>
                      
                      {selectedType !== 'virtual-debit' && (
                        <div>
                          <h5 className="text-white font-medium mb-2">Shipping Address</h5>
                          <div className="text-sm text-gray-300">
                            <p>{shipping.name}</p>
                            <p>{shipping.street}</p>
                            <p>{shipping.city}, {shipping.postalCode}</p>
                            <p>{shipping.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center p-4 bg-gray-900/50 rounded-lg text-sm">
                      <FaShieldAlt className="text-primary-500 mr-3 flex-shrink-0" size={16} />
                      <p className="text-gray-300">
                        By requesting this card, you agree to our <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-500 hover:underline">Card Agreement</a>.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next <FaArrowRight className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                <FaCheck className="mr-2" /> Submit Request
              </Button>
            )}
            
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="mt-3 sm:mt-0 sm:mr-3"
              >
                Back
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

NewCardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default NewCardModal;
