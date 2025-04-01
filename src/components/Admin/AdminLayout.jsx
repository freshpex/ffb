import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [sidebarMinimized, setSidebarMinimized] = useState(false); // For desktop

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(prev => !prev);
    } 
    else {
      setSidebarMinimized(prev => !prev);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        isMinimized={sidebarMinimized} 
        toggleSidebar={toggleSidebar} 
      />
      <div className={`transition-all duration-300 ${
        sidebarMinimized ? 'lg:pl-20' : 'lg:pl-60'
      } flex flex-col flex-1`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
