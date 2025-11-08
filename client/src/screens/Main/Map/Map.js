import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { CebuSpotsService } from "../../../services/cebuSpotService";
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get("window");

const colors = {
  primary: "#DC143C",
  secondary: "#FFF8DC",
  background: "#FFFFFF",
  text: "#2D3748",
  muted: "#718096",
  light: "#F7FAFC",
};

// Configure notifications OUTSIDE component
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Google Maps API Key - YOU NEED TO GET THIS FROM GOOGLE CLOUD CONSOLE
const GOOGLE_MAPS_APIKEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

export default function Map() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spots, setSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [locationLoading, setLocationLoading] = useState(true);
  const [notifiedSpots, setNotifiedSpots] = useState(new Set());
  const [inAppNotification, setInAppNotification] = useState(null);
  const [showInAppModal, setShowInAppModal] = useState(false);
  const [spotsWithinCurrentRadius, setSpotsWithinCurrentRadius] = useState([]);

  // NEW STATES FOR ROUTING
  const [showRoute, setShowRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState(null);

  const mapRef = useRef();
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // Categories and radius options
  const categories = [
    { icon: "map-pin", name: "All" },
    { icon: "book", name: "Cultural" },
    { icon: "home", name: "Historical" },
    { icon: "compass", name: "Adventure" },
    { icon: "sun", name: "Beach" },
  ];

  const radiusOptions = [
    { value: 500, label: "500m" },
    { value: 1000, label: "1km" },
    { value: 2000, label: "2km" },
    { value: 5000, label: "5km" },
    { value: 10000, label: "10km" },
  ];

  // ==================== INITIAL SETUP ====================
  useEffect(() => {
    console.log("🚀 Starting app setup...");
    setupApp();
  }, []);

  // REALTIME RADIUS UPDATES - This runs every time radius changes!
  useEffect(() => {
    if (userLocation && spots.length > 0) {
      console.log(`🔄 Radius changed to ${radius}m, updating spots...`);
      updateSpotsWithinRadius();
      checkForNewSpotsInRadius();
    }
  }, [radius, userLocation, spots]);

  const setupApp = async () => {
    try {
      // 1. Request notification permissions
      console.log("📢 Requesting notification permissions...");
      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();
      console.log("Notification permission status:", notifStatus);

      // 2. Request location permissions
      console.log("📍 Requesting location permissions...");
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", locationStatus);

      // 3. Load spots and get location
      await loadSpots();
      await getUserLocation();
    } catch (error) {
      console.log("❌ Setup error:", error);
    }
  };

  // ==================== ROUTING FUNCTIONS ====================
  const startNavigation = (spot) => {
    if (!userLocation) {
      console.log("❌ Cannot start navigation - no user location");
      return;
    }

    console.log("🗺️ Starting navigation to:", spot.name);

    setDestination({
      latitude: spot.latitude,
      longitude: spot.longitude,
    });
    setShowRoute(true);
    setIsNavigating(true);

    // Focus map on both user and destination
    if (mapRef.current) {
      const coordinates = [
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        {
          latitude: spot.latitude,
          longitude: spot.longitude,
        },
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  const stopNavigation = () => {
    console.log("🛑 Stopping navigation");
    setShowRoute(false);
    setIsNavigating(false);
    setRouteInfo(null);
    setDestination(null);
  };

  const handleDirectionsReady = (result) => {
    console.log("📍 Route calculated:", result);
    setRouteInfo({
      distance: result.distance,
      duration: result.duration,
      coordinates: result.coordinates,
    });
  };

  const handleDirectionsError = (error) => {
    console.log("❌ Route calculation error:", error);
    // Fallback: just show straight line if routing fails
    if (userLocation && selectedSpot) {
      setRouteInfo({
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          selectedSpot.latitude,
          selectedSpot.longitude
        ),
        duration: null,
        coordinates: [
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          {
            latitude: selectedSpot.latitude,
            longitude: selectedSpot.longitude,
          },
        ],
      });
    }
  };

  // ==================== REALTIME RADIUS UPDATES ====================
  const updateSpotsWithinRadius = () => {
    if (!userLocation) return;

    const spotsInRadius = filteredSpots.filter((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= radius;
    });

    setSpotsWithinCurrentRadius(spotsInRadius);
    console.log(`📍 ${spotsInRadius.length} spots within ${radius}m radius`);
  };

  const checkForNewSpotsInRadius = () => {
    if (!userLocation || spots.length === 0) return;

    // Find spots that are newly within the current radius
    const newSpotsInRadius = spots.filter((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );

      const isInRadius = distance <= radius;
      const isNew = !notifiedSpots.has(spot.id);

      return isInRadius && isNew;
    });

    if (newSpotsInRadius.length > 0) {
      console.log(
        `🎯 Found ${newSpotsInRadius.length} NEW spots in ${radius}m radius!`
      );

      // Send notifications for new spots
      sendPushNotification(newSpotsInRadius);
      showInAppNotification(newSpotsInRadius);

      // Mark as notified
      const newSpotIds = newSpotsInRadius.map((spot) => spot.id);
      setNotifiedSpots((prev) => new Set([...prev, ...newSpotIds]));
    }
  };

  // ==================== SPOT MANAGEMENT ====================
  const loadSpots = async () => {
    try {
      console.log("🔄 Loading spots...");
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      console.log("✅ Successfully loaded spots:", spotsData.length);
      setSpots(spotsData);
    } catch (error) {
      console.error("❌ Error loading spots:", error);
      setSpots([]);
    }
  };

  const filteredSpots =
    selectedCategory === "All"
      ? spots
      : spots.filter(
          (spot) =>
            spot.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // ==================== LOCATION MANAGEMENT ====================
  const getUserLocation = async () => {
    try {
      setLocationLoading(true);
      console.log("📍 Getting user location...");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log("📍 User location found:", latitude, longitude);

      const newLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation(newLocation);

      // Check for nearby spots immediately
      setTimeout(() => {
        checkNearbySpots(newLocation);
        updateSpotsWithinRadius();
      }, 1000);

      // Start watching for location changes
      startLocationWatching();
    } catch (error) {
      console.log("❌ Location error, using static location:", error);
      // Fallback to Cebu city center
      const staticLocation = {
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setUserLocation(staticLocation);

      setTimeout(() => {
        checkNearbySpots(staticLocation);
        updateSpotsWithinRadius();
      }, 1000);
    } finally {
      setLocationLoading(false);
    }
  };

  const startLocationWatching = async () => {
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Check every 10 seconds
          distanceInterval: 50, // Check every 50 meters
        },
        (newLoc) => {
          const updatedLocation = {
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          console.log("📍 Location updated, checking spots...");
          setUserLocation(updatedLocation);
          checkNearbySpots(updatedLocation);
          updateSpotsWithinRadius();
        }
      );
      console.log("📍 Location watching started");
    } catch (error) {
      console.log("❌ Location watching error:", error);
    }
  };

  // ==================== NOTIFICATION SYSTEM ====================
  const showInAppNotification = (nearbySpots) => {
    if (nearbySpots.length === 0) {
      console.log("❌ No spots to show notification for");
      return;
    }

    console.log(
      "🔄 Creating in-app notification for",
      nearbySpots.length,
      "spots"
    );

    let notificationData;

    if (nearbySpots.length === 1) {
      const spot = nearbySpots[0];
      const distance = Math.round(
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        )
      );

      notificationData = {
        type: "single",
        title: `🎯 You're near ${spot.name}!`,
        message: `Only ${distance}m away within your ${radius / 1000}km radius`,
        spot: spot,
      };
    } else {
      notificationData = {
        type: "multiple",
        title: `🏝️ ${nearbySpots.length}+ Spots in Your ${radius / 1000}km Radius!`,
        message: `Found ${nearbySpots.length} places nearby. Adjust radius to discover more!`,
        spots: nearbySpots.slice(0, 3),
        totalCount: nearbySpots.length,
        radius: radius,
      };
    }

    setInAppNotification(notificationData);
    setShowInAppModal(true);

    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    console.log("✅ In-app notification shown");

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideInAppNotification();
    }, 5000);
  };

  const hideInAppNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowInAppModal(false);
      setInAppNotification(null);
    });
  };

  const sendPushNotification = async (nearbySpots) => {
    if (nearbySpots.length === 0) return;

    let title, body;

    if (nearbySpots.length === 1) {
      const spot = nearbySpots[0];
      const distance = Math.round(
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        )
      );
      title = `🎯 ${spot.name} in Your ${radius / 1000}km Radius!`;
      body = `Only ${distance}m away - within your discovery zone`;
    } else {
      title = `🏝️ ${nearbySpots.length}+ Spots in ${radius / 1000}km Radius!`;
      body = `Found ${nearbySpots.length} places nearby. Explore now!`;
    }

    try {
      console.log("📢 Sending push notification:", title);

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { spotsCount: nearbySpots.length, radius: radius },
        },
        trigger: null,
      });

      console.log("✅ Push notification sent successfully!");
    } catch (error) {
      console.log("❌ Push notification error:", error);
    }
  };

  // ==================== CORE GEO-FENCING LOGIC ====================
  const checkNearbySpots = (location) => {
    if (!location) {
      console.log("❌ No location available for checking spots");
      return;
    }

    if (spots.length === 0) {
      console.log("❌ No spots loaded yet");
      return;
    }

    console.log(`🔍 Checking ${spots.length} spots around current location...`);

    const GEOFENCE_DISTANCE = 50000; // 50km FOR TESTING - CHANGE TO 500 LATER!

    // Find spots within radius that haven't been notified
    const newNearbySpots = spots.filter((spot) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );

      const isNear = distance <= GEOFENCE_DISTANCE;
      const isNew = !notifiedSpots.has(spot.id);

      if (isNear && isNew) {
        console.log(
          `🎯 NEW SPOT FOUND: ${spot.name} (${Math.round(distance)}m away)`
        );
      }

      return isNear && isNew;
    });

    if (newNearbySpots.length > 0) {
      console.log(
        `🚀 Found ${newNearbySpots.length} new nearby spots! Triggering notifications...`
      );

      // Send push notification
      sendPushNotification(newNearbySpots);

      // Show in-app popup
      showInAppNotification(newNearbySpots);

      // Mark as notified
      const newSpotIds = newNearbySpots.map((spot) => spot.id);
      setNotifiedSpots((prev) => new Set([...prev, ...newSpotIds]));

      console.log("✅ Spots marked as notified:", newSpotIds);
    } else {
      console.log("📭 No new nearby spots found");
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  // Get marker color based on whether spot is within current radius
  const getMarkerColor = (spot) => {
    if (!userLocation) return "#dc2626"; // Default red

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    return distance <= radius ? "#" : "#dc2626"; // Green if within radius, red if not
  };

  // ==================== MAP FUNCTIONS ====================
  const focusOnSpot = (spot) => {
    setSelectedSpot(spot);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.latitude,
          longitude: spot.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  const focusOnUser = () => {
    setSelectedSpot(null);
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleSpotPress = (spot) => {
    focusOnSpot(spot);
    // Stop navigation when selecting a new spot
    if (isNavigating) {
      stopNavigation();
    }
  };

  const getMarkerKey = (spot, index) => {
    return `marker-${spot.id}-${spot.latitude}-${spot.longitude}-${index}`;
  };

  // ==================== UI COMPONENTS ====================
  const InAppNotification = () => {
    if (!inAppNotification || !showInAppModal) return null;

    return (
      <Modal
        transparent={true}
        visible={showInAppModal}
        animationType="none"
        onRequestClose={hideInAppNotification}
      >
        <View className="flex-1 justify-start items-center pt-10">
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-2xl mx-4 border border-gray-200 shadow-2xl"
          >
            {/* Single Spot Notification */}
            {inAppNotification.type === "single" && (
              <View className="p-4 w-80">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-3">
                    <Feather name="map-pin" size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {inAppNotification.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-3">
                      {inAppNotification.message}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {inAppNotification.spot.description?.substring(0, 80)}...
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      focusOnSpot(inAppNotification.spot);
                      hideInAppNotification();
                    }}
                    className="flex-1 bg-green-600 py-2 rounded-xl"
                  >
                    <Text className="text-white text-center font-bold text-sm">
                      VIEW ON MAP
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={hideInAppNotification}
                    className="px-4 py-2 rounded-xl border border-gray-300"
                  >
                    <Text className="text-gray-700 font-bold text-sm">
                      DISMISS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Multiple Spots Notification */}
            {inAppNotification.type === "multiple" && (
              <View className="p-4 w-80">
                <View className="flex-row items-start mb-3">
                  <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-3">
                    <Feather name="navigation" size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {inAppNotification.title}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {inAppNotification.message}
                    </Text>
                  </View>
                </View>

                {/* Show first 3 spots */}
                {inAppNotification.spots.map((spot, index) => (
                  <View
                    key={spot.id}
                    className="flex-row items-center py-2 border-t border-gray-100"
                  >
                    <View
                      className={`w-2 h-2 rounded-full ${getMarkerColor(spot) === "#10b981" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <Text className="text-gray-700 text-sm font-medium ml-2 flex-1">
                      {spot.name}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {Math.round(
                        calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          spot.latitude,
                          spot.longitude
                        )
                      )}
                      m
                    </Text>
                  </View>
                ))}

                {inAppNotification.totalCount > 3 && (
                  <Text className="text-gray-500 text-xs text-center mt-2">
                    +{inAppNotification.totalCount - 3} more spots in your
                    radius
                  </Text>
                )}

                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      setRadius(radius + 1000); // Increase radius by 1km
                      hideInAppNotification();
                    }}
                    className="flex-1 bg-blue-600 py-2 rounded-xl"
                  >
                    <Text className="text-white text-center font-bold text-sm">
                      INCREASE RADIUS
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={hideInAppNotification}
                    className="flex-1 bg-gray-600 py-2 rounded-xl"
                  >
                    <Text className="text-white text-center font-bold text-sm">
                      EXPLORE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const UserLocationRadius = () => {
    if (!userLocation) return null;

    return (
      <>
        <Circle
          center={userLocation}
          radius={radius}
          strokeWidth={2}
          strokeColor={colors.primary}
          fillColor="rgba(220, 20, 60, 0.1)"
        />
      </>
    );
  };

  const RadiusSettings = () => (
    <View className="absolute top-20 left-4 z-10 bg-white/95 rounded-2xl p-3 border border-gray-200 shadow-lg">
      <View className="flex-row items-center mb-2">
        <Feather name="navigation" size={16} color={colors.primary} />
        <Text className="text-gray-800 font-bold ml-2 text-sm">
          Discovery Radius
        </Text>
      </View>
      <View className="flex-row gap-1 flex-wrap">
        {radiusOptions.map((option) => (
          <TouchableOpacity
            key={`radius-${option.value}`}
            onPress={() => setRadius(option.value)}
            className={`px-3 py-2 rounded-xl mb-1 ${
              radius === option.value ? "bg-red-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                radius === option.value ? "text-white" : "text-gray-700"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-gray-600 text-xs mt-2 text-center">
        {spotsWithinCurrentRadius.length} spots in radius
      </Text>
    </View>
  );

  const CategoryFilter = () => (
    <View className="absolute top-4 left-4 right-4 z-10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={`category-${index}`}
            onPress={() => setSelectedCategory(category.name)}
            className={`px-4 py-3 rounded-2xl flex-row items-center ${
              selectedCategory === category.name ? "bg-red-600" : "bg-white/95"
            } border border-gray-200 shadow-lg`}
          >
            <Feather
              name={category.icon}
              size={16}
              color={
                selectedCategory === category.name
                  ? colors.secondary
                  : colors.primary
              }
            />
            <Text
              className={`ml-2 font-bold text-sm ${
                selectedCategory === category.name
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const MapControls = () => (
    <View className="absolute top-20 right-4 gap-2 z-10">
      <TouchableOpacity
        onPress={focusOnUser}
        className="bg-white p-3 rounded-xl shadow-lg border border-gray-200"
      >
        <Feather name="navigation" size={20} color={colors.primary} />
      </TouchableOpacity>
      {isNavigating && (
        <TouchableOpacity
          onPress={stopNavigation}
          className="bg-red-500 p-3 rounded-xl shadow-lg border border-gray-200"
        >
          <Feather name="x" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const SelectedSpotDetail = () => {
    if (!selectedSpot || !userLocation) return null;

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      selectedSpot.latitude,
      selectedSpot.longitude
    );

    const isWithinRadius = distance <= radius;

    return (
      <View className="absolute bottom-4 left-4 right-4 z-10">
        <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View
                  className={`w-3 h-3 rounded-full mr-2 ${isWithinRadius ? "bg-green-500" : "bg-red-500"}`}
                />
                <Text className="text-gray-900 font-bold text-lg">
                  {selectedSpot.name}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm mb-2">
                {selectedSpot.location}
              </Text>
              <Text className="text-gray-600 text-sm leading-5 mb-3">
                {selectedSpot.description}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text className="text-gray-800 font-bold ml-1">
                    {selectedSpot.rating}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    isWithinRadius ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isWithinRadius ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {distance <= 1000
                      ? `${Math.round(distance)}m`
                      : `${(distance / 1000).toFixed(1)}km`}
                    {isWithinRadius ? " ✅" : " ❌"}
                  </Text>
                </View>
              </View>

              {/* Route Information */}
              {routeInfo && (
                <View className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Feather name="clock" size={12} color="#3B82F6" />
                      <Text className="text-blue-700 text-xs font-bold ml-1">
                        {routeInfo.duration
                          ? `${Math.round(routeInfo.duration)} min`
                          : "Calculating..."}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Feather name="navigation" size={12} color="#3B82F6" />
                      <Text className="text-blue-700 text-xs font-bold ml-1">
                        {routeInfo.distance
                          ? `${routeInfo.distance.toFixed(1)} km`
                          : "Calculating..."}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedSpot(null);
                stopNavigation();
              }}
              className="p-1"
            >
              <Feather name="x" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => startNavigation(selectedSpot)}
              className={`flex-1 py-3 rounded-xl ${isWithinRadius ? "bg-green-600" : "bg-red-600"}`}
            >
              <Text className="text-white text-center font-bold text-sm">
                {isNavigating ? "NAVIGATING..." : "START NAVIGATION"}
              </Text>
            </TouchableOpacity>
            {isNavigating && (
              <TouchableOpacity
                onPress={stopNavigation}
                className="px-4 py-3 rounded-xl bg-gray-500"
              >
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ==================== RENDER ====================
  if (locationLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <View className="w-12 h-12 bg-red-100 rounded-2xl items-center justify-center mb-4">
          <Feather name="map-pin" size={24} color={colors.primary} />
        </View>
        <Text className="text-gray-800 font-bold text-lg">
          Getting your location...
        </Text>
        <Text className="text-gray-500 text-sm mt-2">
          Preparing your Cebu map
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-3 pb-4 border-b border-gray-200">
        <View className="flex-row items-center mb-1">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-2xl font-black text-gray-900">
              Cebu Explorer Map
            </Text>
            <Text className="text-red-600 text-sm font-medium">
              {isNavigating
                ? "🚗 Navigating to " + selectedSpot?.name
                : `Real-time radius updates! ${spotsWithinCurrentRadius.length} spots in ${radius / 1000}km`}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
              <Feather name="search" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Map Container */}
      <View className="flex-1 relative">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={userLocation}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <UserLocationRadius />

          {/* Directions Route */}
          {showRoute && userLocation && destination && (
            <MapViewDirections
              origin={userLocation}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#3B82F6"
              onReady={handleDirectionsReady}
              onError={handleDirectionsError}
            />
          )}

          {/* Fallback straight line if routing fails */}
          {showRoute && routeInfo && routeInfo.coordinates && (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeWidth={3}
              strokeColor="#60A5FA"
              strokeColors={["#7B9FE0", "#60A5FA"]}
            />
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker
              coordinate={destination}
              pinColor="#3B82F6"
              title="Destination"
            />
          )}

          {/* Spots */}
          {filteredSpots.map((spot, index) => (
            <Marker
              key={getMarkerKey(spot, index)}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => handleSpotPress(spot)}
              pinColor={getMarkerColor(spot)} // Green if within radius, red if not
            />
          ))}
        </MapView>

        {/* IN-APP NOTIFICATION MODAL */}
        <InAppNotification />

        {/* UI COMPONENTS */}
        <CategoryFilter />
        <RadiusSettings />
        <MapControls />
        <SelectedSpotDetail />
      </View>

      {/* Bottom Info Bar */}
      <View className="px-5 py-3 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-2"></View>
            <Text className="text-gray-700 text-sm font-medium">
              {spotsWithinCurrentRadius.length} spots within {radius / 1000}km
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-1"></View>
            <Text className="text-gray-600 text-xs">Outside radius</Text>
          </View>
          <Text className="text-red-600 text-xs font-bold">
            {isNavigating ? "🚗 NAVIGATION ACTIVE" : "LIVE RADIUS UPDATES 🎯"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
