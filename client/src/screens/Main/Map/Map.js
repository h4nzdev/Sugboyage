import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Directions } from "openrouteservice-js";
import { useNotification } from "../../../context/NotificationContext";
import Gamepad from "./Gamepad";

// ==================== CONSTANTS ====================
const OPENROUTE_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ1N2I3YTYyYzZiMTRjZTc5MjI5OTdhNWI3NTIzY2I1IiwiaCI6Im11cm11cjY0In0=";
const orsDirections = new Directions({ api_key: OPENROUTE_API_KEY });

const CATEGORIES = [
  { icon: "map-pin", name: "All" },
  { icon: "book", name: "Cultural" },
  { icon: "home", name: "Historical" },
  { icon: "compass", name: "Adventure" },
  { icon: "sun", name: "Beach" },
];

const RADIUS_OPTIONS = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 5000, label: "5km" },
  { value: 10000, label: "10km" },
];

const TRAVEL_MODES = [
  {
    value: "foot-walking",
    label: "Walking",
    color: "#10B981",
    description: "Best for short distances",
  },
  {
    value: "driving-car",
    label: "Driving",
    color: "#3B82F6",
    description: "Fastest route by car",
  },
  {
    value: "cycling-regular",
    label: "Cycling",
    color: "#8B5CF6",
    description: "Bike-friendly routes",
  },
  {
    value: "wheelchair",
    label: "WheelChair",
    color: "#8B5CF6",
    description: "Routes safe for wheelchair users",
  },
];

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

const formatDistance = (distance) => {
  return distance <= 1000
    ? `${Math.round(distance)}m`
    : `${(distance / 1000).toFixed(1)}km`;
};

// ==================== SIMPLIFIED COMPONENTS ====================

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <View className="absolute top-4 left-4 right-4 z-10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {CATEGORIES.map((category, index) => (
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
              color={selectedCategory === category.name ? "#FFF8DC" : "#DC143C"}
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
};

const TravelModeSelector = ({ travelMode, setTravelMode }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-bold text-sm mb-2">Travel Mode</Text>
      <View className="flex-row gap-2">
        {TRAVEL_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            onPress={() => setTravelMode(mode.value)}
            className={`flex-1 items-center py-3 rounded-xl border ${
              travelMode === mode.value
                ? "border-gray-800 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold mt-1 ${
                travelMode === mode.value ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-gray-500 text-xs mt-2 text-center">
        {TRAVEL_MODES.find((mode) => mode.value === travelMode)?.description}
      </Text>
    </View>
  );
};

const RadiusSelector = ({ radius, setRadius, spotsCount }) => {
  const [showRadius, setShowRadius] = useState(false);

  return (
    <View className="absolute top-20 right-4 z-10">
      <TouchableOpacity
        onPress={() => setShowRadius(!showRadius)}
        className="bg-white p-3 rounded-xl shadow-lg"
      >
        <Feather name="target" size={20} color="#DC143C" />
      </TouchableOpacity>

      {showRadius && (
        <View className="absolute top-12 right-0 bg-white rounded-xl p-3 shadow-lg min-w-[120px]">
          <Text className="text-gray-700 font-bold mb-2 text-center">
            Radius
          </Text>
          {RADIUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setRadius(option.value);
                setShowRadius(false);
              }}
              className={`px-3 py-2 rounded-lg mb-1 ${
                radius === option.value ? "bg-red-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  radius === option.value ? "text-white" : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <Text className="text-gray-500 text-xs mt-2 text-center">
            {spotsCount} spots found
          </Text>
        </View>
      )}
    </View>
  );
};

const SpotCard = ({
  spot,
  userLocation,
  radius,
  onNavigate,
  onClose,
  travelMode,
  setTravelMode,
}) => {
  if (!spot || !userLocation) return null;

  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    spot.latitude,
    spot.longitude
  );

  const isWithinRadius = distance <= radius;

  return (
    <View className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-2xl p-4 shadow-lg">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{spot.name}</Text>
          <Text className="text-gray-500 text-sm mb-2">{spot.location}</Text>
          <Text className="text-gray-600 text-sm mb-3">{spot.description}</Text>

          {/* Travel Mode Selector */}
          <TravelModeSelector
            travelMode={travelMode}
            setTravelMode={setTravelMode}
          />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Feather name="star" size={14} color="#F59E0B" />
              <Text className="text-gray-800 font-medium ml-1">
                {spot.rating}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${isWithinRadius ? "bg-green-100" : "bg-red-100"}`}
            >
              <Text
                className={`text-sm font-medium ${isWithinRadius ? "text-green-700" : "text-red-700"}`}
              >
                {formatDistance(distance)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} className="p-1">
          <Feather name="x" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onNavigate(spot)}
        className={`py-3 rounded-xl ${isWithinRadius ? "bg-green-600" : "bg-red-600"}`}
      >
        <Text className="text-white text-center font-medium">
          START NAVIGATION
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================== MAIN COMPONENT ====================
export default function Map() {
  // State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [travelMode, setTravelMode] = useState("foot-walking");
  const [showGamepad, setShowGamepad] = useState(false);
  const [markerUpdateKey, setMarkerUpdateKey] = useState(0); // 🎯 THE MAGIC FIX

  // Refs & Hooks
  const mapRef = useRef();
  const navigation = useNavigation();
  const { radius, setRadius, spots, loadSpots, sendTestNotification } =
    useNotification();

  // Filter spots based on category and radius
  const filteredSpots =
    selectedCategory === "All"
      ? spots
      : spots.filter(
          (spot) =>
            spot.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const spotsWithinRadius = filteredSpots.filter((spot) => {
    if (!userLocation) return false;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );
    return distance <= radius;
  });

  // Effects
  useEffect(() => {
    setupApp();
  }, []);

  useEffect(() => {
    if (spots.length === 0) {
      loadSpots();
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      setMarkerUpdateKey((prev) => prev + 1);
    }
  }, [userLocation, radius]);

  //Gamepad Functions
  const handleUserMove = (direction) => {
    if (!userLocation) return;

    const step = 0.001;
    const newLocation = { ...userLocation };

    switch (direction) {
      case "up":
        newLocation.latitude += step;
        break;
      case "down":
        newLocation.latitude -= step;
        break;
      case "left":
        newLocation.longitude -= step;
        break;
      case "right":
        newLocation.longitude += step;
        break;
      default:
        return;
    }

    setUserLocation(newLocation);

    // Animate map to new location
    if (mapRef.current) {
      mapRef.current.animateToRegion(newLocation, 500);
    }
  };

  // Core Functions
  const setupApp = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await getCurrentLocation();
      }
    } catch (error) {
      console.log("Setup error:", error);
      // Fallback location (Cebu)
      setUserLocation({
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation(newLocation);

      // Start watching location
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 50,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      );
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  const focusOnSpot = (spot) => {
    setSelectedSpot(spot);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.latitude,
          longitude: spot.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const focusOnUser = () => {
    setSelectedSpot(null);
    setIsNavigating(false);
    setRouteInfo(null);

    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 500);
    }
  };

  const startNavigation = async (spot) => {
    if (!userLocation) return;

    setIsNavigating(true);
    setSelectedSpot(null);

    try {
      const route = await orsDirections.calculate({
        coordinates: [
          [userLocation.longitude, userLocation.latitude],
          [spot.longitude, spot.latitude],
        ],
        profile: travelMode,
        format: "geojson",
      });

      if (route.features?.[0]) {
        const routeData = route.features[0];
        const coordinates = routeData.geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        const distance = routeData.properties.segments[0].distance / 1000;
        const duration = routeData.properties.segments[0].duration / 60;

        setRouteInfo({
          distance,
          duration,
          coordinates,
        });

        // Fit map to show route
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.log("Navigation error:", error);
      // Fallback: direct line
      if (userLocation && spot) {
        setRouteInfo({
          coordinates: [
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            { latitude: spot.latitude, longitude: spot.longitude },
          ],
        });
      }
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setRouteInfo(null);
    focusOnUser();
  };

  const getMarkerColor = (spot) => {
    if (!userLocation) return "red";

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    return distance <= radius ? "green" : "red";
  };

  const sendNotification = (spot) => {
    if (!userLocation) return null;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    return distance <= radius ? sendTestNotification() : null;
  };

  useEffect(() => {
    setTimeout(() => {
      sendNotification();
    }, 5000);
  }, []);

  if (!userLocation) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-800 font-medium">
          Getting your location...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold">Cebu Map</Text>

          <View className="p-2">
            <Feather name="map-pin" size={20} color="#333" />
          </View>
        </View>
      </View>

      {/* Map */}
      <View className="flex-1 relative">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={userLocation}
          region={userLocation}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* User radius circle */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={radius}
              strokeWidth={1}
              strokeColor="#DC143C"
              fillColor="rgba(220, 20, 60, 0.1)"
            />
          )}

          {/* Navigation route */}
          {isNavigating && routeInfo?.coordinates && (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeWidth={3}
              strokeColor="#3B82F6"
            />
          )}

          {/* 🎯 SPOTS - THE MAGIC HAPPENS HERE */}
          {filteredSpots.map((spot, index) => (
            <Marker
              key={`spot-${spot.id}-${index}-${markerUpdateKey}`} // 🎯 THIS FORCES RE-RENDER
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => focusOnSpot(spot)}
              pinColor={getMarkerColor(spot)}
            >
              {sendNotification(spot)}
            </Marker>
          ))}
        </MapView>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Controls */}
        <RadiusSelector
          radius={radius}
          setRadius={setRadius}
          spotsCount={spotsWithinRadius.length}
        />

        <View className="absolute top-20 left-4 z-10">
          <TouchableOpacity
            onPress={focusOnUser}
            className="bg-white p-3 rounded-xl shadow-lg mb-2"
          >
            <Feather name="navigation" size={20} color="#DC143C" />
          </TouchableOpacity>

          {isNavigating && (
            <TouchableOpacity
              onPress={stopNavigation}
              className="bg-red-500 p-3 rounded-xl shadow-lg"
            >
              <Feather name="x" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Spot Card */}
        {selectedSpot && (
          <SpotCard
            spot={selectedSpot}
            userLocation={userLocation}
            radius={radius}
            onNavigate={startNavigation}
            onClose={() => setSelectedSpot(null)}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
          />
        )}

        {/* Navigation Status */}
        {isNavigating && (
          <View className="absolute top-32 left-4 right-4 z-10 bg-blue-500 rounded-xl p-3">
            <Text className="text-white font-medium text-center">
              Navigating...{" "}
              {routeInfo?.distance && `${routeInfo.distance.toFixed(1)}km`}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Info */}
      <View className="px-4 py-3 border-t border-gray-200">
        <Text className="text-gray-600 text-sm text-center">
          {spotsWithinRadius.length} {selectedCategory.toLowerCase()} spots
          within {radius / 1000}km
        </Text>
      </View>
    </SafeAreaView>
  );
}
