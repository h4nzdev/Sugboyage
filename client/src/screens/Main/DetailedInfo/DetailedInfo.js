import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CebuSpotsService } from "../../../services/cebuSpotService";
import SvgUri from "react-native-svg";

export default function DetailedInfo() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spotData, setSpotData] = useState(null);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // Get spotId from navigation params
  const { spotId } = route.params;

  // Helper function to get appropriate icons for facilities
  const getFacilityIcon = (activity, index) => {
    const activityLower = activity.toLowerCase();
    const iconMap = {
      hiking: "trending-up",
      walking: "navigation",
      photography: "camera",
      sightseeing: "eye",
      dining: "coffee",
      shopping: "shopping-bag",
      parking: "truck",
      swimming: "droplet",
      camping: "home",
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (activityLower.includes(key)) {
        return icon;
      }
    }

    // Default icons
    const defaultIcons = [
      "camera",
      "eye",
      "map",
      "navigation",
      "flag",
      "compass",
    ];
    return defaultIcons[index % defaultIcons.length];
  };

  // Helper function to generate highlights
  const generateHighlights = (data) => {
    const highlights = [];

    if (data.type === "viewpoint") {
      highlights.push(
        "Panoramic city views",
        "Perfect for sunset photos",
        "Great for photography"
      );
    }

    if (data.rating >= 4.5) {
      highlights.push("Highly rated by visitors");
    }

    if (data.featured) {
      highlights.push("Featured destination");
    }

    // Add some default highlights
    highlights.push("Beautiful scenery", "Memorable experience");

    return highlights.slice(0, 5);
  };

  // Transform API data to match our UI structure
  const transformSpotData = (data) => {
    if (!data) return null;

    return {
      // Basic info
      _id: data._id,
      name: data.name || "Unknown Place",
      type: data.type || data.category || "Attraction",
      location: data.location || "Cebu, Philippines",
      address: data.location || "Cebu, Philippines",
      rating: parseFloat(data.rating) || 0,
      reviews: data.reviews || 0,
      price: data.price || "FREE",
      description: data.description || "No description available.",

      // Coordinates for directions
      latitude: data.latitude,
      longitude: data.longitude,

      // Additional info
      bestTime: "3:00 PM - 6:00 PM", // Default value
      visitDuration: data.days || "1-2 hours",

      // Facilities - using actual activities if available
      facilities: data.activities
        ? data.activities.slice(0, 6).map((activity, index) => ({
            icon: getFacilityIcon(activity, index),
            name: activity,
          }))
        : [
            { icon: "camera", name: "Photo Spot" },
            { icon: "truck", name: "Parking" },
            { icon: "coffee", name: "Souvenirs" },
          ],

      // Highlights based on description and type
      highlights: generateHighlights(data),

      // Travel tips
      tips: [
        "Bring camera for great photos",
        "Visit during sunset for best views",
        "Wear comfortable shoes for walking",
      ],

      image:
        data.image_url ||
        "https://images.unsplash.com/photo-1588666309990-70df6fe85e74?w=800&h=400&fit=crop",
    };
  };

  useEffect(() => {
    if (spotId) {
      loadSpotData();
    } else {
      setError("No spot ID provided");
      setLoading(false);
    }
  }, [spotId]);

  const loadSpotData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading spot data for ID:", spotId);
      const spot = await CebuSpotsService.getSpotByIdFromAPI(spotId);

      if (spot) {
        console.log("Spot data loaded:", spot.name);
        setSpotData(spot);
      } else {
        setError("Spot not found");
      }
    } catch (err) {
      console.error("Error loading spot data:", err);
      setError("Failed to load spot information");
    } finally {
      setLoading(false);
    }
  };

  const locationData = spotData
    ? transformSpotData(spotData)
    : {
        // Fallback data
        name: "Loading...",
        type: "Attraction",
        address: "Cebu, Philippines",
        rating: 0,
        reviews: 0,
        price: "FREE",
        description: "Loading description...",
        bestTime: "Anytime",
        visitDuration: "1-2 hours",
        facilities: [
          { icon: "camera", name: "Photo Spot" },
          { icon: "truck", name: "Parking" },
          { icon: "coffee", name: "Souvenirs" },
        ],
        highlights: [
          "Beautiful scenery",
          "Great for photos",
          "Cultural experience",
        ],
        tips: [
          "Bring camera",
          "Visit during good weather",
          "Wear comfortable shoes",
        ],
        image_url:
          "https://images.unsplash.com/photo-1588666309990-70df6fe85e74?w=800&h=400&fit=crop",
      };

  const handleBookNow = () => {
    console.log("Planning visit to:", locationData.name);
  };

  const handleGetDirections = () => {
    if (spotData?.latitude && spotData?.longitude) {
      navigation.navigate("map", {
        destination: {
          latitude: spotData.latitude,
          longitude: spotData.longitude,
          name: spotData.name,
        },
      });
    } else {
      console.log("No coordinates available for directions");
    }
  };

  // Loading State
  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#DC143C" />
        <Text className="text-gray-600 mt-4">Loading spot information...</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-8">
        <Feather name="alert-circle" size={48} color="#DC143C" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
          Unable to Load
        </Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">{error}</Text>
        <TouchableOpacity
          onPress={loadSpotData}
          className="bg-red-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{
              uri: spotData.image_url,
            }}
            className="w-full h-64"
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-5 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className="absolute top-12 right-5 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
          >
            <Feather
              name="heart"
              size={20}
              color={isFavorite ? "#EF4444" : "#FFFFFF"}
              fill={isFavorite ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>

          {/* Price/Type Badge */}
          <View className="absolute bottom-4 left-5 bg-white/90 px-3 py-2 rounded-xl">
            <Text className="text-red-600 font-bold text-sm">
              {locationData.price}
            </Text>
            <Text className="text-gray-600 text-xs">{locationData.type}</Text>
          </View>
        </View>

        {/* Header Info Section */}
        <View className="px-5 pt-5 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-gray-900 font-black text-2xl flex-1 mr-3">
              {locationData.name}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1 flex-1">
              {locationData.address}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Feather
                    key={star}
                    name="star"
                    size={14}
                    color="#F59E0B"
                    fill={
                      star <= Math.floor(locationData.rating)
                        ? "#F59E0B"
                        : "transparent"
                    }
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text className="text-gray-900 font-bold text-sm">
                {locationData.rating || "N/A"}
              </Text>
              <Text className="text-gray-400 text-sm ml-2">
                · {locationData.reviews || 0} reviews
              </Text>
            </View>

            <View className="flex-row items-center bg-emerald-50 px-3 py-1 rounded-full">
              <Feather name="clock" size={12} color="#059669" />
              <Text className="text-emerald-700 text-xs font-medium ml-1">
                {locationData.visitDuration}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Info Cards */}
        <View className="px-5 py-4 border-b border-gray-100">
          <View className="flex-row justify-between">
            <View className="flex-1 bg-blue-50 rounded-xl p-3 mr-2">
              <View className="flex-row items-center mb-1">
                <Feather name="sun" size={16} color="#3B82F6" />
                <Text className="text-blue-700 font-semibold text-sm ml-2">
                  Best Time
                </Text>
              </View>
              <Text className="text-gray-900 text-sm font-medium">
                {locationData.bestTime}
              </Text>
            </View>

            <View className="flex-1 bg-orange-50 rounded-xl p-3 ml-2">
              <View className="flex-row items-center mb-1">
                <Feather name="dollar-sign" size={16} color="#F59E0B" />
                <Text className="text-orange-700 font-semibold text-sm ml-2">
                  Entrance Fee
                </Text>
              </View>
              <Text className="text-gray-900 text-sm font-medium">
                {locationData.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Facilities */}
        {locationData.facilities && locationData.facilities.length > 0 && (
          <View className="px-5 py-5 border-b border-gray-100">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              Facilities & Services
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {locationData.facilities.map((facility, index) => (
                <View
                  key={index}
                  className="items-center mb-4"
                  style={{ width: "30%" }}
                >
                  <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mb-2 border border-red-100">
                    <Feather name={facility.icon} size={20} color="#FF0000" />
                  </View>
                  <Text className="text-gray-700 text-xs text-center font-medium">
                    {facility.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Highlights */}
        {locationData.highlights && locationData.highlights.length > 0 && (
          <View className="px-5 py-5 border-b border-gray-100">
            <Text className="text-gray-900 font-bold text-lg mb-3">
              Why Visit?
            </Text>
            <View className="space-y-2">
              {locationData.highlights.map((highlight, index) => (
                <View key={index} className="flex-row items-start">
                  <Feather
                    name="check-circle"
                    size={16}
                    color="#10B981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-700 text-sm ml-2 flex-1">
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Travel Tips */}
        {locationData.tips && locationData.tips.length > 0 && (
          <View className="px-5 py-5 border-b border-gray-100">
            <Text className="text-gray-900 font-bold text-lg mb-3">
              Travel Tips
            </Text>
            <View className="space-y-2">
              {locationData.tips.map((tip, index) => (
                <View key={index} className="flex-row items-start">
                  <Feather
                    name="info"
                    size={16}
                    color="#F59E0B"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-700 text-sm ml-2 flex-1">
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View className="px-5 py-5">
          <Text className="text-gray-900 font-bold text-lg mb-3">
            About This Place
          </Text>
          <Text className="text-gray-600 text-sm leading-6 mb-4">
            {locationData.description}
          </Text>

          {/* AI Assistant CTA */}
          <TouchableOpacity className="bg-red-50 rounded-xl p-4 border border-red-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-red-500 rounded-lg items-center justify-center mr-3">
                <Feather name="cpu" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-red-900 font-bold text-sm">
                  Need more info?
                </Text>
                <Text className="text-red-700 text-xs">
                  Ask AI assistant about this location
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#059669" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action Bar - Enhanced for Travel */}
      <View
        style={{ paddingBottom: insets.bottom + 10 }}
        className="px-5 py-4 border-t border-gray-200 bg-white flex-row items-center justify-between"
      >
        <View className="flex-shrink">
          <Text className="text-gray-900 font-black text-2xl">
            {locationData.price}
          </Text>
          <Text className="text-gray-600 text-sm">Entrance</Text>
        </View>

        <View className="flex-row flex-1 justify-end" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={handleGetDirections}
            className="border border-red-500 px-4 py-3 rounded-xl flex-row items-center"
          >
            <Feather name="navigation" size={16} color="#059669" />
            <Text className="text-red-600 font-semibold text-sm ml-2">
              Directions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookNow}
            className="bg-red-500 px-6 py-3 rounded-xl min-w-20"
          >
            <Text className="text-white font-bold text-base text-center">
              Plan Visit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
