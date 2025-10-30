import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHeader from "../../../components/Header/MainHeader";

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "beaches", name: "Beaches", icon: "sun" },
    { id: "historical", name: "Historical", icon: "book" },
    { id: "adventure", name: "Adventure", icon: "activity" },
    { id: "cultural", name: "Cultural", icon: "users" },
    { id: "food", name: "Food", icon: "coffee" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Kawasan Falls Adventure",
      location: "Badian, Cebu",
      days: "Full Day",
      type: "Waterfall",
      distance: "2.5 hrs away",
      rating: 4.9,
      category: "adventure",
      color: "#10B981",
      price: "₱500",
      featured: true,
      geofence: true,
    },
    {
      id: 2,
      name: "Bantayan Island Escape",
      location: "Bantayan Island",
      days: "2-3 Days",
      type: "Beach Paradise",
      distance: "4 hrs away",
      rating: 4.8,
      category: "beaches",
      color: "#06B6D4",
      price: "₱1,200",
      featured: false,
      geofence: true,
    },
    {
      id: 3,
      name: "Temple of Leah",
      location: "Cebu City",
      days: "Half Day",
      type: "Historical Landmark",
      distance: "20 min away",
      rating: 4.7,
      category: "historical",
      color: "#8B5CF6",
      price: "₱100",
      featured: true,
      geofence: true,
    },
    {
      id: 4,
      name: "Sirao Flower Farm",
      location: "Cebu City",
      days: "Half Day",
      type: "Scenic Garden",
      distance: "45 min away",
      rating: 4.6,
      category: "cultural",
      color: "#EC4899",
      price: "₱150",
      featured: false,
      geofence: true,
    },
    {
      id: 5,
      name: "Magellan's Cross",
      location: "Downtown Cebu",
      days: "1-2 Hours",
      type: "Cultural Heritage",
      distance: "15 min away",
      rating: 4.5,
      category: "cultural",
      color: "#F59E0B",
      price: "Free",
      featured: true,
      geofence: true,
    },
    {
      id: 6,
      name: "Osmeña Peak Hike",
      location: "Dalaguete, Cebu",
      days: "Full Day",
      type: "Mountain Adventure",
      distance: "3 hrs away",
      rating: 4.8,
      category: "adventure",
      color: "#F97316",
      price: "₱300",
      featured: false,
      geofence: false,
    },
  ];

  const filteredDestinations =
    activeCategory === "all"
      ? destinations
      : destinations.filter((dest) => dest.category === activeCategory);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
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
              placeholderTextColor="#9CA3AF"
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
                onPress={() => setActiveCategory(category.id)}
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
                {filteredDestinations.length} amazing places found
              </Text>
            </View>
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
              <Feather name="map" size={14} color="#374151" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                View Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Destination Cards Grid */}
        <View className="px-5">
          <View className="flex-row flex-wrap justify-between">
            {filteredDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                className="w-[48%] bg-white rounded-2xl mb-4 overflow-hidden border border-gray-200 shadow-sm"
              >
                {/* Image/Color Section */}
                <View
                  className="h-32 relative"
                  style={{ backgroundColor: destination.color }}
                >
                  {/* Featured Badge */}
                  {destination.featured && (
                    <View className="absolute top-2 left-2 bg-amber-500 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-black">
                        FEATURED
                      </Text>
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
                    <Text
                      className="text-gray-600 text-xs ml-1 flex-1"
                      numberOfLines={1}
                    >
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
                        {destination.distance}
                      </Text>
                    </View>
                  </View>

                  {/* Quick Action */}
                  <TouchableOpacity className="bg-emerald-50 mt-2 py-1 rounded-lg">
                    <Text className="text-emerald-700 text-xs font-bold text-center">
                      VIEW DETAILS
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Local Tips Section */}
        <View className="px-5 mt-4 mb-6">
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
    </SafeAreaView>
  );
}
