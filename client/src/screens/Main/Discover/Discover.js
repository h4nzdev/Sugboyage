import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import MainHeader from "../../../components/Header/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";
import { CebuSpotsService } from "../../../services/cebuSpotService";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

const { width: screenWidth } = Dimensions.get("window");

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const colors = {
    primary: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
    light: "#f0fdff",
    background: "#ffffff",
    border: "#cffafe",
    text: "#164e63",
    muted: "#0e7490",
  };

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "beaches", name: "Beaches", icon: "sun" },
    { id: "historical", name: "Historical", icon: "book" },
    { id: "adventure", name: "Adventure", icon: "activity" },
    { id: "cultural", name: "Cultural", icon: "users" },
    { id: "food", name: "Food", icon: "coffee" },
  ];

  // Sample images for different categories
  const categoryImages = {
    beaches: "https://unsplash.com/s/photos/beach",
    historical:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    adventure:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400",
    cultural:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
    food: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    all: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400",
  };

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
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Minimalist Grid Card Component
  const GridCard = ({ destination }) => (
    <TouchableOpacity
      className="bg-white rounded-xl overflow-hidden mb-4"
      style={{
        width: (screenWidth - 40) / 2 - 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() =>
        navigation.navigate("detailed-info", { spot: destination })
      }
    >
      <ImageBackground
        source={{ uri: destination.image || categoryImages[destination.type] }}
        className="h-32 w-full"
        resizeMode="cover"
      >
        <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {destination.price}
          </Text>
        </View>
      </ImageBackground>

      <View className="p-3">
        <Text
          className="font-semibold text-sm mb-1"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {destination.name}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={10} color={colors.muted} />
            <Text className="text-xs ml-1" style={{ color: colors.muted }}>
              {destination.distance.split(" ")[0]}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="star" size={10} color={colors.primary} />
            <Text
              className="text-xs ml-1 font-semibold"
              style={{ color: colors.text }}
            >
              {destination.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MainHeader />

        {/* Search Bar */}
        <View className="px-5 mt-2 mb-4">
          <View
            className="bg-white rounded-xl px-4 py-3 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Feather name="search" size={18} color={colors.muted} />
            <TextInput
              placeholder="Search destinations, activities..."
              className="flex-1 ml-3 text-sm"
              style={{ color: colors.text }}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor={colors.muted}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={18} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View className="mb-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`rounded-full px-4 py-2 flex-row items-center ${
                  activeCategory === category.id ? "bg-white" : "bg-white/80"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                  borderWidth: activeCategory === category.id ? 1 : 0,
                  borderColor: colors.border,
                }}
              >
                <Feather
                  name={category.icon}
                  size={16}
                  color={
                    activeCategory === category.id
                      ? colors.primary
                      : colors.muted
                  }
                />
                <Text
                  className="ml-2 text-sm font-semibold"
                  style={{
                    color:
                      activeCategory === category.id
                        ? colors.text
                        : colors.muted,
                  }}
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
              <Text
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                {activeCategory === "all"
                  ? "Explore Cebu"
                  : categories.find((c) => c.id === activeCategory)?.name}
              </Text>
              <Text className="text-sm" style={{ color: colors.muted }}>
                {loading
                  ? "Loading..."
                  : `${filteredDestinations.length} places found`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("map")}
              className="flex-row items-center bg-white px-3 py-2 rounded-full"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Feather name="map" size={14} color={colors.primary} />
              <Text
                className="text-sm ml-2 font-semibold"
                style={{ color: colors.text }}
              >
                View Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="py-10">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-center mt-3" style={{ color: colors.muted }}>
              Discovering amazing Cebu spots...
            </Text>
          </View>
        )}

        {/* Destinations Grid */}
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
            <Feather name="search" size={48} color={colors.muted} />
            <Text
              className="text-lg mt-3 text-center"
              style={{ color: colors.muted }}
            >
              No destinations found
            </Text>
            <Text
              className="text-sm mt-1 text-center"
              style={{ color: colors.muted }}
            >
              Try a different search or category
            </Text>
          </View>
        )}

        {/* Local Tips */}
        <View className="px-5 mt-2 mb-6">
          <View
            className="bg-white rounded-xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-start">
              <View
                className="p-2 rounded-xl mr-3"
                style={{ backgroundColor: colors.light }}
              >
                <Feather name="info" size={16} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text
                  className="font-bold text-base mb-1"
                  style={{ color: colors.text }}
                >
                  Local Tip
                </Text>
                <Text className="text-sm" style={{ color: colors.muted }}>
                  Visit waterfalls in the morning to avoid crowds! Beaches are
                  perfect from 3-5PM for golden hour photos.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trending Searches */}
        <View className="px-5 mb-8">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            Trending in Cebu
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {[
              "Sunset Spots",
              "Budget Friendly",
              "Family Friendly",
              "Local Food",
              "Hidden Gems",
            ].map((tag, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white px-3 py-2 rounded-full"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
