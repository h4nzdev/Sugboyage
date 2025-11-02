import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailedInfo({ spot }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const instets = useSafeAreaInsets();

  // Enhanced Cebu-specific data
  const locationData = spot || {
    name: "Temple of Leah",
    type: "Historical Landmark",
    address: "Cebu Transcentral Highway, Cebu City, Philippines",
    rating: 4.8,
    reviews: 394,
    price: "FREE", // Many Cebu attractions are free!
    description:
      "Known as the 'Taj Mahal of Cebu', this magnificent temple was built as a symbol of undying love. Featuring grand Roman architecture, 24 chambers, and stunning city views from the hills.",
    bestTime: "3:00 PM - 6:00 PM",
    visitDuration: "1-2 hours",

    facilities: [
      { icon: "camera", name: "Photo Spot" },
      { icon: "car", name: "Parking" },
      { icon: "coffee", name: "Souvenirs" },
      { icon: "eye", name: "View Deck" },
      { icon: "clock", name: "Guided Tour" },
    ],

    highlights: [
      "Roman-inspired architecture",
      "Panoramic city views",
      "Love story monument",
      "Perfect for sunset",
      "Cultural significance",
    ],

    tips: [
      "Bring camera for great photos",
      "Visit during sunset for best views",
      "Wear comfortable shoes for walking",
      "Small entrance fee for maintenance",
    ],

    image:
      "https://images.unsplash.com/photo-1588666309990-70df6fe85e74?w=800&h=400&fit=crop",
  };

  const handleBookNow = () => {
    // For Cebu attractions, this could be "Plan Visit" or "Get Directions"
    console.log("Planning visit to:", locationData.name);
  };

  const handleGetDirections = () => {
    navigation.navigate("map", {
      destination: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        name: locationData.name,
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{ uri: locationData.image }}
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
            <Text className="text-emerald-600 font-bold text-sm">
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
                {locationData.rating}
              </Text>
              <Text className="text-gray-400 text-sm ml-2">
                · {locationData.reviews} reviews
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
                <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center mb-2 border border-emerald-100">
                  <Feather name={facility.icon} size={20} color="#059669" />
                </View>
                <Text className="text-gray-700 text-xs text-center font-medium">
                  {facility.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Highlights */}
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

        {/* Travel Tips */}
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
                <Text className="text-gray-700 text-sm ml-2 flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="px-5 py-5">
          <Text className="text-gray-900 font-bold text-lg mb-3">
            About This Place
          </Text>
          <Text className="text-gray-600 text-sm leading-6 mb-4">
            {locationData.description}
          </Text>

          {/* AI Assistant CTA */}
          <TouchableOpacity className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-emerald-500 rounded-lg items-center justify-center mr-3">
                <Feather name="cpu" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-emerald-900 font-bold text-sm">
                  Need more info?
                </Text>
                <Text className="text-emerald-700 text-xs">
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
        style={{ paddingBottom: instets.bottom }}
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
            className="border border-emerald-500 px-4 py-3 rounded-xl flex-row items-center"
          >
            <Feather name="navigation" size={16} color="#059669" />
            <Text className="text-emerald-600 font-semibold text-sm ml-2">
              Directions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookNow}
            className="bg-emerald-500 px-6 py-3 rounded-xl min-w-20"
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
