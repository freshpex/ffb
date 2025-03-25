import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaCreditCard } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import PaymentMethodsTab from "./PaymentMethodsTab";
import Tabs from "../common/Tabs";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "payment", label: "Payment Methods", icon: <FaCreditCard /> }
  ];

  return (
    <DashboardLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Account Settings
        </h1>
        
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            
            <div className="mt-6">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "payment" && <PaymentMethodsTab />}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AccountSettings;
