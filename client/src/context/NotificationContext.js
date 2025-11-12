import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  // Track spots CURRENTLY in radius (clears when user exits radius)
  const [notifiedSpotsInRadius, setNotifiedSpotsInRadius] = useState(new Set());
  const [userLocation, setUserLocation] = useState(null);
  const [spots, setSpots] = useState([]);
  const [radius, setRadius] = useState(1000);
  // 🎯 State to trigger notification modal display
  const [lastNotification, setLastNotification] = useState(null);

  // ==================== REFS ====================
  const locationWatcherRef = useRef(null);
  const checkTimeoutRef = useRef(null);
  const lastLocationRef = useRef(null);
  const notificationDebounceRef = useRef({});
  const cleanupNotificationsRef = useRef(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    const initSetup = async () => {
      const cleanup = await setupNotifications();
      cleanupNotificationsRef.current = cleanup;
    };
    initSetup();

    return () => {
      console.log("🧹 Main cleanup: Removing listeners");
      // Cleanup
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      // Call notification cleanup
      if (cleanupNotificationsRef.current) {
        cleanupNotificationsRef.current();
      }
    };
  }, [setupNotifications]);

  // 🎯 Optimized location effect with debouncing
  useEffect(() => {
    if (userLocation && spots.length > 0) {
      // Clear previous timeout
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }

      // Only check if location changed significantly
      const hasLocationChanged =
        !lastLocationRef.current ||
        calculateDistance(
          lastLocationRef.current.latitude,
          lastLocationRef.current.longitude,
          userLocation.latitude,
          userLocation.longitude
        ) > 50; // Only check if moved more than 50 meters

      console.log(
        `📊 Location effect triggered: hasLocationChanged=${hasLocationChanged}, lastLocation=${lastLocationRef.current ? "exists" : "none"}`
      );

      if (hasLocationChanged) {
        console.log(`✅ Location changed > 50m, scheduling check...`);
        lastLocationRef.current = userLocation;
        checkTimeoutRef.current = setTimeout(() => {
          console.log(
            `⏰ 10 second timeout fired, calling checkForSpotsInRadius`
          );
          checkForSpotsInRadius();
        }, 10000); // Check every 10 seconds
      } else {
        console.log(`⏭️  Location changed < 50m, skipping check`);
      }
    } else {
      console.log(
        `❌ Location effect condition not met: userLocation=${!!userLocation}, spots.length=${spots.length}`
      );
    }

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [userLocation, radius, spots]);

  // 🎯 RADIUS CHANGE EFFECT: When radius changes, immediately check for NEW spots
  useEffect(() => {
    if (userLocation && spots.length > 0) {
      console.log(
        `📍 RADIUS CHANGED to ${radius}m - Checking for new spots...`
      );
      // Immediately check for spots in the new radius (with debouncing)
      checkForSpotsInRadius();
    }
  }, [radius, userLocation, spots, checkForSpotsInRadius]);

  // ==================== OPTIMIZED CORE FUNCTIONS ====================
  const setupNotifications = useCallback(async () => {
    try {
      console.log("🚀 Starting optimized notification setup...");

      // Request permissions in parallel
      const [notificationStatus, locationStatus] = await Promise.all([
        Notifications.requestPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
      ]);

      console.log("✅ Notification permission:", notificationStatus.status);
      console.log("✅ Location permission:", locationStatus.status);

      // 🎯 CREATE NOTIFICATION CHANNEL (Android requirement)
      console.log("📢 Creating notification channel...");
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
      console.log("✅ Notification channel created");

      // 🎯 SET NOTIFICATION HANDLER - runs when notification arrives while app is open
      console.log("📬 Setting notification handler...");
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          console.log("🎯 Notification handler triggered - showing alert");
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          };
        },
      });

      // 🎯 LISTEN FOR INCOMING NOTIFICATIONS
      console.log("👂 Adding notification received listener...");
      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("📬 ✅✅✅ NOTIFICATION RECEIVED IN LISTENER ✅✅✅");
          console.log(
            "📬 Full notification object:",
            JSON.stringify(notification, null, 2)
          );
          console.log(
            "📬 Notification title:",
            notification?.request?.content?.title
          );
          console.log(
            "📬 Notification body:",
            notification?.request?.content?.body
          );
          // Store notification to trigger modal display
          console.log(
            "📝 Calling setLastNotification with:",
            notification?.request?.content?.title
          );
          setLastNotification(notification);
          console.log("📝 ✅ setLastNotification called successfully");
        });

      console.log("✅ Notification listener registered");

      // 🎯 LISTEN FOR NOTIFICATION RESPONSES (user tapped notification)
      const notificationResponseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("👆 NOTIFICATION RESPONSE:", response);
        });

      if (locationStatus.status === "granted") {
        await Promise.all([loadSpots(), startLocationWatching()]);
      }

      // Cleanup listeners on unmount
      return () => {
        console.log("🧹 Cleaning up notification listeners");
        notificationListener.remove();
        notificationResponseListener.remove();
      };
    } catch (error) {
      console.log("❌ Setup error:", error);
    }
  }, []);

  const loadSpots = useCallback(async () => {
    try {
      console.log("📋 Loading spots data...");
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      setSpots(spotsData);
      console.log(`✅ Loaded ${spotsData.length} spots`);
    } catch (error) {
      console.error("❌ Error loading spots:", error);
    }
  }, []);

  const startLocationWatching = useCallback(async () => {
    try {
      // Get initial location first
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      setUserLocation({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      });

      // Start watching with optimized settings
      locationWatcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Lowest, // Better battery life
          timeInterval: 30000, // 30 seconds
          distanceInterval: 25, // 25 meters
        },
        (newLoc) => {
          const updatedLocation = {
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
          };
          console.log(
            `📍 Location updated: ${updatedLocation.latitude.toFixed(4)}, ${updatedLocation.longitude.toFixed(4)}`
          );
          setUserLocation(updatedLocation);
        }
      );
    } catch (error) {
      console.log("❌ Location error:", error);
    }
  }, []);

  // 🎯 OPTIMIZED: Check for spots in radius with proper tracking
  const checkForSpotsInRadius = useCallback(() => {
    console.log("🔄 checkForSpotsInRadius called");
    if (!userLocation || spots.length === 0) {
      console.log(
        `❌ checkForSpotsInRadius: userLocation=${!!userLocation}, spots.length=${spots.length}`
      );
      return;
    }

    console.log(`🔍 Checking ${spots.length} spots within ${radius}m...`);

    // Find all spots currently in radius
    const spotsCurrentlyInRadius = spots.filter((spot, idx) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      // Log first 3 spots for debugging
      if (idx < 3) {
        console.log(
          `   Spot ${idx}: ${spot.name} - distance: ${Math.round(distance)}m`
        );
      }
      return distance <= radius;
    });

    console.log(
      `📍 Found ${spotsCurrentlyInRadius.length} spots in current radius`
    );
    if (spotsCurrentlyInRadius.length > 0) {
      console.log(
        `   Spots in radius: ${spotsCurrentlyInRadius.map((s) => s.name).join(", ")}`
      );
    }

    const currentSpotIds = new Set(spotsCurrentlyInRadius.map((s) => s.id));

    // Find NEW spots that entered the radius (not previously notified in this session)
    const newSpots = spotsCurrentlyInRadius.filter(
      (spot) => !notifiedSpotsInRadius.has(spot.id)
    );

    console.log(`🆕 Found ${newSpots.length} NEW spots in radius`);
    if (newSpots.length > 0) {
      console.log(
        `🆕 New spot names: ${newSpots.map((s) => s.name).join(", ")}`
      );
    }

    // Find spots that LEFT the radius (for resetting)
    const spottsThatLeft = Array.from(notifiedSpotsInRadius).filter(
      (spotId) => !currentSpotIds.has(spotId)
    );

    // Reset notified spots that left the radius
    if (spottsThatLeft.length > 0) {
      console.log(
        `🚪 Spots left radius: ${spottsThatLeft.join(", ")}. Resetting...`
      );
      const updated = new Set(notifiedSpotsInRadius);
      spottsThatLeft.forEach((id) => updated.delete(id));
      setNotifiedSpotsInRadius(updated);
    }

    // Send notifications for NEW spots
    if (newSpots.length > 0) {
      console.log(
        `📍 Found ${newSpots.length} NEW spots in radius - SENDING NOTIFICATIONS`
      );

      // Stagger notifications to avoid UI crashes
      newSpots.forEach((spot, index) => {
        console.log(
          `📤 Scheduling sendSpotNotification for ${spot.name} at index ${index}`
        );
        setTimeout(() => {
          console.log(
            `⏰ Timeout fired: Calling sendSpotNotification for ${spot.name}`
          );
          sendSpotNotification(spot);
        }, index * 300);
      });

      // Add newly notified spots to the set
      const newSpotIds = newSpots.map((spot) => spot.id);
      setNotifiedSpotsInRadius((prev) => new Set([...prev, ...newSpotIds]));
    } else if (spotsCurrentlyInRadius.length > 0) {
      console.log(
        `✅ ${spotsCurrentlyInRadius.length} spots in radius, all already notified`
      );
    } else {
      console.log("❌ No spots in radius");
    }
  }, [
    userLocation,
    spots,
    radius,
    notifiedSpotsInRadius,
    sendSpotNotification,
  ]);

  // 🎯 OPTIMIZED: Notification function with debouncing
  const sendSpotNotification = useCallback(
    async (spot) => {
      console.log(`🚀 sendSpotNotification called for: ${spot?.name}`);
      if (!userLocation) {
        console.log("❌ sendSpotNotification: No user location");
        return;
      }

      // Debounce: don't send same notification twice within 5 seconds
      const now = Date.now();
      const lastNotifiedTime = notificationDebounceRef.current[spot.id] || 0;
      console.log(
        `⏱️  Debounce check for ${spot.name}: last=${lastNotifiedTime}, now=${now}, diff=${now - lastNotifiedTime}`
      );
      if (now - lastNotifiedTime < 5000) {
        console.log(
          `⏭️  DEBOUNCED: Skipping duplicate notification for ${spot.name}`
        );
        return;
      }

      notificationDebounceRef.current[spot.id] = now;
      console.log(`✅ Debounce passed for ${spot.name}`);

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );

      const roundedDistance = Math.round(distance);
      console.log(`📍 Distance to ${spot.name}: ${roundedDistance}m`);

      try {
        console.log(`📤 Scheduling notification for ${spot.name}...`);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `📍 ${spot.name} Nearby!`,
            body: `You're ${roundedDistance}m away (within ${radius / 1000}km radius)`,
            sound: true,
            data: { spotId: spot.id, distance: roundedDistance },
          },
          trigger: null,
        });

        console.log(`✅ NOTIFICATION SCHEDULED: ${spot.name}`);
      } catch (error) {
        console.log(`❌ NOTIFICATION FAILED: ${spot.name}`, error);
      }
    },
    [userLocation, radius]
  );

  // 🎯 TEST NOTIFICATION FUNCTION
  const sendTestNotification = useCallback(async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧪 Test Notification",
          body: "This is a test notification from the app!",
          sound: true,
          data: { type: "test", timestamp: Date.now() },
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      console.log("❌ TEST NOTIFICATION FAILED:", error);
      return false;
    }
  }, []);

  // 🎯 MANUAL NOTIFICATION FUNCTION
  const sendCustomNotification = useCallback(async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      console.log(`❌ MANUAL NOTIFICATION FAILED:`, error);
      return false;
    }
  }, []);

  // 🎯 MANUAL SPOT CHECK
  const manualSpotCheck = useCallback(() => {
    console.log("🔄 MANUAL SPOT CHECK TRIGGERED");
    checkForSpotsInRadius();
  }, [checkForSpotsInRadius]);

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
    lastNotification,
    setLastNotification,

    // Additional functions
    loadSpots,
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
