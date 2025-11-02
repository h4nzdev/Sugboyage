import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeader from "../../../components/Header/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";
import { CebuSpotsService } from "../../../services/cebuSpotService";

const { width: screenWidth } = Dimensions.get("window");

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "beaches", name: "Beaches", icon: "sun" },
    { id: "historical", name: "Historical", icon: "book" },
    { id: "adventure", name: "Adventure", icon: "activity" },
    { id: "cultural", name: "Cultural", icon: "users" },
    { id: "food", name: "Food", icon: "coffee" },
  ];

  // Load destinations based on category
  useEffect(() => {
    loadDestinations();
  }, [activeCategory]);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      let spots;

      if (activeCategory === "all") {
        spots = await CebuSpotsService.searchSpots("");
      } else {
        spots = await CebuSpotsService.searchByCategory(activeCategory);
      }

      setDestinations(spots);

      // Extract featured spots for horizontal scroll
      const featured = spots.filter((spot) => spot.featured).slice(0, 4);
      setFeaturedSpots(featured);
    } catch (error) {
      console.error("Error loading destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDestinations();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      const spots = await CebuSpotsService.searchSpots(searchQuery);
      setDestinations(spots);
      setFeaturedSpots([]); // Clear featured when searching
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enhanced Grid Card Component
  const GridCard = ({ destination }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-4"
      style={{ width: (screenWidth - 40) / 2 - 8 }} // 2 columns with gap
      onPress={() =>
        navigation.navigate("detailed-info", { spot: destination })
      }
    >
      {/* Image/Color Section */}
      <View
        className="h-32 relative"
        style={{ backgroundColor: destination.color }}
      >
        {/* Featured Badge */}
        {destination.featured && (
          <View className="absolute top-2 left-2 bg-amber-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-black">FEATURED</Text>
          </View>
        )}

        {/* Geofence Indicator */}
        {destination.geofence && (
          <View className="absolute top-2 right-2 bg-emerald-500 w-6 h-6 rounded-full items-center justify-center">
            <Feather name="map-pin" size={12} color="#FFFFFF" />
          </View>
        )}

        {/* Price Tag */}
        <View className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">
            {destination.price}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-3">
        <Text
          className="text-gray-900 font-bold text-sm mb-1"
          numberOfLines={2}
        >
          {destination.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Feather name="map-pin" size={10} color="#6B7280" />
          <Text className="text-gray-600 text-xs ml-1 flex-1" numberOfLines={1}>
            {destination.location}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="star" size={12} color="#F59E0B" />
            <Text className="text-gray-700 text-xs font-bold ml-1">
              {destination.rating}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="clock" size={10} color="#6B7280" />
            <Text className="text-gray-600 text-xs ml-1">
              {destination.distance.split(" ")[0]}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Horizontal Featured Card Component
  const HorizontalCard = ({ destination }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ width: screenWidth * 0.75 }}
      onPress={() =>
        navigation.navigate("detailed-info", { spot: destination })
      }
    >
      {/* Image/Color Section */}
      <View
        className="h-40 relative"
        style={{ backgroundColor: destination.color }}
      >
        {/* Featured Badge */}
        {destination.featured && (
          <View className="absolute top-3 left-3 bg-amber-500 px-3 py-1.5 rounded-full">
            <Text className="text-white text-xs font-black">FEATURED</Text>
          </View>
        )}

        {/* Geofence Indicator */}
        {destination.geofence && (
          <View className="absolute top-3 right-3 bg-emerald-500 w-8 h-8 rounded-full items-center justify-center">
            <Feather name="map-pin" size={14} color="#FFFFFF" />
          </View>
        )}

        {/* Price Tag */}
        <View className="absolute bottom-3 right-3 bg-black/80 px-3 py-1.5 rounded-full">
          <Text className="text-white text-sm font-bold">
            {destination.price}
          </Text>
        </View>

        {/* Type Badge */}
        <View className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-gray-900 text-xs font-bold">
            {destination.type}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text
          className="text-gray-900 font-bold text-lg mb-2"
          numberOfLines={2}
        >
          {destination.name}
        </Text>

        <View className="flex-row items-center mb-3">
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
            {destination.location}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Feather name="star" size={14} color="#F59E0B" />
            <Text className="text-gray-700 text-sm font-bold ml-1">
              {destination.rating}
            </Text>
            <Text className="text-gray-500 text-sm ml-1">
              ({destination.reviews})
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="clock" size={12} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {destination.distance}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row" style={{ gap: 8 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("detailed-info", { spot: destination })
            }
            className="bg-emerald-500 flex-1 py-3 rounded-xl"
          >
            <Text className="text-white text-sm font-bold text-center">
              View Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
            <Feather name="heart" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search & Filter Section */}
        <View className="px-5 pt-3 pb-4">
          {/* Search Bar */}
          <View className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center mb-4">
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search destinations, activities..."
              className="flex-1 ml-3 text-gray-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* AI Quick Plan Button */}
          <TouchableOpacity className="bg-emerald-500 rounded-2xl p-4 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mr-3">
                <Feather name="cpu" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">
                  AI Trip Planner
                </Text>
                <Text className="text-emerald-100 text-sm">
                  Get personalized itinerary
                </Text>
              </View>
            </View>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-5 mb-4">
          <Text className="text-lg font-black text-gray-900 mb-3">
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryChange(category.id)}
                className={`px-4 py-3 rounded-2xl flex-row items-center ${
                  activeCategory === category.id
                    ? "bg-emerald-500"
                    : "bg-gray-100"
                }`}
              >
                <Feather
                  name={category.icon}
                  size={16}
                  color={activeCategory === category.id ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-semibold text-sm ${
                    activeCategory === category.id
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

        {/* Results Header */}
        <View className="px-5 mb-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-black text-gray-900">
                {activeCategory === "all"
                  ? "Explore Cebu"
                  : categories.find((c) => c.id === activeCategory)?.name +
                    " Spots"}
              </Text>
              <Text className="text-gray-500 text-sm">
                {loading
                  ? "Loading..."
                  : `${filteredDestinations.length} amazing places found`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("map")}
              className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full"
            >
              <Feather name="map" size={14} color="#374151" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                View Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="py-10">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-center text-gray-500 mt-3">
              Discovering amazing Cebu spots...
            </Text>
          </View>
        )}

        {/* Featured Spots - Horizontal Scroll (Only show if we have featured spots and not searching) */}
        {!loading && featuredSpots.length > 0 && !searchQuery && (
          <View className="mb-6">
            <View className="px-5 mb-3">
              <Text className="text-lg font-black text-gray-900">
                Featured Spots
              </Text>
              <Text className="text-gray-500 text-sm">
                Must-visit destinations in Cebu
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            >
              {featuredSpots.map((destination) => (
                <HorizontalCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Spots - Grid Layout */}
        {!loading && filteredDestinations.length > 0 && (
          <View className="px-5 mb-6">
            <View className="flex-row flex-wrap justify-between">
              {filteredDestinations.map((destination) => (
                <GridCard key={destination.id} destination={destination} />
              ))}
            </View>
          </View>
        )}

        {/* No Results State */}
        {!loading && filteredDestinations.length === 0 && (
          <View className="px-5 py-10 items-center">
            <Feather name="search" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-3 text-center">
              No destinations found
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Try a different search or category
            </Text>
          </View>
        )}

        {/* Rest of your components remain the same */}
        <View className="px-5 mt-2 mb-6">
          <View className="bg-white rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
            <View className="flex-row items-start">
              <View className="bg-blue-100 p-3 rounded-2xl mr-3">
                <Feather name="tag" size={20} color="#1D4ED8" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-lg mb-1">
                  Local Tip 💡
                </Text>
                <Text className="text-gray-600 text-sm">
                  Visit waterfalls in the morning to avoid crowds! Beaches are
                  perfect from 3-5PM for golden hour photos. Local guides
                  available at most spots for authentic experiences.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trending Searches */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-black text-gray-900 mb-3">
            Trending in Cebu
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {[
              "Sunset Spots",
              "Budget Friendly",
              "Family Friendly",
              "Instagram Worthy",
              "Local Food",
              "Hidden Gems",
              "Water Activities",
              "Historical Sites",
            ].map((tag, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-100 px-3 py-2 rounded-full"
              >
                <Text className="text-gray-700 text-sm font-medium">
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
