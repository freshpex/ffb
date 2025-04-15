import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPaymentMethods,
  selectUserLoading,
  selectUserError,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod
} from '../../../redux/slices/userSlice';
import { FaCreditCard, FaPlus, FaTrash, FaCheck, FaTimes, FaSpinner, FaUniversity, FaInfoCircle, FaBitcoin } from 'react-icons/fa';
import FormInput from '../../common/FormInput';
import Button from '../../common/Button';
import Alert from '../../common/Alert';
import PaymentMethodCard from './PaymentMethodCard';

const PaymentMethodsTab = () => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector(selectPaymentMethods);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentType, setPaymentType] = useState('card');
  const [success, setSuccess] = useState('');
  
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  
  const [bankFormData, setBankFormData] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    isDefault: false
  });
  
  const [cryptoFormData, setCryptoFormData] = useState({
    walletAddress: '',
    walletType: 'Bitcoin',
    nickname: '',
    isDefault: false
  });
  
  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleBankChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCryptoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCryptoFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format the card data for submission
      const formattedCardData = {
        type: 'card',
        name: `${cardFormData.cardholderName} (${cardFormData.cardNumber.slice(-4)})`,
        cardholderName: cardFormData.cardholderName,
        cardNumber: cardFormData.cardNumber,
        last4: cardFormData.cardNumber.slice(-4),
        expiryMonth: parseInt(cardFormData.expiryMonth),
        expiryYear: parseInt(cardFormData.expiryYear),
        expiryDate: `${cardFormData.expiryMonth}/${cardFormData.expiryYear}`,
        cvv: cardFormData.cvv,
        isDefault: cardFormData.isDefault
      };
      
      const result = await dispatch(addPaymentMethod(formattedCardData));
      
      if (result.success) {
        setCardFormData({
          cardNumber: '',
          cardholderName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          isDefault: false
        });
        setShowAddForm(false);
        setSuccess('Payment method added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };
  
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format the bank data for submission
      const formattedBankData = {
        type: 'bank_account',
        name: `${bankFormData.bankName} (${bankFormData.accountNumber.slice(-4)})`,
        accountName: bankFormData.accountName,
        accountNumber: bankFormData.accountNumber,
        last4: bankFormData.accountNumber.slice(-4),
        routingNumber: bankFormData.routingNumber,
        bankName: bankFormData.bankName,
        isDefault: bankFormData.isDefault
      };
      
      const result = await dispatch(addPaymentMethod(formattedBankData));
      
      if (result.success) {
        setBankFormData({
          accountName: '',
          accountNumber: '',
          routingNumber: '',
          bankName: '',
          isDefault: false
        });
        setShowAddForm(false);
        setSuccess('Payment method added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };
  
  const handleCryptoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedCryptoData = {
        type: 'crypto_wallet',
        name: cryptoFormData.nickname || `${cryptoFormData.walletType} Wallet`,
        walletAddress: cryptoFormData.walletAddress,
        walletType: cryptoFormData.walletType,
        isDefault: cryptoFormData.isDefault
      };
      
      const result = await dispatch(addPaymentMethod(formattedCryptoData));
      
      if (result.success) {
        setCryptoFormData({
          walletAddress: '',
          walletType: 'Bitcoin',
          nickname: '',
          isDefault: false
        });
        setShowAddForm(false);
        setSuccess('Crypto wallet added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to add crypto wallet:', error);
    }
  };
  
  const handleRemove = async (paymentMethodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      try {
        await dispatch(removePaymentMethod(paymentMethodId));
        setSuccess('Payment method removed successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Failed to remove payment method:', error);
      }
    }
  };
  
  const handleSetDefault = async (paymentMethodId) => {
    try {
      await dispatch(setDefaultPaymentMethod(paymentMethodId));
      setSuccess('Default payment method updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Payment Methods</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}
      
      {paymentMethods.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center mb-6">
          <FaCreditCard className="mx-auto text-gray-500 mb-3" size={32} />
          <p className="text-gray-400 mb-4">You haven't added any payment methods yet.</p>
          <Button
            type="button" 
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            Add Payment Method
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-300 mb-3">Your Saved Payment Methods</h3>
          
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onRemove={() => handleRemove(method.id)}
                onSetDefault={() => handleSetDefault(method.id)}
              />
            ))}
          </div>
          
          {!showAddForm && (
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(true)}
                icon={<FaPlus className="mr-2" />}
              >
                Add New Payment Method
              </Button>
            </div>
          )}
        </div>
      )}
      
      {showAddForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-300">
              Add New Payment Method
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm relative ${
                paymentType === 'card' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setPaymentType('card')}
            >
              <span className="flex items-center">
                <FaCreditCard className="mr-2" /> Credit / Debit Card
              </span>
            </button>
            
            <button
              className={`px-4 py-2 font-medium text-sm relative ${
                paymentType === 'bank' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setPaymentType('bank')}
            >
              <span className="flex items-center">
                <FaUniversity className="mr-2" /> Bank Account
              </span>
            </button>
            
            <button
              className={`px-4 py-2 font-medium text-sm relative ${
                paymentType === 'crypto' 
                  ? 'text-primary-500 border-b-2 border-primary-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setPaymentType('crypto')}
            >
              <span className="flex items-center">
                <FaBitcoin className="mr-2" /> Crypto Wallet
              </span>
            </button>
          </div>
          
          {paymentType === 'card' ? (
            <form onSubmit={handleCardSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <FormInput
                  label="Card Number"
                  name="cardNumber"
                  value={cardFormData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                
                <FormInput
                  label="Cardholder Name"
                  name="cardholderName"
                  value={cardFormData.cardholderName}
                  onChange={handleCardChange}
                  placeholder="Name as it appears on card"
                  required
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FormInput
                      label="Expiry Month"
                      name="expiryMonth"
                      value={cardFormData.expiryMonth}
                      onChange={handleCardChange}
                      placeholder="MM"
                      required
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="Expiry Year"
                      name="expiryYear"
                      value={cardFormData.expiryYear}
                      onChange={handleCardChange}
                      placeholder="YYYY"
                      required
                    />
                  </div>
                  
                  <div>
                    <FormInput
                      label="CVV"
                      name="cvv"
                      value={cardFormData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultCard"
                    name="isDefault"
                    checked={cardFormData.isDefault}
                    onChange={handleCardChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="defaultCard" className="ml-2 block text-sm text-gray-300">
                    Set as default payment method
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  icon={isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                >
                  {isLoading ? 'Adding...' : 'Add Card'}
                </Button>
              </div>
            </form>
          ) : paymentType === 'bank' ? (
            <form onSubmit={handleBankSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <FormInput
                  label="Account Holder Name"
                  name="accountName"
                  value={bankFormData.accountName}
                  onChange={handleBankChange}
                  placeholder="Full name on account"
                  required
                />
                
                <FormInput
                  label="Account Number"
                  name="accountNumber"
                  value={bankFormData.accountNumber}
                  onChange={handleBankChange}
                  placeholder="Account number"
                  required
                />
                
                <FormInput
                  label="Routing Number"
                  name="routingNumber"
                  value={bankFormData.routingNumber}
                  onChange={handleBankChange}
                  placeholder="Routing number"
                  required
                />
                
                <FormInput
                  label="Bank Name"
                  name="bankName"
                  value={bankFormData.bankName}
                  onChange={handleBankChange}
                  placeholder="Name of your bank"
                  required
                />
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultBank"
                    name="isDefault"
                    checked={bankFormData.isDefault}
                    onChange={handleBankChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="defaultBank" className="ml-2 block text-sm text-gray-300">
                    Set as default payment method
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  icon={isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                >
                  {isLoading ? 'Adding...' : 'Add Bank Account'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCryptoSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label htmlFor="walletType" className="block text-sm font-medium text-gray-300 mb-1">
                    Cryptocurrency
                  </label>
                  <select
                    id="walletType"
                    name="walletType"
                    value={cryptoFormData.walletType}
                    onChange={handleCryptoChange}
                    className="block w-full rounded-md bg-gray-700 border border-gray-600 py-2 px-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="Bitcoin">Bitcoin (BTC)</option>
                    <option value="Ethereum">Ethereum (ETH)</option>
                    <option value="Solana">Solana (SOL)</option>
                    <option value="Ripple">Ripple (XRP)</option>
                    <option value="Cardano">Cardano (ADA)</option>
                    <option value="BinanceCoin">Binance Coin (BNB)</option>
                    <option value="Polygon">Polygon (MATIC)</option>
                    <option value="Avalanche">Avalanche (AVAX)</option>
                    <option value="Polkadot">Polkadot (DOT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
                
                <FormInput
                  label="Wallet Address"
                  name="walletAddress"
                  value={cryptoFormData.walletAddress}
                  onChange={handleCryptoChange}
                  placeholder="Your cryptocurrency wallet address"
                  required
                />
                
                <FormInput
                  label="Wallet Nickname (Optional)"
                  name="nickname"
                  value={cryptoFormData.nickname}
                  onChange={handleCryptoChange}
                  placeholder="E.g., My Trading BTC Wallet"
                />
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defaultCrypto"
                    name="isDefault"
                    checked={cryptoFormData.isDefault}
                    onChange={handleCryptoChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="defaultCrypto" className="ml-2 block text-sm text-gray-300">
                    Set as default payment method
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  icon={isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                >
                  {isLoading ? 'Adding...' : 'Add Crypto Wallet'}
                </Button>
              </div>
              
              <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-md">
                <p className="text-xs text-gray-300">
                  <FaInfoCircle className="inline-block mr-1 text-yellow-500" />
                  Make sure to double-check your wallet address. Cryptocurrency transactions cannot be reversed.
                </p>
              </div>
            </form>
          )}
          
          <div className="mt-4 bg-blue-900/20 border border-blue-500/30 p-3 rounded-md">
            <p className="text-xs text-gray-300">
              <FaInfoCircle className="inline-block mr-1 text-blue-500" />
              Your payment information is encrypted and securely stored. We comply with PCI DSS standards for handling financial data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsTab;
