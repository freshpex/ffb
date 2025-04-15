import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../common/FormInput';
import Button from '../../common/Button';
import { FaLock, FaShieldAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { 
  updatePassword,
  selectSecurityStatus
} from '../../../redux/slices/securitySlice';

const SecurityTab = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectSecurityStatus);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error - passwords don't match
      return;
    }
    
    const result = await dispatch(updatePassword(passwordData));
    
    if (result.success) {
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <FaLock className="mr-2 text-primary-500" /> Change Password
        </h3>
        
        <FormInput
          label="Current Password"
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
          required
        />
        
        <FormInput
          label="New Password"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          placeholder="Enter your new password"
          required
        />
        
        <FormInput
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
          required
        />
        
        <div className="bg-gray-800 p-4 rounded-md mb-6">
          <h4 className="font-medium text-sm text-gray-300 mb-2">Password Requirements</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              {passwordStrength.length ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span className={passwordStrength.length ? 'text-green-500' : 'text-gray-400'}>
                At least 8 characters
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.uppercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span className={passwordStrength.uppercase ? 'text-green-500' : 'text-gray-400'}>
                At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.lowercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span className={passwordStrength.lowercase ? 'text-green-500' : 'text-gray-400'}>
                At least one lowercase letter
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.number ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span className={passwordStrength.number ? 'text-green-500' : 'text-gray-400'}>
                At least one number
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.special ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span className={passwordStrength.special ? 'text-green-500' : 'text-gray-400'}>
                At least one special character
              </span>
            </li>
          </ul>
        </div>
        
        <Button 
          type="submit" 
          isLoading={status === 'loading'}
          disabled={status === 'loading'}
        >
          Update Password
        </Button>
      </form>
      
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <FaShieldAlt className="mr-2 text-primary-500" /> Two-Factor Authentication
        </h3>
        
        <p className="text-gray-400 mb-4">
          Enhance your account security by enabling two-factor authentication.
          When enabled, you'll be required to provide a verification code in addition to your password when logging in.
        </p>
        
        <Button variant="outline">
          Enable Two-Factor Authentication
        </Button>
      </div>
    </div>
  );
};

export default SecurityTab;
