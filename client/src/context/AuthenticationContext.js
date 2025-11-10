import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationService } from "../services/authentication_services/authenticationService";

const AuthenticationContext = createContext();

// AsyncStorage utility functions
const AsyncStorageService = {
  // Save user to AsyncStorage
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem("sugvoyage_user", JSON.stringify(user));
      console.log("✅ User saved to AsyncStorage!");
      return true;
    } catch (error) {
      console.error("❌ Error saving to AsyncStorage:", error);
      return false;
    }
  },

  // Get user from AsyncStorage
  getUser: async () => {
    try {
      const userString = await AsyncStorage.getItem("sugvoyage_user");
      if (userString) {
        const user = JSON.parse(userString);
        console.log("✅ User retrieved from AsyncStorage!");
        return user;
      }
      return null;
    } catch (error) {
      console.error("❌ Error reading from AsyncStorage:", error);
      return null;
    }
  },

  // Remove user from AsyncStorage
  removeUser: async () => {
    try {
      await AsyncStorage.removeItem("sugvoyage_user");
      console.log("✅ User removed from AsyncStorage!");
      return true;
    } catch (error) {
      console.error("❌ Error removing from AsyncStorage:", error);
      return false;
    }
  },

  // Check if user is logged in
  isUserLoggedIn: async () => {
    try {
      const user = await AsyncStorage.getItem("sugvoyage_user");
      return user !== null;
    } catch (error) {
      console.error("❌ Error checking login status:", error);
      return false;
    }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isLoggedIn = await AsyncStorageService.isUserLoggedIn();
      if (isLoggedIn) {
        const currentUser = await AsyncStorageService.getUser();
        setUser(currentUser);
        console.log("✅ User authenticated from storage");
      } else {
        setUser(null);
        console.log("🔐 No user found in storage");
      }
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      setError("Failed to check authentication status");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Registering user...");

      const result = await AuthenticationService.register(userData);

      if (result.success) {
        setUser(result.user);
        // Save to AsyncStorage
        await AsyncStorageService.saveUser(result.user);
        console.log("✅ Registration successful!");
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        console.log("❌ Registration failed:", result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMsg = "Registration failed. Please try again.";
      setError(errorMsg);
      console.error("❌ Registration error:", error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Logging in user...");

      const result = await AuthenticationService.login(credentials);

      if (result.success) {
        setUser(result.user);
        // Save to AsyncStorage
        await AsyncStorageService.saveUser(result.user);
        console.log("✅ Login successful!");
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        console.log("❌ Login failed:", result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMsg = "Login failed. Please try again.";
      setError(errorMsg);
      console.error("❌ Login error:", error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🔄 Logging out user...");
      setUser(null);
      setError(null);
      // Remove from AsyncStorage
      await AsyncStorageService.removeUser();
      console.log("✅ Logout successful!");
      return { success: true };
    } catch (error) {
      const errorMsg = "Logout failed. Please try again.";
      setError(errorMsg);
      console.error("❌ Logout error:", error);
      return { success: false, error: errorMsg };
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Updating profile for user: ${userId}...`);
      console.log(`🔍 Full user object:`, JSON.stringify(user, null, 2)); // Add this line

      // Make sure userId is properly passed
      if (!userId) {
        throw new Error("User ID is required");
      }

      const result = await AuthenticationService.updateUserProfile(
        userId,
        profileData
      );

      if (result.success) {
        setUser(result.user);
        await AsyncStorageService.saveUser(result.user);
        console.log("✅ Profile updated successfully!");
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        console.log("❌ Profile update failed:", result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      const errorMsg = "Profile update failed. Please try again.";
      setError(errorMsg);
      console.error("❌ Profile update error:", error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    user,
    loading,
    error,

    // Actions
    register,
    login,
    logout,
    updateProfile,
    clearError,
    checkAuthStatus,

    // Computed
    isAuthenticated: !!user,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
