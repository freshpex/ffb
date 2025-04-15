import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserProfile,
  selectUserLoading,
  selectUserError,
  updateProfile,
  uploadProfileImage,
  fetchUserProfile
} from '../../../redux/slices/userSlice';
import { FaUser, FaCamera, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import FormInput from '../../common/FormInput';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const ProfileTab = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  console.log("ProfileTab", userProfile);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    phoneNumber: userProfile.phone || '',
    address: userProfile.address || '',
    country: userProfile.country || ''
  });
  
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userProfile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(updateProfile(formData));
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }
    
    try {
      setUploadingImage(true);
      await dispatch(uploadProfileImage(file));
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading-indicator">Loading profile data...</div>;
  }

  if (!userProfile) {
    return <div className="error-message">Unable to load profile data. Please refresh.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Personal Information</h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message="Profile updated successfully" className="mb-4" />}
      
      <div className="flex flex-col sm:flex-row items-center mb-8 gap-6">
        <div 
          className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center relative cursor-pointer"
          onClick={handleImageClick}
        >
          {userProfile?.profileImage ? (
            <img 
              src={userProfile.profileImage} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser size={32} className="text-gray-500" />
          )}
          
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            {uploadingImage ? (
              <FaSpinner className="text-white animate-spin" size={14} />
            ) : (
              <FaCamera className="text-white" size={14} />
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/jpeg, image/png, image/gif"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-100">
            {userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}` : 'Loading...'}
          </h3>
          <p className="text-gray-400">{userProfile?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Click on the avatar to upload a new photo</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <FormInput
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
          />
        </div>
        
        <div className="mb-6">
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full address"
          />
        </div>
        
        <div className="mb-6">
          <FormInput
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Your country of residence"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFormData({
              firstName: userProfile?.firstName || '',
              lastName: userProfile?.lastName || '',
              phoneNumber: userProfile?.phoneNumber || '',
              address: userProfile?.address || '',
              country: userProfile?.country || ''
            })}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            icon={isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
