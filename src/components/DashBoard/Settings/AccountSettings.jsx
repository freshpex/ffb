import { useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';
import PaymentMethodsTab from './PaymentMethodsTab';
import { FaUserCircle, FaLock, FaCreditCard } from 'react-icons/fa';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Personal Information', icon: <FaUserCircle /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard /> }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'security':
        return <SecurityTab />;
      case 'payment':
        return <PaymentMethodsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-100">Account Settings</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 flex items-center space-x-2 whitespace-nowrap transition-colors 
                  ${activeTab === tab.id
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
