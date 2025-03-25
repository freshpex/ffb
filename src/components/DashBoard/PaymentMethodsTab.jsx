import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaBitcoin, 
  FaEthereum, 
  FaCreditCard, 
  FaPlus,
  FaUniversity
} from 'react-icons/fa';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import PaymentMethodCard from './PaymentMethodCard';
import Alert from '../common/Alert';
import { 
  selectUserPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod
} from '../../redux/slices/userSlice';

const PaymentMethodsTab = () => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector(selectUserPaymentMethods);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'bitcoin',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      type: 'bitcoin',
      address: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      accountNumber: '',
      routingNumber: '',
      bankName: ''
    });
  };

  const handleEdit = (method) => {
    setShowAddForm(true);
    setEditingId(method.id);
    setFormData({
      type: method.type,
      address: method.address || '',
      cardNumber: method.cardNumber || '',
      expiryDate: method.expiryDate || '',
      cvv: method.cvv || '',
      accountNumber: method.accountNumber || '',
      routingNumber: method.routingNumber || '',
      bankName: method.bankName || ''
    });
  };

  const handleDelete = (id) => {
    dispatch(removePaymentMethod(id));
    setMessage({
      type: 'success',
      text: 'Payment method deleted successfully!'
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMethod = {
      id: editingId || Date.now().toString(),
      type: formData.type,
      ...getTypeSpecificData()
    };
    
    if (editingId) {
      dispatch(updatePaymentMethod(newMethod));
      setMessage({
        type: 'success',
        text: 'Payment method updated successfully!'
      });
    } else {
      dispatch(addPaymentMethod(newMethod));
      setMessage({
        type: 'success',
        text: 'Payment method added successfully!'
      });
    }
    
    setShowAddForm(false);
    setEditingId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const getTypeSpecificData = () => {
    switch (formData.type) {
      case 'bitcoin':
      case 'ethereum':
        return { address: formData.address };
      case 'card':
        return { 
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        };
      case 'bank':
        return {
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
          bankName: formData.bankName
        };
      default:
        return {};
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'bitcoin':
        return <FaBitcoin />;
      case 'ethereum':
        return <FaEthereum />;
      case 'card':
        return <FaCreditCard />;
      case 'bank':
        return <FaUniversity />;
      default:
        return <FaBitcoin />;
    }
  };

  const getMethodDetails = (method) => {
    switch (method.type) {
      case 'bitcoin':
      case 'ethereum':
        return maskAddress(method.address);
      case 'card':
        return `**** **** **** ${method.cardNumber.slice(-4)}`;
      case 'bank':
        return `${method.bankName} ****${method.accountNumber.slice(-4)}`;
      default:
        return '';
    }
  };

  const maskAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {message && (
        <Alert 
          type={message.type} 
          message={message.text} 
          onDismiss={() => setMessage(null)} 
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-200">Your Payment Methods</h3>
        {!showAddForm && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddNew}
          >
            <FaPlus className="mr-2" /> Add New
          </Button>
        )}
      </div>
      
      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-medium text-gray-200 mb-4">
            {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className={`
                flex flex-col items-center p-3 border rounded-lg cursor-pointer
                ${formData.type === 'bitcoin' 
                  ? 'border-primary-500 bg-primary-900/20' 
                  : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="bitcoin"
                  checked={formData.type === 'bitcoin'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaBitcoin className="text-2xl mb-2 text-yellow-500" />
                <span className="text-sm">Bitcoin</span>
              </label>
              
              <label className={`
                flex flex-col items-center p-3 border rounded-lg cursor-pointer
                ${formData.type === 'ethereum' 
                  ? 'border-primary-500 bg-primary-900/20' 
                  : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="ethereum"
                  checked={formData.type === 'ethereum'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaEthereum className="text-2xl mb-2 text-blue-400" />
                <span className="text-sm">Ethereum</span>
              </label>
              
              <label className={`
                flex flex-col items-center p-3 border rounded-lg cursor-pointer
                ${formData.type === 'card' 
                  ? 'border-primary-500 bg-primary-900/20' 
                  : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="card"
                  checked={formData.type === 'card'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaCreditCard className="text-2xl mb-2 text-gray-300" />
                <span className="text-sm">Credit Card</span>
              </label>
              
              <label className={`
                flex flex-col items-center p-3 border rounded-lg cursor-pointer
                ${formData.type === 'bank' 
                  ? 'border-primary-500 bg-primary-900/20' 
                  : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900'
                }
              `}>
                <input
                  type="radio"
                  name="type"
                  value="bank"
                  checked={formData.type === 'bank'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <FaUniversity className="text-2xl mb-2 text-gray-300" />
                <span className="text-sm">Bank Account</span>
              </label>
            </div>
          </div>
          
          {(formData.type === 'bitcoin' || formData.type === 'ethereum') && (
            <FormInput
              label={`${formData.type === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} Wallet Address`}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={`Enter your ${formData.type === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} wallet address`}
              required
            />
          )}
          
          {formData.type === 'card' && (
            <>
              <FormInput
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="Enter card number"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Expiry Date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
                
                <FormInput
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="CVV"
                  required
                />
              </div>
            </>
          )}
          
          {formData.type === 'bank' && (
            <>
              <FormInput
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
              />
              
              <FormInput
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                required
              />
              
              <FormInput
                label="Routing Number"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                placeholder="Enter routing number"
                required
              />
            </>
          )}
          
          <div className="flex space-x-3 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Update Method' : 'Add Method'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <PaymentMethodCard
                key={method.id}
                icon={getMethodIcon(method.type)}
                name={method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                details={getMethodDetails(method)}
                onEdit={() => handleEdit(method)}
                onDelete={() => handleDelete(method.id)}
              />
            ))
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl text-gray-600 mb-3 flex justify-center">
                <FaCreditCard />
              </div>
              <h4 className="text-lg font-medium text-gray-300 mb-2">No Payment Methods</h4>
              <p className="text-gray-400 mb-4">Add a payment method to make withdrawals easier</p>
              <Button onClick={handleAddNew}>
                <FaPlus className="mr-2" /> Add Payment Method
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsTab;
