import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAdminAuth,
  selectIsAdminAuthenticated,
} from "../../redux/slices/adminAuthSlice";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminToken = async () => {
      try {
        const token = localStorage.getItem("ffb_admin_token");
        if (token && !isAuthenticated) {
          await dispatch(checkAdminAuth()).unwrap();
        }
      } catch (error) {
        console.error("Admin auth verification failed:", error);
        navigate("/admin/login");
      }
    };

    verifyAdminToken();
  }, [dispatch, isAuthenticated, navigate]);

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarMinimized((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar
        isOpen={sidebarOpen}
        isMinimized={sidebarMinimized}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarMinimized ? "lg:pl-20" : "lg:pl-60"
        } flex flex-col flex-1`}
      >
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 mp-16 lg:mb-0">
          <div className="container mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your application settings and users.
            </p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
