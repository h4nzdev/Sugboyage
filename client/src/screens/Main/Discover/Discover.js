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
import cultural_heritage from "../../../../assets/discovery_image/cultural_heritage.png";
import best_of_cebu from "../../../../assets/discovery_image/best_of_cebu.png";
import beach_paradise from "../../../../assets/discovery_image/beach_paradise.png";

const { width: screenWidth } = Dimensions.get("window");

export default function Discover() {
  const [activeTab, setActiveTab] = useState("collections");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  // Changed to Crimson Red
  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "beaches", name: "Beaches", icon: "sun" },
    { id: "historical", name: "Historical", icon: "book" },
    { id: "adventure", name: "Adventure", icon: "activity" },
    { id: "cultural", name: "Cultural", icon: "users" },
    { id: "food", name: "Food", icon: "coffee" },
  ];

  const tabs = [
    { id: "collections", name: "Collections" },
    { id: "destinations", name: "Destinations" },
  ];

  // Sample collections data
  const collections = [
    {
      id: 1,
      title: "Best of Cebu",
      subtitle: "200+ Places, 84 collections",
      detail: "JAN 13-14 • 4 hr 33 min",
      image: best_of_cebu,
    },
    {
      id: 2,
      title: "Beach Paradise",
      subtitle: "150+ Places, 62 collections",
      detail: "ALL YEAR • 3 hr 15 min",
      image: beach_paradise,
    },
    {
      id: 3,
      title: "Cultural Heritage",
      subtitle: "95+ Places, 45 collections",
      detail: "WEEKENDS • 2 hr 45 min",
      image: cultural_heritage,
    },
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

  // Collection Card Component (Large Featured Cards)
  const CollectionCard = ({ collection }) => (
    <TouchableOpacity
      className="bg-white rounded-3xl overflow-hidden mb-4 mx-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <ImageBackground
        source={collection.image}
        className="h-48 justify-end p-5"
        style={{
          backgroundColor:
            collection.id === 1
              ? "#FF6B6B"
              : collection.id === 2
                ? "#4ECDC4"
                : "#FFB347",
        }}
      >
        <View className="absolute inset-0 bg-black/20" />
        <Text className="text-white text-2xl font-bold mb-2">
          {collection.title}
        </Text>
        <Text className="text-white/90 text-sm mb-1">
          {collection.subtitle}
        </Text>
        <Text className="text-white/80 text-xs">{collection.detail}</Text>
      </ImageBackground>
      <View className="absolute bottom-4 right-4">
        <View className="bg-white px-4 py-2 rounded-full">
          <Text className="text-gray-900 text-sm font-bold">Explore</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Grid Card Component for Destinations
  const GridCard = ({ destination }) => (
    <TouchableOpacity
      className="bg-white rounded-3xl overflow-hidden mb-4 mx-2 flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        height: 160, // Fixed height for consistent layout
      }}
      onPress={() =>
        navigation.navigate("detailed-info", { spotId: destination._id })
      }
    >
      {/* Image Container - Left Side */}
      <View className="w-32 relative">
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: destination.color || "#4A90E2",
          }}
        />

        {/* Gradient Overlay */}
        <View className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

        {/* Top Badge */}
        <View className="absolute top-2 left-2">
          <View className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full">
            <Text className="text-red-600 text-xs font-bold">
              {destination.category || "Attraction"}
            </Text>
          </View>
        </View>

        {/* Bottom Rating */}
        <View className="absolute bottom-2 left-2 right-2">
          <View className="bg-black/70 px-2 py-1 rounded-full flex-row items-center justify-center">
            <Feather name="star" size={10} color="#F59E0B" />
            <Text className="text-white text-xs font-semibold ml-1">
              {destination.rating}
            </Text>
          </View>
        </View>
      </View>

      {/* Content Section - Right Side */}
      <View className="flex-1 p-3 justify-between">
        {/* Top Section */}
        <View>
          <Text
            className="text-gray-900 font-bold text-base mb-1"
            numberOfLines={1}
          >
            {destination.name}
          </Text>

          <View className="flex-row items-center mb-1">
            <Feather name="map-pin" size={12} color="#718096" />
            <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
              {destination.location || "Cebu, Philippines"}
            </Text>
          </View>

          <Text
            className="text-gray-600 text-xs leading-4 mb-2"
            numberOfLines={2}
          >
            {destination.description ||
              "Explore this amazing destination in Cebu with stunning views."}
          </Text>
        </View>

        {/* Bottom Stats */}
        <View className="flex-row items-center justify-between">
          {/* Price */}
          <View className="bg-red-50 px-2 py-1 rounded-lg">
            <Text className="text-red-700 text-xs font-bold">
              {destination.price || "Free"}
            </Text>
          </View>

          {/* Distance & Time */}
          <View className="flex-row items-center space-x-1">
            <View className="flex-row items-center">
              <Feather name="clock" size={10} color="#718096" />
              <Text className="text-gray-500 text-xs ml-1">
                {destination.distance || "15min"}
              </Text>
            </View>

            <View className="w-1 h-1 bg-gray-300 rounded-full mx-1" />

            <Text className="text-gray-500 text-xs">
              {destination.days || "2-3h"}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row space-x-1">
            {destination.activities?.slice(0, 2).map((activity, index) => (
              <View key={index} className="bg-gray-100 px-2 py-1 rounded-lg">
                <Text className="text-gray-600 text-xs" numberOfLines={1}>
                  {activity}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity className="bg-red-600 w-8 h-8 rounded-full items-center justify-center">
            <Feather name="arrow-right" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty State Component
  const EmptyState = () => (
    <View className="items-center justify-center py-12 px-4">
      <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
        <Feather name="search" size={32} color={colors.primary} />
      </View>
      <Text className="text-lg font-bold text-gray-800 mb-2">
        No Destinations Found
      </Text>
      <Text className="text-sm text-gray-500 text-center">
        Try a different search or category to discover more places
      </Text>
    </View>
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
        {/* Search Bar */}
        <View className="px-5 mt-2 mb-4">
          <View
            className="bg-white rounded-2xl px-4 py-3 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Feather name="search" size={20} color={colors.muted} />
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

        {/* Tab Selector */}
        <View className="px-5 mb-4">
          <View className="flex-row bg-white rounded-2xl p-1">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 rounded-xl items-center ${
                  activeTab === tab.id ? "bg-red-600" : ""
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    activeTab === tab.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Collections View */}
        {activeTab === "collections" && (
          <View className="mb-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </View>
        )}

        {/* Destinations View */}
        {activeTab === "destinations" && (
          <>
            {/* Categories */}
            <View className="mb-5">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  gap: 10,
                  paddingVertical: 4,
                }}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setActiveCategory(category.id)}
                    className={`rounded-2xl px-4 py-3 flex-row items-center ${
                      activeCategory === category.id ? "bg-red-600" : "bg-white"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Feather
                      name={category.icon}
                      size={16}
                      color={
                        activeCategory === category.id
                          ? "white"
                          : colors.primary
                      }
                    />
                    <Text
                      className={`ml-2 text-sm font-semibold ${
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
                  <Text className="text-xl font-bold text-gray-900">
                    {activeCategory === "all"
                      ? "All Destinations"
                      : categories.find((c) => c.id === activeCategory)?.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {loading
                      ? "Loading..."
                      : `${filteredDestinations.length} places found`}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("map")}
                  className="flex-row items-center bg-red-600 px-4 py-2 rounded-full"
                >
                  <Feather name="map" size={14} color="white" />
                  <Text className="text-sm ml-2 font-semibold text-white">
                    Map
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Loading State */}
            {loading && (
              <View className="py-10">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  className="text-center mt-3"
                  style={{ color: colors.muted }}
                >
                  Discovering amazing places...
                </Text>
              </View>
            )}

            {/* Destinations Grid */}
            {!loading && filteredDestinations.length > 0 && (
              <View className="px-2 mb-6">
                <View className="flex-col flex-wrap justify-between">
                  {filteredDestinations.map((destination) => (
                    <GridCard key={destination.id} destination={destination} />
                  ))}
                </View>
              </View>
            )}

            {/* No Results State */}
            {!loading && filteredDestinations.length === 0 && <EmptyState />}
          </>
        )}

        {/* Local Tips */}
        <View className="px-5 mt-2 mb-6">
          <View
            className="bg-white rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mr-3">
                <Feather name="info" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base mb-1 text-gray-900">
                  Local Tip
                </Text>
                <Text className="text-sm text-gray-600">
                  Visit waterfalls in the morning to avoid crowds! Beaches are
                  perfect from 3-5PM for golden hour photos.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trending Searches */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold mb-3 text-gray-900">
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
                className="bg-white px-4 py-2 rounded-full"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text className="text-sm font-medium text-gray-700">
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
