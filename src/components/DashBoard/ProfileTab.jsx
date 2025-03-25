import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserAuth } from '../AuthPage/AuthContext';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import Button from '../common/Button';
import { 
  updateProfile,
  selectUserProfile,
  selectUserStatus
} from '../../redux/slices/userSlice';

const ProfileTab = () => {
  const { user } = UserAuth();
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const status = useSelector(selectUserStatus);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: ''
  });

  useEffect(() => {
    // Set form data from redux store when available
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        country: profile.country || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Email"
        type="email"
        value={user?.email || 'user@example.com'}
        disabled={true}
        hint="Email cannot be changed"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
        />
        
        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
        />
      </div>
      
      <FormInput
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
      />
      
      <FormSelect
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        options={countries}
        placeholder="Select your country"
      />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          isLoading={status === 'loading'}
          disabled={status === 'loading'}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileTab;
