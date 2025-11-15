import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = Config.API_BASE_URL;

export class AuthenticationService {
  // ==================== EMAIL VERIFICATION ====================
  static sendVerificationCode = async (email) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/send-verification`,
        {
          email,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to send verification code",
      };
    }
  };

  // ==================== REGISTRATION ====================
  static register = async (userData) => {
    try {
      console.log("📨 Registering user:", {
        ...userData,
        password: "***", // Hide password in logs
      });

      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      if (response.data.success && response.data.user) {
        this.saveUserToLocalStorage(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  // ==================== LOGIN ====================
  static login = async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      if (response.data.success && response.data.user) {
        this.saveUserToLocalStorage(response.data.user);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  // ==================== PASSWORD RESET ====================
  static sendPasswordResetCode = async (email) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/send-password-reset`,
        {
          email,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset code",
      };
    }
  };

  static resetPassword = async (resetData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        resetData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      };
    }
  };

  // ==================== PROFILE MANAGEMENT ====================
  static getUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/profile/${userId}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch profile",
      };
    }
  };

  static getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch profile",
      };
    }
  };

  static updateUserProfile = async (userId, profileData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/profile/${userId}`,
        profileData
      );

      // Update local storage if profile update is successful
      if (response.data.success && response.data.user) {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...currentUser, ...response.data.user };
          this.saveUserToLocalStorage(updatedUser);
        }
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  // ==================== USER VERIFICATION ====================
  static isUserVerified = () => {
    const user = this.getCurrentUser();
    return user && user.emailVerified === true;
  };

  // ==================== LOCAL STORAGE MANAGEMENT ====================
  static saveUserToLocalStorage(user) {
    try {
      localStorage.setItem("sugvoyage_user", JSON.stringify(user));
      localStorage.setItem("sugvoyage_token", user.token || "");
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  }

  static removeUserFromLocalStorage() {
    try {
      localStorage.removeItem("sugvoyage_user");
      localStorage.removeItem("sugvoyage_token");
    } catch (error) {
      console.error("Error removing user from localStorage:", error);
    }
  }

  static getCurrentUser() {
    try {
      const user = localStorage.getItem("sugvoyage_user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user from localStorage:", error);
      return null;
    }
  }

  static getAuthToken() {
    try {
      return localStorage.getItem("sugvoyage_token") || "";
    } catch (error) {
      console.error("Error getting token from localStorage:", error);
      return "";
    }
  }

  static isUserLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // ==================== LOGOUT ====================
  static logout() {
    this.removeUserFromLocalStorage();
    // Optional: Call backend logout endpoint if needed
    // await axios.post(`${API_BASE_URL}/auth/logout`);
  }

  // ==================== UTILITY METHODS ====================
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  static validateVerificationCode(code) {
    return code && code.length === 6 && /^\d+$/.test(code);
  }
}

// Add axios interceptor for auth tokens
axios.interceptors.request.use(
  (config) => {
    const token = AuthenticationService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AuthenticationService.logout();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default AuthenticationService;
