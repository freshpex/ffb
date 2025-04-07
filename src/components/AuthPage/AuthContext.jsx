import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = createContext();
const CURRENT_USER_KEY = 'ffb_current_user';
const AUTH_TOKEN_KEY = 'ffb_auth_token';

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY));

  console.log("AuthContext - Initial State:", { token, userData: !!userData, user: !!user, loading });

  // Helper function to save current user data to localStorage
  const saveCurrentUser = (userData) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  };

  // Helper function to get current user data from localStorage
  const getCurrentUser = () => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  };

  // Helper function to save auth token
  const saveToken = (authToken) => {
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    setToken(authToken);
  };

  // Register user
  const createUser = async (email, password, firstName, lastName, phoneNumber, accountType, country, referralCode, additionalInfo = {}) => {
    try {
      setAuthError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Get Firebase user token for backend authentication
      const firebaseToken = await userCredential.user.getIdToken();
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const registerResponse = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email,
          firstName,
          lastName,
          phoneNumber,
          accountType,
          country,
          referralCode,
          ...additionalInfo
        }),
      });
      
      if (!registerResponse.ok) {
        const registerError = await registerResponse.json();
        throw new Error(registerError.message || 'Failed to register with backend');
      }
      
      // Get user data and token from the registration response
      const userData = await registerResponse.json();
      
      // Save token and user data
      saveToken(userData.token);
      setUserData(userData.user);
      saveCurrentUser(userData.user);
      
      return userCredential;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Login user
  const logIn = async (email, password) => {
    try {
      setAuthError(null);
      
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful:", userCredential.user.email);
      
      // Get Firebase user token for backend authentication
      const firebaseToken = await userCredential.user.getIdToken();
      
      // Sync with backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // First sync the user
      const syncResponse = await fetch(`${apiUrl}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          firebaseToken
        }),
      });
      
      if (!syncResponse.ok) {
        const syncError = await syncResponse.json();
        throw new Error(syncError.message || 'Failed to synchronize with backend');
      }
      
      // Then login with the backend
      const loginResponse = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        }),
      });
      
      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        throw new Error(loginError.message || 'Failed to login with backend');
      }
      
      const userData = await loginResponse.json();
      
      // Save token and user data
      saveToken(userData.token);
      setUserData(userData.user);
      saveCurrentUser(userData.user);
      
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", userCredential.user.email);

      const { user } = userCredential;
      const { displayName, email, uid, photoURL, phoneNumber } = user;
      
      let firstName = '', lastName = '';
      if (displayName) {
        const nameParts = displayName.split(' ');
        if (nameParts.length > 0) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }
      }
      
      const firebaseToken = await user.getIdToken();
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const registerResponse = await fetch(`${apiUrl}/auth/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          email,
          firstName,
          lastName,
          displayName,
          phoneNumber,
          photoURL,
          firebaseToken,
          loginType: 'google'
        }),
      });
      
      if (!registerResponse.ok) {
        const registerError = await registerResponse.json();
        throw new Error(registerError.message || 'Failed to authenticate with backend');
      }
      
      // Get user data and token from the response
      const userData = await registerResponse.json();
      
      // Save token and user data
      saveToken(userData.token);
      setUserData(userData.user);
      saveCurrentUser(userData.user);
      
      return userCredential;
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  // Keep signIn as an alias for logIn for consistency
  const signIn = logIn;

  // Sign out user
  const logout = async () => {
    setAuthError(null);
    setUserData(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
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

  // Function to fetch user data - now using backend API
  const getUserProfile = async () => {
    try {
      if (!user) {
        console.warn("Cannot fetch user profile: User is not logged in");
        
        // Try to load user data from localStorage if token exists
        if (token) {
          const cachedUser = getCurrentUser();
          if (cachedUser) {
            console.log("Loading user data from localStorage using token");
            setUserData(cachedUser);
            return cachedUser;
          }
        }
        
        return null;
      }
      
      // Get user profile from backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await response.json();
      setUserData(userData);
      saveCurrentUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Fallback to cached data if available
      const cachedUser = getCurrentUser();
      if (cachedUser) {
        setUserData(cachedUser);
        return cachedUser;
      }
      
      return null;
    }
  };

  const fetchUserData = async () => {
    return await getUserProfile();
  };

  // Initialize with stored token
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      console.log("Found stored token on initialization");
      setToken(storedToken);
      
      // Try to get user data but don't block on it
      const storedUser = getCurrentUser();
      if (storedUser) {
        console.log("Also found stored user data");
        setUserData(storedUser);

        setLoading(false);
      }
    }
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? currentUser.email : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Try to load from localStorage first (faster)
          const cachedUser = getCurrentUser();
          if (cachedUser && cachedUser.uid === currentUser.uid) {
            console.log("Setting user data from cache");
            setUserData(cachedUser);
          }
          
          // Check if we have a token
          const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
          if (storedToken) {
            console.log("Token found in localStorage");
            setToken(storedToken);
          } else {
            console.log("No token in localStorage, generating new one");
            const newToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
            saveToken(newToken);
          }
          

          if (!userData || userData.uid !== currentUser.uid) {
            await getUserProfile();
          }
        } catch (error) {
          console.error("Failed to process auth state change:", error);
        } finally {
          // Always set loading to false when we're done
          setLoading(false);
        }
      } else {

        if (token) {
          console.log("Firebase user is null but token exists - checking for user data");
          const cachedUser = getCurrentUser();
          if (cachedUser) {
            console.log("Found cached user data with token, keeping session");
            setUserData(cachedUser);
          } else {
            console.log("No cached user data found with token, clearing session");
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setToken(null);
            setUserData(null);
          }
        } else {
          console.log("No user and no token - session is cleared");
          setUserData(null);
        }
        
        setLoading(false);
      }
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

  // Debug auth state
  useEffect(() => {
    console.log("Auth state updated:", {
      userExists: !!user,
      userDataExists: !!userData,
      hasToken: !!token,
      isLoading: loading
    });
  }, [user, userData, token, loading]);

  const value = {
    user,
    userData,
    loading,
    authError,
    token,
    createUser,
    signIn,
    logIn,
    signInWithGoogle,
    logout,
    resetPassword,
    refreshUserData,
    getUserProfile,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

export const UserAuth = useAuth;
export const AuthProvider = AuthContextProvider;

export default AuthContext;
