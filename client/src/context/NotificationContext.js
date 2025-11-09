import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { CebuSpotsService } from "../services/cebuSpotService";

// ==================== CONSTANTS & CONFIGURATION ====================
const NOTIFICATION_CONFIG = {
  radius: 1000, // Default 1km
  movementThreshold: 50, // meters
  checkInterval: 10000, // 10 seconds
  animationDuration: 300,
};

const NOTIFICATION_HANDLER = {
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
};

// ==================== UTILITY FUNCTIONS ====================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

const hasMovedSignificantly = (
  lastLocation,
  currentLocation,
  threshold = 50
) => {
  if (!lastLocation) return true;

  const distance = calculateDistance(
    lastLocation.latitude,
    lastLocation.longitude,
    currentLocation.latitude,
    currentLocation.longitude
  );

  return distance > threshold;
};

// ==================== CONTEXT CREATION ====================
const NotificationContext = createContext();

// ==================== NOTIFICATION CONFIGURATION ====================
Notifications.setNotificationHandler(NOTIFICATION_HANDLER);

// ==================== PROVIDER COMPONENT ====================
export const NotificationProvider = ({ children }) => {
  // ==================== STATE MANAGEMENT ====================
  const [notifiedSpots, setNotifiedSpots] = useState(new Set());
  const [inAppNotification, setInAppNotification] = useState(null);
  const [showInAppModal, setShowInAppModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [spots, setSpots] = useState([]);
  const [notificationRadius, setNotificationRadius] = useState(
    NOTIFICATION_CONFIG.radius
  );
  const [lastKnownLocation, setLastKnownLocation] = useState(null);

  // ==================== REFS ====================
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const locationSubscription = useRef(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    console.log("🚀 Starting notification setup...");
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!userLocation || spots.length === 0) return;

    console.log("🎯 Starting SMART real-time spot checking...");

    if (hasMovedSignificantly(lastKnownLocation, userLocation)) {
      console.log("🚶 User moved significantly, checking for spots...");
      checkNearbySpots(userLocation);
      setLastKnownLocation(userLocation);
    } else {
      console.log("💤 User stationary, skipping check");
    }

    const interval = setInterval(
      handleIntervalCheck,
      NOTIFICATION_CONFIG.checkInterval
    );

    return () => {
      console.log("🧹 Cleaning up real-time checking");
      clearInterval(interval);
    };
  }, [userLocation, spots, lastKnownLocation]);

  useEffect(() => {
    if (userLocation && spots.length > 0) {
      console.log(
        `🎯 Radius changed to ${notificationRadius}m, checking spots...`
      );
      checkNearbySpots(userLocation, true);
    }
  }, [notificationRadius]);

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // ==================== EVENT HANDLERS ====================
  const handleIntervalCheck = () => {
    if (
      lastKnownLocation &&
      hasMovedSignificantly(lastKnownLocation, userLocation)
    ) {
      console.log("🔄 User is moving, checking for spots...");
      checkNearbySpots(userLocation);
      setLastKnownLocation(userLocation);
    }
  };

  // ==================== CORE FUNCTIONS ====================
  const setupNotifications = async () => {
    try {
      console.log("📢 Requesting notification permissions...");
      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();
      console.log("Notification permission status:", notifStatus);

      console.log("📍 Requesting location permissions...");
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", locationStatus);

      await loadSpots();
      startLocationWatching();
    } catch (error) {
      console.log("❌ Notification setup error:", error);
    }
  };

  const loadSpots = async () => {
    try {
      console.log("🔄 Loading spots for notifications...");
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      console.log("✅ Spots loaded for notifications:", spotsData.length);
      setSpots(spotsData);
    } catch (error) {
      console.error("❌ Error loading spots for notifications:", error);
    }
  };

  const startLocationWatching = async () => {
    try {
      // Clean up previous subscription
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15000,
          distanceInterval: 100,
        },
        (newLoc) => {
          const updatedLocation = {
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
          };

          // ✅ FIX: Use setUserLocation instead of setLocalUserLocation
          if (hasMovedSignificantly(userLocation, updatedLocation, 50)) {
            setUserLocation(updatedLocation);
          }
        }
      );
    } catch (error) {
      console.log("❌ Location watching error:", error);
    }
  };

  const checkNearbySpots = (location, forceCheck = false) => {
    if (!location || spots.length === 0) {
      console.log("❌ Cannot check spots - no location or spots data");
      return;
    }

    console.log(
      `🔍 Checking ${spots.length} spots within ${notificationRadius}m...`
    );

    const nearbySpots = spots.filter((spot) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );

      const isNear = distance <= notificationRadius;
      const isNew = !notifiedSpots.has(spot.id);

      if (isNear && isNew) {
        console.log(
          `🎯 NEW SPOT IN RANGE: ${spot.name} (${Math.round(distance)}m)`
        );
      }

      return isNear && isNew;
    });

    if (nearbySpots.length > 0) {
      handleNewSpotsFound(nearbySpots);
    } else {
      console.log("📭 No new spots in range");
    }
  };

  const handleNewSpotsFound = (nearbySpots) => {
    console.log(`🚨 FOUND ${nearbySpots.length} NEW SPOTS IN RANGE!`);

    sendPushNotification(nearbySpots);
    showInAppNotification(nearbySpots);

    const newSpotIds = nearbySpots.map((spot) => spot.id);
    setNotifiedSpots((prev) => new Set([...prev, ...newSpotIds]));

    console.log("✅ Spots marked as notified:", newSpotIds);
  };

  const triggerRadiusCheck = (newRadius) => {
    console.log(`🎯 Manual radius change trigger: ${newRadius}m`);
    setNotificationRadius(newRadius);

    if (userLocation) {
      setTimeout(() => {
        checkNearbySpots(userLocation, true);
      }, 500);
    }
  };

  // ==================== NOTIFICATION FUNCTIONS ====================
  const sendPushNotification = async (nearbySpots) => {
    if (nearbySpots.length === 0) return;

    const { title, body } = generateNotificationContent(nearbySpots);

    try {
      console.log("📢 Sending push notification:", title);

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: {
            type: "nearby_spot",
            spotsCount: nearbySpots.length,
            radius: notificationRadius,
          },
        },
        trigger: null,
      });

      console.log("✅ Push notification sent!");
    } catch (error) {
      console.log("❌ Push notification error:", error);
    }
  };

  const generateNotificationContent = (nearbySpots) => {
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

      return {
        title: `📍 You're near ${spot.name}!`,
        body: `Within your ${notificationRadius / 1000}km radius - ${distance}m away`,
      };
    } else {
      return {
        title: `🏝️ ${nearbySpots.length} Spots Nearby!`,
        body: `Found ${nearbySpots.length} spots within your ${notificationRadius / 1000}km radius`,
      };
    }
  };

  const showInAppNotification = (nearbySpots) => {
    if (nearbySpots.length === 0) return;

    console.log(
      "🔄 Creating in-app notification for",
      nearbySpots.length,
      "spots"
    );

    const notificationData = generateInAppNotificationData(nearbySpots);

    setInAppNotification(notificationData);
    setShowInAppModal(true);

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const generateInAppNotificationData = (nearbySpots) => {
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

      return {
        type: "single",
        title: `📍 You're near ${spot.name}!`,
        message: `Only ${distance}m away within your ${notificationRadius / 1000}km radius`,
        spot: spot,
        distance: distance,
        radius: notificationRadius,
      };
    } else {
      return {
        type: "multiple",
        title: `🏝️ ${nearbySpots.length} Spots Nearby!`,
        message: `Found ${nearbySpots.length} spots within your ${notificationRadius / 1000}km radius`,
        spots: nearbySpots.slice(0, 3),
        totalCount: nearbySpots.length,
        radius: notificationRadius,
      };
    }
  };

  const hideInAppNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: NOTIFICATION_CONFIG.animationDuration,
      useNativeDriver: true,
    }).start(() => {
      setShowInAppModal(false);
      setInAppNotification(null);
    });
  };

  const sendCustomNotification = async (title, body, data = {}) => {
    try {
      console.log("📢 Sending custom notification:", title);

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { type: "custom", ...data },
        },
        trigger: null,
      });

      console.log("✅ Custom notification sent!");
      return true;
    } catch (error) {
      console.log("❌ Custom notification error:", error);
      return false;
    }
  };

  const showCustomInAppNotification = (notificationData) => {
    setInAppNotification({
      ...notificationData,
      type: "custom",
    });
    setShowInAppModal(true);

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  // ==================== CONTEXT VALUE ====================
  const value = {
    radius: notificationRadius,
    setRadius: setNotificationRadius,
    triggerRadiusCheck,
    checkNearbySpots,
    sendCustomNotification,
    showCustomInAppNotification,
    inAppNotification,
    showInAppModal,
    hideInAppNotification,
    slideAnim,
    sendPushNotification,
    spots,
    loadSpots,
    userLocation,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <InAppNotificationModal
        inAppNotification={inAppNotification}
        showInAppModal={showInAppModal}
        slideAnim={slideAnim}
        hideInAppNotification={hideInAppNotification}
        notificationRadius={notificationRadius}
      />
    </NotificationContext.Provider>
  );
};

// ==================== IN-APP NOTIFICATION MODAL ====================
const InAppNotificationModal = ({
  inAppNotification,
  showInAppModal,
  slideAnim,
  hideInAppNotification,
  notificationRadius,
}) => {
  if (!inAppNotification || !showInAppModal) return null;

  const renderSingleNotification = () => (
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
          onPress={hideInAppNotification}
          className="flex-1 bg-green-600 py-2 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-sm">
            DISMISS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMultipleNotification = () => (
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
      {inAppNotification.spots.map((spot) => (
        <View
          key={spot.id}
          className="flex-row items-center py-2 border-t border-gray-100"
        >
          <View className="w-2 h-2 bg-green-500 rounded-full" />
          <Text className="text-gray-700 text-sm font-medium ml-2 flex-1">
            {spot.name}
          </Text>
        </View>
      ))}
      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={hideInAppNotification}
          className="flex-1 bg-blue-600 py-2 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-sm">
            EXPLORE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomNotification = () => (
    <View className="p-4 w-80">
      <View className="flex-row items-start">
        <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-3">
          <Feather name="bell" size={20} color="#8B5CF6" />
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
      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={hideInAppNotification}
          className="flex-1 bg-purple-600 py-2 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-sm">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotificationContent = () => {
    switch (inAppNotification.type) {
      case "single":
        return renderSingleNotification();
      case "multiple":
        return renderMultipleNotification();
      case "custom":
        return renderCustomNotification();
      default:
        return null;
    }
  };

  return (
    <Modal
      transparent={true}
      visible={showInAppModal}
      animationType="none"
      onRequestClose={hideInAppNotification}
    >
      <View className="flex-1 justify-start items-center pt-10">
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-white rounded-2xl mx-4 border border-gray-200 shadow-2xl"
        >
          {renderNotificationContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

// ==================== CUSTOM HOOK ====================
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
