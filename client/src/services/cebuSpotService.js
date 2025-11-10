import axios from "axios";
import Config from "../config/api";

const API_BASE_URL = Config.API_BASE_URL;
export class CebuSpotsService {
  static async getAllCebuSpots() {
    try {
      console.log("🔄 Fetching spots from database...");
      const response = await axios.get(`${API_BASE_URL}/spots`);
      console.log("✅ Spots fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching spots:", error.message);
      // Return empty array if API fails
      return [];
    }
  }

  // NEW: Get spot by ID directly from API
  static async getSpotByIdFromAPI(id) {
    try {
      console.log(`🔄 Fetching spot with ID: ${id} from API...`);
      const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
      console.log("✅ Spot fetched successfully from API!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching spot with ID ${id}:`, error.message);
      // Fallback to local search if API fails
      console.log("🔄 Falling back to local search...");
      return await this.getSpotById(id);
    }
  }

  // Keep all your other methods as they are (unchanged)
  static async searchSpots(query = "", limit = 20) {
    const allSpots = await this.getAllCebuSpots();

    if (!query.trim()) {
      return allSpots.slice(0, limit);
    }

    const searchTerm = query.toLowerCase();
    const filtered = allSpots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(searchTerm) ||
        spot.location.toLowerCase().includes(searchTerm) ||
        spot.type.toLowerCase().includes(searchTerm) ||
        spot.category.toLowerCase().includes(searchTerm) ||
        spot.description.toLowerCase().includes(searchTerm)
    );

    return filtered.slice(0, limit);
  }

  static async searchByCategory(category) {
    const allSpots = await this.getAllCebuSpots();

    if (category === "all") {
      return allSpots;
    }

    return allSpots.filter((spot) => spot.category === category);
  }

  static async getSpotById(id) {
    const allSpots = await this.getAllCebuSpots();
    return allSpots.find((spot) => spot.id === id);
  }

  static async getFeaturedSpots(limit = 6) {
    const allSpots = await this.getAllCebuSpots();
    return allSpots.filter((spot) => spot.featured).slice(0, limit);
  }

  // Get nearby spots based on coordinates
  static async getNearbySpots(lat, lng, radius = 50) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allSpots = await this.getAllCebuSpots();

    // Simple distance calculation (for demo purposes)
    return allSpots.filter((spot) => {
      const distance = this.calculateDistance(
        lat,
        lng,
        spot.latitude,
        spot.longitude
      );
      return distance <= radius;
    });
  }

  // Helper function to calculate distance (simplified)
  static calculateDistance(lat1, lng1, lat2, lng2) {
    // Simple approximation for demo
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
  }
}
