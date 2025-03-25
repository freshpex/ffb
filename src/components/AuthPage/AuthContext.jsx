import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Register user
  const createUser = async (email, password, firstName, lastName) => {
    try {
      setAuthError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Create user in our backend
      await axios.post(`${API_URL}/auth/register`, {
        uid: userCredential.user.uid,
        email,
        firstName,
        lastName
      });
      
      return userCredential;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Sign in user with improved error handling
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure the user exists in MongoDB by sending auth info
      try {
        await syncUserWithBackend(result.user);
      } catch (syncError) {
        console.error("User sync with backend failed:", syncError);
        
        // Check if it's a network error
        if (syncError.code === 'ERR_NETWORK' || syncError.code === 'ECONNABORTED') {
          // For network errors, we'll still allow login but warn the user
          console.warn("Backend sync failed due to network issues, allowing login to continue");
          
          // Set a warning message instead of throwing
          setAuthError("Warning: Login successful but server synchronization failed. Some features may be limited.");
          
          // Return the result without signing out
          return result;
        }
        
        // For other errors, we'll follow the original behavior
        await signOut(auth);
        const errorMessage = "Unable to synchronize your account with our database. Please try again or contact support.";
        setAuthError(errorMessage);
        throw new Error(errorMessage);
      }
      
      return result;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Sign out user
  const logout = async () => {
    setAuthError(null);
    setUserData(null);
    return signOut(auth);
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Sync user data with backend MongoDB
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return null;
    
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;
    
    const syncWithRetry = async (retryCount = 0) => {
      try {
        const token = await firebaseUser.getIdToken();
        
        // Send user data to backend sync endpoint 
        const response = await axios.post(`${API_URL}/auth/sync`, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          firebaseToken: token
        }, {
          timeout: 10000
        });
        
        return response;
      } catch (error) {
        if (retryCount < MAX_RETRIES && 
            (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
          console.warn(`Network error during sync, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          
          return syncWithRetry(retryCount + 1);
        }
        
        console.error("Error syncing user with backend:", error);
        throw error;
      }
    };
    
    return syncWithRetry();
  };

  // Function to fetch user data - this is what's missing
  const getUserProfile = async () => {
    try {
      if (!user) {
        console.warn("Cannot fetch user profile: User is not logged in");
        return null;
      }
      
      let token;
      try {
        token = await user.getIdToken();
      } catch (tokenError) {
        console.error("Error getting auth token:", tokenError);
        return null;
      }
      
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      });
      
      setUserData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Fallback to cached data if available
      if (userData) {
        return userData;
      }
      
      // Create minimal profile data as fallback
      const fallbackData = {
        email: user?.email,
        firstName: user?.displayName?.split(' ')[0] || 'User',
        lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
        balance: 0,
        role: 'user'
      };
      
      setUserData(fallbackData);
      return fallbackData;
    }
  };

  const fetchUserData = async (uid) => {
    try {
      if (!user) {
        console.warn("Cannot fetch user data: User is not logged in");
        return null;
      }
      
      let token;
      try {
        token = await user.getIdToken();
      } catch (tokenError) {
        console.error("Error getting auth token:", tokenError);
        return null;
      }
      
      if (!token) {
        console.warn("Cannot fetch user data: Auth token is not available");
        return null;
      }
      
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        return response.data;
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          console.log("User exists in Firebase but not in MongoDB. Attempting to sync...");
          
          await syncUserWithBackend(user);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const retryResponse = await axios.get(`${API_URL}/users/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserData(retryResponse.data);
            return retryResponse.data;
          } catch (retryError) {
            console.error("Failed to fetch user data after sync:", retryError);
            const minimalUserData = {
              email: user.email,
              firstName: user.displayName ? user.displayName.split(' ')[0] : 'User',
              lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
              balance: 0,
              role: 'user'
            };
            setUserData(minimalUserData);
            return minimalUserData;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          try {
            await syncUserWithBackend(currentUser);
          } catch (syncError) {
            console.error("Backend sync failed on auth state change:", syncError);
            return null;
          }
          
          try {
            await fetchUserData(currentUser.uid);
          } catch (fetchError) {
            console.error("Failed to fetch user data after auth state change:", fetchError);
            return null;
          }
        } catch (error) {
          console.error("Failed to process auth state change:", error);
          return null;
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      return await getUserProfile();
    }
    return null;
  };

  // Check if user is admin
  const isAdmin = () => {
    return userData?.role === 'admin' || userData?.role === 'superadmin';
  };

  const value = {
    user,
    userData,
    loading,
    authError,
    createUser,
    signIn,
    logout,
    resetPassword,
    refreshUserData,
    getUserProfile, // Add this function to the context value
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export const UserAuth = useAuth;

export default AuthContext;
