import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaKey,
  FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa';
import { 
  fetchAdminProfile, 
  updateAdminProfile, 
  uploadAdminProfileImage,
  changeAdminPassword,
  selectAdminProfile,
  selectAdminProfileStatus,
  selectAdminProfileError,
  selectAdminProfileActionStatus,
  clearAdminProfileError
} from '../../redux/slices/adminProfileSlice';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const profile = useSelector(selectAdminProfile);
  const status = useSelector(selectAdminProfileStatus);
  const actionStatus = useSelector(selectAdminProfileActionStatus);
  const error = useSelector(selectAdminProfileError);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Load profile data
  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);
  
  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);
  
  // Handle toast notifications for success/errors
  useEffect(() => {
    if (actionStatus === 'succeeded') {
      toast.success('Profile updated successfully');
      setEditMode(false);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else if (actionStatus === 'failed' && error) {
      toast.error(error);
      dispatch(clearAdminProfileError());
    }
  }, [actionStatus, error, dispatch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAdminProfile(formData));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    
    dispatch(changeAdminPassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      dispatch(uploadAdminProfileImage(e.target.files[0]));
    }
  };
  
  const cancelEdit = () => {
    setEditMode(false);
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || ''
      });
    }
  };
  
  if (status === 'loading' && !profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 md:px-8">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">Admin Profile</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Profile Header with Image */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <div 
                className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer relative"
                onClick={handleImageClick}
              >
                {profile?.profileImage ? (
                  <img 
                    src={profile.profileImage.startsWith('http') ? profile.profileImage : `${API_URL}${profile.profileImage}`} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-5xl" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <FaCamera className="text-white text-xl" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
              {actionStatus === 'loading' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-blue-200">
                {profile?.role === 'superadmin' ? 'Super Admin' : 'Administrator'}
              </p>
              {!editMode && (
                <button 
                  onClick={() => setEditMode(true)} 
                  className="mt-2 bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded text-sm flex items-center gap-2"
                >
                  <FaEdit size={12} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <FaTimes size={12} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition flex items-center gap-2"
                  disabled={actionStatus === 'loading'}
                >
                  {actionStatus === 'loading' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={12} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">First Name</p>
                  <p className="text-white font-medium">{profile?.firstName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Name</p>
                  <p className="text-white font-medium">{profile?.lastName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" size={14} />
                    <p className="text-white font-medium">{profile?.email || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-500" size={14} />
                    <p className="text-white font-medium">{profile?.phone || '-'}</p>
                  </div>
                </div>
              </div>
              
              {profile?.bio && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm">Bio</p>
                  <p className="text-white">{profile.bio}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Security Section */}
      <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Security</h2>
        
        {showPasswordForm ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 text-sm text-yellow-200 mb-4">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    Make sure your password is strong and not used elsewhere. 
                    Use a combination of uppercase, lowercase, numbers, and special characters.
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition flex items-center gap-2"
                  disabled={actionStatus === 'loading'}
                >
                  {actionStatus === 'loading' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaKey size={12} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">Password</p>
              <p className="text-gray-300">********</p>
              <p className="text-xs text-gray-500 mt-1">
                Last changed: {profile?.passwordChangedAt ? new Date(profile.passwordChangedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
            >
              <FaKey size={12} />
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
