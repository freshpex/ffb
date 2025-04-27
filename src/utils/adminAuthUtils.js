import { createAsyncThunk } from "@reduxjs/toolkit";

// Utility function to check if the admin token is valid
export const checkAdminToken = createAsyncThunk(
  "adminUtils/checkToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("ffb_admin_token");

      if (!token) {
        return rejectWithValue({
          status: "no_token",
          message: "No admin token found",
        });
      }

      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${apiUrl}/admin/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          status: response.status,
          message: errorData.message || "Token validation failed",
        });
      }

      const data = await response.json();
      return {
        admin: data.admin || data.data,
        role: data.admin?.role || data.data?.role,
      };
    } catch (error) {
      return rejectWithValue({
        status: "error",
        message: error.message || "Authentication check failed",
      });
    }
  },
);

// Function to rehydrate admin token (for browser console debugging)
export const debugAdminAuth = () => {
  const token = localStorage.getItem("ffb_admin_token");
  if (!token) {
    console.warn("No admin token found in localStorage");
    return null;
  }

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(
      atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    const isExpired =
      payload.exp && payload.exp < Math.floor(Date.now() / 1000);

    console.log("Admin token info:", {
      subject: payload.sub,
      role: payload.role,
      isExpired: isExpired,
      expiresAt: payload.exp
        ? new Date(payload.exp * 1000).toLocaleString()
        : "N/A",
    });

    return payload;
  } catch (e) {
    console.error("Failed to decode admin token:", e);
    return null;
  }
};

export const hasAdminPermission = (requiredRole, currentAdmin = null) => {
  if (!currentAdmin) {
    const adminFromStore = JSON.parse(localStorage.getItem("ffb_admin_user"));
    currentAdmin = adminFromStore;
  }

  if (!currentAdmin) return false;

  // Check for specific role
  if (requiredRole === "superadmin") {
    return currentAdmin.role === "superadmin";
  }

  // Admin role can do regular admin tasks
  if (requiredRole === "admin") {
    return ["admin", "superadmin"].includes(currentAdmin.role);
  }

  return false;
};

export const canModifyUser = (userToModify, currentAdmin = null) => {
  if (!userToModify) return false;

  if (!currentAdmin) {
    const adminFromStore = JSON.parse(localStorage.getItem("ffb_admin_user"));
    currentAdmin = adminFromStore;
  }

  if (!currentAdmin) return false;

  if (currentAdmin.role === "superadmin") {
    // Cannot modify other superadmins
    if (
      userToModify.role === "superadmin" &&
      userToModify.id !== currentAdmin.id
    ) {
      return false;
    }
    return true;
  }

  // Regular admins cannot modify admin or superadmin users
  if (["admin", "superadmin"].includes(userToModify.role)) {
    return false;
  }

  // Regular admins can modify regular users
  return true;
};

export const needsTokenRefresh = () => {
  const token = localStorage.getItem("ffb_admin_token");
  if (!token) return true;

  try {
    // JWT tokens have 3 parts separated by dots
    const payload = token.split(".")[1];
    // Decode the base64 payload
    const decoded = JSON.parse(atob(payload));

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return currentTime + fiveMinutes > expiryTime;
  } catch (error) {
    console.error("Error parsing admin token:", error);
    return true;
  }
};

/**
 * Save the admin user to localStorage for permission checks
 * @param {Object} admin - The admin user object
 */
export const saveAdminToLocalStorage = (admin) => {
  if (!admin) {
    localStorage.removeItem("ffb_admin_user");
    return;
  }

  localStorage.setItem("ffb_admin_user", JSON.stringify(admin));
};

export const getAdminToken = () => {
  return localStorage.getItem("ffb_admin_token");
};

export const clearAdminAuth = () => {
  localStorage.removeItem("ffb_admin_token");
  localStorage.removeItem("ffb_admin_data");
};

export const saveAdminAuth = (adminData, token) => {
  localStorage.setItem("ffb_admin_token", token);
  localStorage.setItem("ffb_admin_data", JSON.stringify(adminData));
};

export const refreshAdminAuth = () => {
  clearAdminAuth();

  window.location.href = "/admin/login";
};

export default {
  checkAdminToken,
  debugAdminAuth,
  hasAdminPermission,
  canModifyUser,
  needsTokenRefresh,
  saveAdminToLocalStorage,
  getAdminToken,
  clearAdminAuth,
  saveAdminAuth,
  refreshAdminAuth,
};
