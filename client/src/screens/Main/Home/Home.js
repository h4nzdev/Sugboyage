import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Image,
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
import { useNotification } from "../../../context/NotificationContext";
import LiveStatus from "./LiveStatus";

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
const AttractionList = ({ spots, onSpotPress, isLoading }) => {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View className="flex-row items-center justify-center py-12 px-4 gap-2">
        <Text className="text-lg font-bold text-gray-800">Loading</Text>
        <View className="animate-spin border-2 border-red-500 rounded-full w-8 h-8">
          <View className="absolute inset-0 top-0 bg-white w-4 h-4 rounded-full" />
        </View>
      </View>
    );
  }

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
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 16,
          paddingVertical: 4,
        }}
      >
        {spots.map((spot, index) => (
          <TouchableOpacity
            key={spot.id || spot._id || `spot-${index}`}
            className="bg-white rounded-2xl overflow-hidden w-72 shadow-lg active:scale-95 border border-gray-100"
            onPress={() =>
              navigation.navigate("detailed-info", { spotId: spot._id })
            }
          >
            {/* Image section */}
            <View className="relative h-40">
              <Image
                source={{
                  uri: spot.image_url,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/10" />
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
                    ({spot.reviews || "No reviews"})
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

// Main Home Component
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const { sendCustomNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSpots();
  }, []);

  useEffect(() => {
    filterSpots();
  }, [selectedCategory, spots]);

  const loadSpots = async () => {
    setIsLoading(true);
    try {
      const spotsData = await CebuSpotsService.getAllCebuSpots();
      setSpots(spotsData);
    } catch (error) {
      console.error("Error loading spots:", error);
      setSpots(CebuSpotsService.getAllCebuSpots());
    } finally {
      setIsLoading(false);
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
        <LiveStatus />
        <HeroBanner />
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <AttractionList
          spots={filteredSpots}
          onSpotPress={handleSpotPress}
          isLoading={isLoading}
        />
        <MapSection spots={filteredSpots} onSpotPress={handleSpotPress} />
      </ScrollView>
    </ScreenWrapper>
  );
}
