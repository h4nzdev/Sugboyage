// services/cebuSpotsService.js - LOCAL DATA (ALWAYS WORKS)
export class CebuSpotsService {
  static async searchSpots(query = "", limit = 20) {
    console.log("🔍 Searching Cebu spots in local database...");

    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const allSpots = this.getAllCebuSpots();

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

    console.log(`✅ Found ${filtered.length} spots for "${query}"`);
    return filtered.slice(0, limit);
  }

  static async searchByCategory(category) {
    console.log("🎯 Filtering by category:", category);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const allSpots = this.getAllCebuSpots();

    if (category === "all") {
      return allSpots;
    }

    return allSpots.filter((spot) => spot.category === category);
  }

  static getAllCebuSpots() {
    return [
      {
        id: "1",
        name: "Kawasan Falls",
        location: "Badian, Cebu",
        latitude: 9.8167,
        longitude: 123.3833,
        type: "waterfall",
        category: "adventure",
        rating: "4.9",
        reviews: 394,
        price: "₱500",
        distance: "2.5 hrs away",
        featured: true,
        geofence: true,
        color: "#10B981",
        days: "Full Day",
        description:
          "Famous turquoise waterfalls perfect for canyoneering and swimming in natural pools. Experience the thrill of jumping into crystal-clear waters surrounded by lush jungle.",
        image: "🏞️",
        activities: [
          "Canyoneering",
          "Swimming",
          "Photo Sessions",
          "Nature Walk",
        ],
      },
      {
        id: "2",
        name: "Temple of Leah",
        location: "Cebu City",
        latitude: 10.3567,
        longitude: 123.8756,
        type: "historical",
        category: "historical",
        rating: "4.7",
        reviews: 287,
        price: "₱100",
        distance: "20 min away",
        featured: true,
        geofence: true,
        color: "#8B5CF6",
        days: "Half Day",
        description:
          'Roman-style temple built as a symbol of undying love, offering panoramic city views. Often called the "Taj Mahal of Cebu".',
        image: "🏛️",
        activities: [
          "Sightseeing",
          "Photography",
          "City Views",
          "Cultural Tour",
        ],
      },
      {
        id: "3",
        name: "Magellans Cross",
        location: "Downtown Cebu City",
        latitude: 10.294,
        longitude: 123.9022,
        type: "historical",
        category: "historical",
        rating: "4.5",
        reviews: 456,
        price: "Free",
        distance: "15 min away",
        featured: true,
        geofence: true,
        color: "#F59E0B",
        days: "1-2 Hours",
        description:
          "Historical cross planted by Ferdinand Magellan in 1521, marking the arrival of Christianity in the Philippines. Located beside the Basilica Minore del Santo Niño.",
        image: "✝️",
        activities: [
          "Historical Tour",
          "Prayer",
          "Cultural Learning",
          "Photography",
        ],
      },
      {
        id: "4",
        name: "Bantayan Island",
        location: "Bantayan Island, Cebu",
        latitude: 11.1676,
        longitude: 123.7222,
        type: "beach",
        category: "beaches",
        rating: "4.8",
        reviews: 312,
        price: "₱1,200",
        distance: "4 hrs away",
        featured: false,
        geofence: true,
        color: "#06B6D4",
        days: "2-3 Days",
        description:
          "Pristine white sand beaches with crystal clear waters, perfect for island hopping and relaxation. Known for its laid-back atmosphere and stunning sunsets.",
        image: "🏝️",
        activities: [
          "Island Hopping",
          "Snorkeling",
          "Beach Relaxation",
          "Sunset Watching",
        ],
      },
      {
        id: "5",
        name: "Sirao Flower Farm",
        location: "Cebu City",
        latitude: 10.3894,
        longitude: 123.8347,
        type: "garden",
        category: "cultural",
        rating: "4.6",
        reviews: 198,
        price: "₱150",
        distance: "45 min away",
        featured: false,
        geofence: true,
        color: "#EC4899",
        days: "Half Day",
        description:
          'Beautiful flower farm often called the "Little Amsterdam of Cebu" with vibrant celosia flowers. Perfect for photography and nature lovers.',
        image: "🌷",
        activities: ["Photography", "Nature Walk", "Flower Viewing", "Picnic"],
      },
      {
        id: "6",
        name: "Osmeña Peak",
        location: "Dalaguete, Cebu",
        latitude: 9.85,
        longitude: 123.4333,
        type: "mountain",
        category: "adventure",
        rating: "4.8",
        reviews: 223,
        price: "₱300",
        distance: "3 hrs away",
        featured: false,
        geofence: false,
        color: "#F97316",
        days: "Full Day",
        description:
          "Highest peak in Cebu offering breathtaking 360-degree views of surrounding islands and mountains. Popular for hiking and camping.",
        image: "⛰️",
        activities: ["Hiking", "Camping", "Photography", "Nature Trekking"],
      },
      {
        id: "7",
        name: "Fort San Pedro",
        location: "Cebu City",
        latitude: 10.292,
        longitude: 123.9045,
        type: "fortress",
        category: "historical",
        rating: "4.4",
        reviews: 178,
        price: "₱80",
        distance: "15 min away",
        featured: false,
        geofence: true,
        color: "#8B5CF6",
        days: "1-2 Hours",
        description:
          "Oldest and smallest fort in the Philippines built by Spanish conquistadors. Features a museum and beautiful garden.",
        image: "🏰",
        activities: [
          "Historical Tour",
          "Museum Visit",
          "Photography",
          "Garden Walk",
        ],
      },
      {
        id: "8",
        name: "Malapascua Island",
        location: "Daanbantayan, Cebu",
        latitude: 11.3379,
        longitude: 124.1153,
        type: "island",
        category: "beaches",
        rating: "4.7",
        reviews: 267,
        price: "₱1,500",
        distance: "5 hrs away",
        featured: true,
        geofence: true,
        color: "#06B6D4",
        days: "2-3 Days",
        description:
          "Famous for thresher shark diving and pristine beaches. A paradise for divers and beach lovers.",
        image: "🦈",
        activities: [
          "Diving",
          "Snorkeling",
          "Island Hopping",
          "Beach Relaxation",
        ],
      },
      {
        id: "9",
        name: "Taoist Temple",
        location: "Beverly Hills, Cebu City",
        latitude: 10.3396,
        longitude: 123.9123,
        type: "temple",
        category: "cultural",
        rating: "4.5",
        reviews: 189,
        price: "Free",
        distance: "25 min away",
        featured: false,
        geofence: true,
        color: "#EC4899",
        days: "1-2 Hours",
        description:
          "Chinese temple built by Cebus Chinese community. Offers panoramic views of the city and Mactan Island.",
        image: "🕌",
        activities: ["Prayer", "Meditation", "City Views", "Cultural Tour"],
      },
      {
        id: "10",
        name: "Cebu Safari and Adventure Park",
        location: "Carmen, Cebu",
        latitude: 10.5931,
        longitude: 123.9589,
        type: "wildlife",
        category: "adventure",
        rating: "4.6",
        reviews: 312,
        price: "₱1,000",
        distance: "2 hrs away",
        featured: true,
        geofence: false,
        color: "#10B981",
        days: "Full Day",
        description:
          "Largest wildlife adventure park in the Philippines featuring African safari experience and various adventure activities.",
        image: "🦒",
        activities: [
          "Wildlife Safari",
          "Zip Line",
          "Animal Feeding",
          "Adventure Rides",
        ],
      },
      {
        id: "11",
        name: "Top of Cebu",
        location: "Balamban, Cebu",
        latitude: 10.4689,
        longitude: 123.6944,
        type: "viewpoint",
        category: "adventure",
        rating: "4.7",
        reviews: 145,
        price: "₱200",
        distance: "2 hrs away",
        featured: false,
        geofence: false,
        color: "#F97316",
        days: "Half Day",
        description:
          "Mountain resort offering stunning views, hanging bridge, and various outdoor activities.",
        image: "🌄",
        activities: ["Sightseeing", "Hiking", "Photography", "Adventure Park"],
      },
      {
        id: "12",
        name: "Larsian BBQ",
        location: "Cebu City",
        latitude: 10.3076,
        longitude: 123.9814,
        type: "food",
        category: "food",
        rating: "4.3",
        reviews: 423,
        price: "₱150",
        distance: "20 min away",
        featured: false,
        geofence: true,
        color: "#F59E0B",
        days: "1-2 Hours",
        description:
          "Famous open-air barbecue complex offering authentic Cebuano street food experience.",
        image: "🍢",
        activities: [
          "Food Trip",
          "Local Cuisine",
          "Night Life",
          "Cultural Experience",
        ],
      },
    ];
  }

  // Get spots by ID for detailed view
  static async getSpotById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const allSpots = this.getAllCebuSpots();
    return allSpots.find((spot) => spot.id === id);
  }

  // Get featured spots for homepage
  static async getFeaturedSpots(limit = 6) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const allSpots = this.getAllCebuSpots();
    return allSpots.filter((spot) => spot.featured).slice(0, limit);
  }

  // Get nearby spots based on coordinates
  static async getNearbySpots(lat, lng, radius = 50) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allSpots = this.getAllCebuSpots();

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
