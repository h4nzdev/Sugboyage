import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Map,
  Brain,
  Share2,
  Star,
  Navigation,
  Search,
  X,
  AlertCircle,
  ExternalLink,
  Heart,
  Clock,
  Compass,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CebuSpotsService } from "../../services/cebuSpotService";

export default function LandingPage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
  });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [spotsWithinRadius, setSpotsWithinRadius] = useState([]);
  const [allSpots, setAllSpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <Map className="w-12 h-12" />,
      title: "Smart Discovery",
      description:
        "Find hidden gems with intelligent location-based recommendations and real-time proximity alerts.",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI Itineraries",
      description:
        "Personalized travel plans crafted by AI based on your preferences, budget, and time constraints.",
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "Travel Community",
      description:
        "Share experiences, photos, and connect with fellow explorers in our vibrant travel community.",
    },
    {
      icon: <Compass className="w-12 h-12" />,
      title: "Live Navigation",
      description:
        "Turn-by-turn directions with live traffic updates and optimized routes for seamless exploration.",
    },
  ];

  const categories = [
    { id: "all", name: "All Spots", icon: "✨" },
    { id: "historical", name: "Historical", icon: "🏛️" },
    { id: "nature", name: "Nature", icon: "🌿" },
    { id: "adventure", name: "Adventure", icon: "🧗" },
    { id: "viewpoint", name: "Viewpoints", icon: "🏞️" },
    { id: "beach", name: "Beaches", icon: "🏖️" },
    { id: "food", name: "Food", icon: "🍴" },
  ];

  const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 2000, label: "2 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 50000, label: "50 km" },
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        const spotsData = await CebuSpotsService.getAllCebuSpots();
        setAllSpots(spotsData);
        setNotificationMessage(
          `Welcome! Discover ${spotsData.length} amazing spots in Cebu`
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } catch (error) {
        console.error("Error loading spots:", error);
        setNotificationMessage("Welcome to SugVoyage! Start exploring Cebu");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, []);

  useEffect(() => {
    if (allSpots.length === 0) return;

    const filtered = allSpots
      .filter((spot) => {
        if (!spot.latitude || !spot.longitude) return false;

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        );

        const matchesSearch = spot.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          activeCategory === "all" ||
          spot.category === activeCategory ||
          spot.type === activeCategory;
        const withinRadius = distance <= radius;

        return matchesSearch && matchesCategory && withinRadius;
      })
      .map((spot) => ({
        ...spot,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    setSpotsWithinRadius(filtered);
  }, [userLocation, radius, searchQuery, activeCategory, allSpots]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setNotificationMessage(
            "📍 Location updated! Discovering nearby spots..."
          );
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        },
        (error) => {
          setNotificationMessage("Using Cebu City as your starting point");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      );
    }
  };

  const SimpleMap = () => (
    <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Live Map View</h3>
        <button
          onClick={getUserLocation}
          className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
        >
          <Navigation size={18} />
          Use My Location
        </button>
      </div>

      <div className="h-80 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-6 relative overflow-hidden border border-red-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">
              Interactive Cebu Map
            </p>
            <p className="text-gray-500 mt-2">
              Login to unlock real-time navigation
            </p>
          </div>
        </div>

        {spotsWithinRadius.slice(0, 6).map((spot, index) => (
          <div
            key={spot._id || spot.id}
            className={`absolute w-5 h-5 rounded-full border-2 border-white shadow-lg ${
              spot.distance <= 2000
                ? "bg-green-500"
                : spot.distance <= 5000
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              left: `${40 + Math.cos(index * 0.6) * 25}%`,
              top: `${50 + Math.sin(index * 0.6) * 25}%`,
            }}
          />
        ))}

        <div
          className="absolute w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-xl animate-pulse"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <button
        onClick={() => navigate("/auth/login")}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-lg"
      >
        🚀 Start Your Journey - Login Now
      </button>
    </div>
  );

  const SpotList = () => (
    <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Discover Amazing Spots
          </h3>
          <p className="text-gray-600">
            {spotsWithinRadius.length} spots found within {radius / 1000}km
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search spots..."
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
              activeCategory === category.id
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing spots...</p>
        </div>
      )}

      {!loading && spotsWithinRadius.length === 0 ? (
        <div className="text-center py-16">
          <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No spots found nearby</p>
          <p className="text-gray-500">
            Try increasing the search radius or exploring different categories
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {spotsWithinRadius.map((spot) => (
            <div
              key={spot._id || spot.id}
              className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white flex flex-col"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={spot.image_url || spot.image}
                  alt={spot.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1545562083-a600704fa486?w=400";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {spot.featured && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Sparkles size={14} />
                    Featured
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(spot.distance / 1000)}km away
                    </span>
                    <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">
                        {spot.rating || "4.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    {spot.name}
                  </h4>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                  {spot.description ||
                    "Discover this amazing spot in beautiful Cebu"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <MapPin size={12} />
                    {spot.category || spot.type || "Adventure"}
                  </span>
                  {spot.price && (
                    <span className="text-green-600 font-bold text-sm">
                      {spot.price}
                    </span>
                  )}
                </div>

                {spot.activities && spot.activities.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {spot.activities.slice(0, 3).map((activity, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Button container with consistent positioning */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => setSelectedSpot(spot)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold group/btn"
                  >
                    Explore More
                    <ExternalLink
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
          <Sparkles size={20} />
          <span className="font-semibold">{notificationMessage}</span>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                SugVoyage
              </span>
              <p className="text-xs text-gray-500 -mt-1">
                Explore Cebu Smartly
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <a
              href="#spots"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Discover
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#community"
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Community
            </a>
          </div>

          <button
            onClick={() => navigate("/auth/login")}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Start Exploring
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                Your Smart Travel Companion in Cebu
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Explore Cebu
                <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Discover hidden gems, create unforgettable memories, and connect
                with fellow travelers. SugVoyage makes exploring Cebu an
                extraordinary adventure.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <button className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-2xl flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-red-200 text-red-700 px-10 py-4 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 font-semibold">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-orange-200 rounded-[3rem] blur-3xl opacity-40"></div>
              <div className="relative bg-white rounded-[3rem] shadow-2xl p-8 border border-red-100">
                <SimpleMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="spots" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Discover <span className="text-red-600">Cebu's Magic</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From stunning beaches to historical landmarks, uncover{" "}
              {allSpots.length}+ incredible spots with our intelligent discovery
              system
            </p>
          </div>

          <div className="grid xl:grid-cols-4 gap-8">
            <div className="xl:col-span-4">
              <SpotList />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-24 bg-gradient-to-br from-red-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Why <span className="text-red-600">SugVoyage</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reinvented travel planning with cutting-edge technology and
              community-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-red-100 hover:border-red-200 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="text-red-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8">
            Ready for Adventure?
          </h2>
          <p className="text-xl text-red-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers exploring Cebu with SugVoyage. Your next
            unforgettable journey is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-white text-red-600 px-12 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-lg shadow-2xl"
            >
              🚀 Start Exploring Free
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl hover:bg-white hover:text-red-600 transition-all duration-300 font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">SugVoyage</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Your smart travel companion for exploring the beautiful island of
            Cebu. Discover, connect, and create unforgettable memories.
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
          </div>
          <p className="text-sm">
            &copy; 2025 SugVoyage. Made with ❤️ for travelers exploring Cebu.
          </p>
        </div>
      </footer>

      {selectedSpot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedSpot.image_url || selectedSpot.image}
                alt={selectedSpot.name}
                className="w-full h-80 object-cover rounded-t-3xl"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1545562083-a600704fa486?w=400";
                }}
              />
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300"
              >
                <X size={24} />
              </button>
              {selectedSpot.featured && (
                <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Sparkles size={16} />
                  Featured Spot
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-3xl font-black text-gray-900 pr-4">
                  {selectedSpot.name}
                </h3>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">
                    {selectedSpot.rating || "4.0"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {selectedSpot.description ||
                  "An incredible destination in Cebu waiting to be explored."}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      📍 Location
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedSpot.location || "Cebu, Philippines"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      🎯 Category
                    </p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedSpot.category ||
                        selectedSpot.type ||
                        "Adventure Spot"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      📏 Distance
                    </p>
                    <p className="font-semibold text-gray-900">
                      {Math.round(selectedSpot.distance)}m from your location
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      💰 Price
                    </p>
                    <p className="font-semibold text-green-600 text-lg">
                      {selectedSpot.price || "Free Entry"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSpot.activities &&
                selectedSpot.activities.length > 0 && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 font-medium mb-3">
                      🏃‍♂️ Activities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpot.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedSpot(null);
                    navigate("/auth/login");
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  🗺️ Get Directions & Plan Visit
                </button>
                <button
                  onClick={() => setSelectedSpot(null)}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
