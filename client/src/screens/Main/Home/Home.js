import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";
import { CebuSpotsService } from "../../../services/cebuSpotService";
import MapSection from "./MapSection";
import { colors } from "../../../utils/colors";
import cebu from "../../../../assets/homepage_photos/cebu.png";
import MainHeader from "../../../components/Header/MainHeader";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Original categories
const categories = [
  { name: "All" },
  { name: "Cultural" },
  { name: "Historical" },
  { name: "Adventure" },
  { name: "Beach" },
];

// Hero Banner Component with Image
const HeroBanner = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="mx-4 mt-4 mb-4 rounded-3xl overflow-hidden"
    >
      <ImageBackground
        source={cebu}
        className="bg-gradient-to-b from-blue-400 to-blue-600 h-48 relative"
      >
        {/* Overlay gradient for text readability */}
        <View className="absolute inset-0 bg-black/20" />
        {/* Content */}
        <View className="flex-1 justify-end p-5">
          <Text className="text-white text-3xl font-bold mb-1">
            Cebu, Philippines
          </Text>
          <View className="flex-row items-center">
            <Feather name="map-pin" size={14} color="white" />
            <Text className="text-white/90 text-sm ml-1">
              Explore beautiful destinations
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

// Category Tabs Component (Original with consistent sizing)
const CategoryTabs = ({ selectedCategory, onCategorySelect }) => {
  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className={`items-center justify-center rounded-xl ${
              selectedCategory === category.name
                ? "bg-red-600"
                : "bg-white border border-gray-200"
            } active:scale-95`}
            style={{
              width: 100,
              height: 40,
            }}
            onPress={() => onCategorySelect(category.name)}
          >
            <Text
              className={`text-md font-semibold text-center ${
                selectedCategory === category.name
                  ? "text-white"
                  : "text-gray-700"
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

// Section Header Component
const SectionHeader = ({ title, actionText, onActionPress }) => {
  return (
    <View className="flex-row items-center justify-between px-4 mb-3">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      {actionText && (
        <TouchableOpacity
          onPress={onActionPress}
          className="flex-row items-center"
        >
          <Text
            className="text-sm font-semibold mr-1"
            style={{ color: colors.primary }}
          >
            {actionText}
          </Text>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <View className="items-center justify-center py-12 px-4">
      <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
        <Feather name="map-pin" size={32} color={colors.primary} />
      </View>
      <Text className="text-lg font-bold text-gray-800 mb-2">
        No Attractions Available
      </Text>
      <Text className="text-sm text-gray-500 text-center">
        There are no attractions in this category yet. Try selecting a different
        category.
      </Text>
    </View>
  );
};

// Attraction List Cards
const AttractionList = ({ spots, onSpotPress }) => {
  if (spots.length === 0) {
    return (
      <View className="mb-6">
        <SectionHeader title="Popular Attractions" />
        <EmptyState />
      </View>
    );
  }

  return (
    <View className="mb-6">
      <SectionHeader
        title="Popular Attractions"
        actionText="See all"
        onActionPress={() => console.log("See all attractions")}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {spots.map((spot, index) => (
          <TouchableOpacity
            key={spot.id}
            className="bg-white rounded-2xl overflow-hidden w-72 shadow-md active:scale-95"
            onPress={() => onSpotPress(spot)}
          >
            {/* Image section with gradient */}
            <View
              className="h-40 justify-end p-4"
              style={{
                backgroundColor:
                  index % 3 === 0
                    ? "#5C6BC0"
                    : index % 3 === 1
                      ? "#26A69A"
                      : "#FF7043",
              }}
            >
              <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </View>

            {/* Content section */}
            <View className="p-4">
              <Text className="text-base font-bold text-gray-900 mb-1">
                {spot.name}
              </Text>
              <View className="flex-row items-center mb-2">
                <Feather name="map-pin" size={12} color={colors.muted} />
                <Text className="text-xs text-gray-500 ml-1">
                  {spot.location}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                {spot.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text className="text-sm font-bold text-gray-800 ml-1">
                    {spot.rating}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-1">
                    ({spot.reviews})
                  </Text>
                </View>
                <View className="bg-red-600 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    {spot.distance}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Live Status Component (Replaces Quick Actions)
const LiveStatus = () => {
  const navigation = useNavigation();

  const statusItems = [
    {
      id: "weather", // Add unique id
      icon: "sun",
      title: "Weather",
      subtitle: "32°C • Sunny",
      status: "perfect",
      color: "#F59E0B",
      detail: "Ideal for beaches",
    },
    {
      id: "traffic", // Add unique id
      icon: "trending-up",
      title: "Traffic",
      subtitle: "Light • 15min",
      status: "good",
      color: "#059669",
      detail: "Clear to city center",
    },
    {
      id: "crowds", // Add unique id
      icon: "users",
      title: "Crowds",
      subtitle: "Moderate",
      status: "moderate",
      color: "#D97706",
      detail: "Peak: 11AM-2PM",
    },
    {
      id: "best-time", // Add unique id
      icon: "clock",
      title: "Best Time",
      subtitle: "3-5PM",
      status: "recommended",
      color: "#7C3AED",
      detail: "Golden hour photos",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      perfect: "#10B981",
      good: "#059669",
      moderate: "#F59E0B",
      recommended: "#8B5CF6",
    };
    return colors[status] || "#6B7280";
  };

  return (
    <View className="px-4 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Feather name="activity" size={20} color={colors.primary} />
          <Text className="text-xl font-bold text-gray-800 ml-2">
            Live Status
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          <Text className="text-green-600 text-xs font-semibold">LIVE</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {statusItems.map((item) => (
          <TouchableOpacity
            key={item.id} // Use the unique id here
            className="items-center active:scale-95"
          >
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: `${item.color}15`,
                borderColor: `${item.color}30`,
              }}
            >
              <Feather name={item.icon} size={24} color={item.color} />
            </View>
            <Text className="font-semibold text-gray-800 text-sm text-center mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-xs text-center">
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Status Bar */}
      <View className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 mt-3 border border-green-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="check-circle" size={16} color="#059669" />
            <Text className="text-green-700 text-sm font-semibold ml-2">
              Perfect day for exploration!
            </Text>
          </View>
          <Text className="text-green-600 text-xs">Updated just now</Text>
        </View>
      </View>
    </View>
  );
};
// Main Home Component
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);

  useEffect(() => {
    loadSpots();
  }, []);

  useEffect(() => {
    filterSpots();
  }, [selectedCategory, spots]);

  const loadSpots = async () => {
    try {
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      setSpots(spotsData);
    } catch (error) {
      console.error("Error loading spots:", error);
      setSpots(CebuSpotsService.getAllCebuSpots());
    }
  };

  const filterSpots = () => {
    if (selectedCategory === "All") {
      setFilteredSpots(spots);
    } else {
      setFilteredSpots(
        spots.filter(
          (spot) =>
            spot.category?.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  };

  const handleSpotPress = (spot) => {
    console.log("Spot pressed:", spot.name);
    // navigation.navigate('LocationDetail', { spot });
  };

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <MainHeader />
        <HeroBanner />
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <AttractionList spots={filteredSpots} onSpotPress={handleSpotPress} />
        <LiveStatus />
        <MapSection spots={filteredSpots} onSpotPress={handleSpotPress} />
      </ScrollView>
    </ScreenWrapper>
  );
}
