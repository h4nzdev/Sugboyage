import React, { createContext, useContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { CebuSpotsService } from "../services/cebuSpotService";

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

// ==================== CONTEXT CREATION ====================
const NotificationContext = createContext();

// ==================== PROVIDER COMPONENT ====================
export const NotificationProvider = ({ children }) => {
  // ==================== STATE MANAGEMENT ====================
  const [notifiedSpots, setNotifiedSpots] = useState(new Set());
  const [userLocation, setUserLocation] = useState(null);
  const [spots, setSpots] = useState([]);
  const [radius, setRadius] = useState(1000); // Default 1km

  // ==================== EFFECTS ====================
  useEffect(() => {
    console.log("🚀 Starting notification setup...");
    setupNotifications();
  }, []);

  // 🎯 Check for spots when user location changes
  useEffect(() => {
    if (userLocation && spots.length > 0) {
      console.log("📍 User location updated, checking spots...");
      checkForSpotsInRadius();
    }
  }, [userLocation, radius, spots]);

  // ==================== CORE FUNCTIONS ====================
  const setupNotifications = async () => {
    try {
      console.log("📢 Requesting notification permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("✅ Notification permission:", status);

      console.log("📍 Requesting location permissions...");
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      console.log("✅ Location permission:", locationStatus.status);

      await loadSpots();
      startLocationWatching();
    } catch (error) {
      console.log("❌ Setup error:", error);
    }
  };

  const loadSpots = async () => {
    try {
      console.log("🔄 Loading spots...");
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      console.log(`✅ ${spotsData.length} spots loaded`);
      setSpots(spotsData);
    } catch (error) {
      console.error("❌ Error loading spots:", error);
    }
  };

  const startLocationWatching = async () => {
    try {
      console.log("🎯 Starting location watching...");

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLoc) => {
          const updatedLocation = {
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
          };
          setUserLocation(updatedLocation);
        }
      );
    } catch (error) {
      console.log("❌ Location error:", error);
    }
  };

  // 🎯 MAIN FUNCTION: Check for spots in radius
  const checkForSpotsInRadius = () => {
    if (!userLocation || spots.length === 0) return;

    console.log(`🔍 Checking ${spots.length} spots within ${radius}m...`);

    const newSpotsInRadius = spots.filter((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );

      const isInRadius = distance <= radius;
      const isNewSpot = !notifiedSpots.has(spot.id);

      return isInRadius && isNewSpot;
    });

    // Send notifications for new spots
    newSpotsInRadius.forEach((spot) => {
      sendSpotNotification(spot);
    });

    // Mark spots as notified
    if (newSpotsInRadius.length > 0) {
      const newSpotIds = newSpotsInRadius.map((spot) => spot.id);
      setNotifiedSpots((prev) => new Set([...prev, ...newSpotIds]));
      console.log(`✅ ${newSpotIds.length} spots marked as notified`);
    }
  };

  // 🎯 SIMPLE NOTIFICATION FUNCTION
  const sendSpotNotification = async (spot) => {
    if (!userLocation) return;

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    const roundedDistance = Math.round(distance);

    try {
      console.log(
        `📢 SENDING NOTIFICATION: ${spot.name} (${roundedDistance}m)`
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📍 ${spot.name} Nearby!`,
          body: `You're ${roundedDistance}m away (within ${radius / 1000}km radius)`,
          sound: true,
          data: { spotId: spot.id, distance: roundedDistance },
        },
        trigger: null,
      });

      console.log(`✅ NOTIFICATION SENT: ${spot.name}`);
    } catch (error) {
      console.log(`❌ NOTIFICATION FAILED: ${spot.name}`, error);
    }
  };

  // 🎯 TEST NOTIFICATION FUNCTION (add this with your other functions)
  const sendTestNotification = async () => {
    try {
      console.log("🧪 TEST NOTIFICATION TRIGGERED");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧪 Test Notification",
          body: "This is a test notification from the app!",
          sound: true,
          data: { type: "test", timestamp: Date.now() },
        },
        trigger: null,
      });

      console.log("✅ TEST NOTIFICATION SENT SUCCESSFULLY");
      return true;
    } catch (error) {
      console.log("❌ TEST NOTIFICATION FAILED:", error);
      return false;
    }
  };

  // 🎯 MANUAL NOTIFICATION FUNCTION (call this anywhere)
  const sendCustomNotification = async (title, body) => {
    try {
      console.log(`📢 MANUAL NOTIFICATION: ${title}`);

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });

      console.log(`✅ MANUAL NOTIFICATION SENT: ${title}`);
      return true;
    } catch (error) {
      console.log(`❌ MANUAL NOTIFICATION FAILED: ${title}`, error);
      return false;
    }
  };

  // 🎯 MANUAL SPOT CHECK (call this anywhere)
  const manualSpotCheck = () => {
    console.log("🔄 MANUAL SPOT CHECK TRIGGERED");
    checkForSpotsInRadius();
  };

  // ==================== CONTEXT VALUE ====================
  const value = {
    // Radius management
    radius,
    setRadius,

    // Notification functions
    sendCustomNotification,
    manualSpotCheck,
    sendTestNotification,

    // Data
    spots,
    userLocation,
    setUserLocation,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
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
