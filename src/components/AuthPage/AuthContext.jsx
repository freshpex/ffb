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

const MOCK_USERS_KEY = 'ffb_mock_users';
const CURRENT_USER_KEY = 'ffb_current_user';
const AUTH_TOKEN_KEY = 'ffb_auth_token';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY));

  console.log("AuthContext - Initial State:", { token, userData: !!userData, user: !!user, loading });

  // Helper function to get mock users from localStorage
  const getMockUsers = () => {
    const usersJson = localStorage.getItem(MOCK_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : {};
  };

  // Helper function to save mock users to localStorage
  const saveMockUsers = (users) => {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  };

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
  const createUser = async (email, password, firstName, lastName) => {
    try {
      setAuthError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Create mock user data (no backend call)
      const mockUserId = `user_${Date.now()}`;
      const mockUserData = {
        id: mockUserId,
        uid: userCredential.user.uid,
        email,
        firstName,
        lastName,
        role: "user",
        balance: 5000, // Default starting balance
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      
      // Save to mock storage
      const mockUsers = getMockUsers();
      mockUsers[userCredential.user.uid] = mockUserData;
      saveMockUsers(mockUsers);
      
      // Set user data in state and storage
      setUserData(mockUserData);
      saveCurrentUser(mockUserData);
      
      // Generate a mock token and save it
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      saveToken(mockToken);
      
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
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user.email);
      
      // Get user data
      const mockUsers = getMockUsers();
      const mockUserData = mockUsers[userCredential.user.uid];
      
      if (mockUserData) {
        console.log("User data found in storage");
        setUserData(mockUserData);
        saveCurrentUser(mockUserData);
      } else {
        console.log("Creating default user data");
        // Create default user data if none exists
        const defaultUserData = {
          id: `user_${Date.now()}`,
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          firstName: userCredential.user.displayName ? userCredential.user.displayName.split(' ')[0] : 'User',
          lastName: userCredential.user.displayName ? userCredential.user.displayName.split(' ').slice(1).join(' ') : '',
          role: "user",
          balance: 10000,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          createdAt: new Date().toISOString()
        };
        
        mockUsers[userCredential.user.uid] = defaultUserData;
        saveMockUsers(mockUsers);
        setUserData(defaultUserData);
        saveCurrentUser(defaultUserData);
      }
      
      // Generate a mock token and save it
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      saveToken(mockToken);
      
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
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

  // Function to fetch user data - now using mock data
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
      
      // Get mock user data
      const mockUsers = getMockUsers();
      const mockUserData = mockUsers[user.uid];
      
      if (mockUserData) {
        setUserData(mockUserData);
        saveCurrentUser(mockUserData);
        return mockUserData;
      }
      
      // If no mock data found, create a default user profile
      const defaultUserData = {
        id: `user_${Date.now()}`,
        uid: user.uid,
        email: user.email,
        firstName: user.displayName ? user.displayName.split(' ')[0] : 'User',
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
        role: "user",
        balance: 10000,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      
      // Save to mock storage
      mockUsers[user.uid] = defaultUserData;
      saveMockUsers(mockUsers);
      setUserData(defaultUserData);
      saveCurrentUser(defaultUserData);
      
      return defaultUserData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
