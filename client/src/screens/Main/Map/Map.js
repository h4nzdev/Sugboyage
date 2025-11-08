import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { CebuSpotsService } from "../../../services/cebuSpotService";

const { width, height } = Dimensions.get("window");

// Colors matching your Home screen
const colors = {
  primary: "#DC143C",
  secondary: "#FFF8DC",
  background: "#FFFFFF",
  text: "#2D3748",
  muted: "#718096",
  light: "#F7FAFC",
};

export default function Map() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [spots, setSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(1000); // Default 1km radius
  const [locationLoading, setLocationLoading] = useState(true);
  const mapRef = useRef();
  const navigation = useNavigation();

  // Get user's real location
  useEffect(() => {
    getUserLocation();
    loadSpots();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.log("Using static location:", error);
      // Fallback to static Cebu location
      setUserLocation({
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const loadSpots = async () => {
    try {
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      setSpots(spotsData);
    } catch (error) {
      console.error("Error loading spots:", error);
      setSpots(CebuSpotsService.getAllCebuSpots());
    }
  };

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
  ];

  const filteredSpots =
    selectedCategory === "All"
      ? spots
      : spots.filter(
          (spot) =>
            spot.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Calculate distance between user and spots
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

  const getSpotsWithinRadius = () => {
    if (!userLocation) return filteredSpots;

    return filteredSpots.filter((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= radius;
    });
  };

  const spotsWithinRadius = getSpotsWithinRadius();

  const focusOnSpot = (spot) => {
    setSelectedSpot(spot);
    mapRef.current.animateToRegion(
      {
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
  };

  const focusOnUser = () => {
    setSelectedSpot(null);
    if (userLocation) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleSpotPress = (spot) => {
    focusOnSpot(spot);
  };

  // User Location Radius Component with Pulsing Effect
  const UserLocationRadius = () => {
    if (!userLocation) return null;

    return (
      <>
        {/* Static Radius Circle */}
        <Circle
          center={userLocation}
          radius={radius}
          strokeWidth={2}
          strokeColor={colors.primary}
          fillColor="rgba(220, 20, 60, 0.1)"
        />

        {/* Pulsing Effect Circle */}
        <Circle
          center={userLocation}
          radius={radius * 0.3}
          strokeWidth={1}
          strokeColor={colors.primary}
          fillColor="rgba(220, 20, 60, 0.2)"
        />
      </>
    );
  };

  // Radius Settings Component
  const RadiusSettings = () => (
    <View className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur-lg rounded-2xl p-3 border border-gray-200 shadow-lg">
      <View className="flex-row items-center mb-2">
        <Feather name="navigation" size={16} color={colors.primary} />
        <Text className="text-gray-800 font-bold ml-2 text-sm">Radius</Text>
      </View>
      <View className="flex-row gap-1">
        {radiusOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setRadius(option.value)}
            className={`px-3 py-2 rounded-xl ${
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
    </View>
  );

  // Category Filter Component
  const CategoryFilter = () => (
    <View className="absolute top-4 left-4 right-20 z-10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => setSelectedCategory(category.name)}
            className={`px-4 py-3 rounded-2xl flex-row items-center ${
              selectedCategory === category.name
                ? "bg-red-600"
                : "bg-white/95 backdrop-blur-lg"
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

  // Map Controls Component
  const MapControls = () => (
    <View className="absolute top-20 right-4 gap-2 z-10">
      <TouchableOpacity
        onPress={focusOnUser}
        className="bg-white p-3 rounded-xl shadow-lg border border-gray-200"
      >
        <Feather name="navigation" size={20} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <Feather name="maximize" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  // Selected Spot Detail Component
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
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
                  <Feather name="map-pin" size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg mb-1">
                    {selectedSpot.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {selectedSpot.location}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm leading-5 mb-3">
                {selectedSpot.description}
              </Text>

              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text className="text-gray-800 font-bold ml-1">
                    {selectedSpot.rating}
                  </Text>
                  <Text className="text-gray-500 text-sm ml-1">
                    ({selectedSpot.reviews})
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
                  </Text>
                </View>
              </View>

              {isWithinRadius && (
                <View className="flex-row items-center bg-green-50 px-3 py-2 rounded-lg mb-2">
                  <Feather name="check-circle" size={14} color="#059669" />
                  <Text className="text-green-700 text-sm font-semibold ml-2">
                    Within your {radius / 1000}km radius
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setSelectedSpot(null)}
              className="p-1"
            >
              <Feather name="x" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* AI Activity Suggestion */}
          <View className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <View className="flex-row items-center mb-1">
              <Feather name="zap" size={14} color={colors.primary} />
              <Text className="text-red-600 text-sm font-semibold ml-2">
                AI Suggestion
              </Text>
            </View>
            <Text className="text-gray-700 text-sm">
              Try: {selectedSpot.activities?.[0] || "Explore and take photos"}
            </Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-red-600 py-3 rounded-xl">
              <Text className="text-white text-center font-bold text-sm">
                START NAVIGATION
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl">
              <Text className="text-gray-700 text-center font-bold text-sm">
                VIEW DETAILS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (locationLoading || !userLocation) {
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
              Real-time location with radius detection
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
          {/* User Location with Radius */}
          <UserLocationRadius />

          {/* Map pins for famous spots */}
          {filteredSpots.map((spot) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              spot.latitude,
              spot.longitude
            );
            const isWithinRadius = distance <= radius;

            return (
              <Marker
                key={spot.id}
                coordinate={{
                  latitude: spot.latitude,
                  longitude: spot.longitude,
                }}
                title={spot.name}
                onPress={() => handleSpotPress(spot)}
              >
                <View
                  className={`w-8 h-8 rounded-full border-2 border-white items-center justify-center shadow-lg ${
                    isWithinRadius ? "bg-green-500" : "bg-red-600"
                  }`}
                >
                  <Feather name="map-pin" size={14} color={colors.secondary} />
                </View>
              </Marker>
            );
          })}
        </MapView>

        <CategoryFilter />
        <RadiusSettings />
        <MapControls />
        <SelectedSpotDetail />
      </View>

      {/* Bottom Info Bar */}
      <View className="px-5 py-3 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-600 rounded-full mr-2"></View>
            <Text className="text-gray-700 text-sm font-medium">
              {spotsWithinRadius.length} spots within {radius / 1000}km
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1"></View>
            <Text className="text-gray-600 text-xs">Within radius</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="navigation" size={14} color={colors.primary} />
            <Text className="text-red-600 text-xs font-bold ml-1">
              LIVE LOCATION
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
