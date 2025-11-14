import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = Config.API_BASE_URL;

export class AuthenticationService {
  static async register(userData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  }

  static async login(credentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  }

  static async getUserProfile(userId) {
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
  }

  static async updateUserProfile(userId, profileData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/profile/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  }

  // Local storage methods for web
  static saveUserToLocalStorage(user) {
    localStorage.setItem("sugvoyage_user", JSON.stringify(user));
  }

  static removeUserFromLocalStorage() {
    localStorage.removeItem("sugvoyage_user");
  }

  static getCurrentUser() {
    const user = localStorage.getItem("sugvoyage_user");
    return user ? JSON.parse(user) : null;
  }

  static isUserLoggedIn() {
    return localStorage.getItem("sugvoyage_user") !== null;
  }
}
