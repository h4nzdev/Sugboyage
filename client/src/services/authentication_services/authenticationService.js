import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../../config/api";

const API_BASE_URL = Config.API_BASE_URL;

// AsyncStorage utility functions
const AsyncStorageService = {
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem("sugvoyage_user", JSON.stringify(user));
      console.log("✅ User saved to AsyncStorage!");
    } catch (error) {
      console.error("❌ Error saving to AsyncStorage:", error);
    }
  },

  getUser: async () => {
    try {
      const userString = await AsyncStorage.getItem("sugvoyage_user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("❌ Error reading from AsyncStorage:", error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem("sugvoyage_user");
      console.log("✅ User removed from AsyncStorage!");
    } catch (error) {
      console.error("❌ Error removing from AsyncStorage:", error);
    }
  },

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

export class AuthenticationService {
  static async register(userData) {
    try {
      console.log("🔄 Registering new user...");
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      console.log("✅ User registered successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error during registration:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        error: error.message,
      };
    }
  }

  static async login(credentials) {
    try {
      console.log("🔄 Logging in user...");
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      console.log("✅ Login successful!");
      return response.data;
    } catch (error) {
      console.error("❌ Error during login:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        error: error.message,
      };
    }
  }

  static async getUserProfile(userId) {
    try {
      console.log(`🔄 Fetching profile for user: ${userId}...`);
      const response = await axios.get(
        `${API_BASE_URL}/auth/profile/${userId}`
      );
      console.log("✅ User profile fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching profile for user ${userId}:`,
        error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch profile",
        error: error.message,
      };
    }
  }

  static async updateUserProfile(userId, profileData) {
    try {
      console.log("🔄 UPDATE PROFILE API CALL:");
      console.log("   URL:", `${API_BASE_URL}/auth/profile/${userId}`);
      console.log("   User ID:", userId);
      console.log("from services :", profileData);

      const response = await axios.put(
        `${API_BASE_URL}/auth/profile/${userId}`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API Error for user ${userId}:`);
      console.error("   Error message:", error.message);
      console.error("   Response status:", error.response?.status);
      console.error("   Response data:", error.response?.data);
      console.error("   Request URL:", error.config?.url);
      console.error("   Request data:", error.config?.data);

      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
        error: error.message,
      };
    }
  }

  // NEW: Get user by ID directly from API
  static async getUserByIdFromAPI(userId) {
    try {
      console.log(`🔄 Fetching user with ID: ${userId} from API...`);
      const response = await axios.get(
        `${API_BASE_URL}/auth/profile/${userId}`
      );
      console.log("✅ User fetched successfully from API!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching user with ID ${userId}:`, error.message);
      // Fallback to AsyncStorage if API fails
      console.log("🔄 Falling back to AsyncStorage...");
      return await this.getUserFromAsyncStorage(userId);
    }
  }

  // Helper method to get user from AsyncStorage (fallback)
  static async getUserFromAsyncStorage(userId) {
    try {
      const user = await AsyncStorageService.getUser();
      if (user && user.id === userId) {
        console.log("✅ User found in AsyncStorage!");
        return { success: true, user };
      }
      return { success: false, message: "User not found" };
    } catch (error) {
      console.error("❌ Error reading from AsyncStorage:", error);
      return { success: false, message: "AsyncStorage error" };
    }
  }

  // Save user to AsyncStorage
  static async saveUserToLocalStorage(user) {
    await AsyncStorageService.saveUser(user);
  }

  // Remove user from AsyncStorage (logout)
  static async removeUserFromLocalStorage() {
    await AsyncStorageService.removeUser();
  }

  // Check if user is logged in (from AsyncStorage)
  static async isUserLoggedIn() {
    return await AsyncStorageService.isUserLoggedIn();
  }

  // Get current user from AsyncStorage
  static async getCurrentUser() {
    return await AsyncStorageService.getUser();
  }
}
