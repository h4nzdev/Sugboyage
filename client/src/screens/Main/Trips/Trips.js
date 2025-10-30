import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Trips() {
  const [activeTab, setActiveTab] = useState("aiPlans");

  // AI-GENERATED CEBU ITINERARIES
  const aiPlans = [
    {
      id: 1,
      title: "Cebu Ultimate Adventure",
      date: "AI Recommended • 3 days",
      duration: "3 days",
      destinations: ["Kawasan Falls", "Osmeña Peak", "Bantayan Island"],
      status: "aiRecommended",
      travelers: "Solo/Couple",
      budget: "₱8,500",
      features: ["Geofenced alerts", "Photo spots", "Local deals"],
      aiScore: 98,
      saved: 245,
      geofenceSpots: 8,
      image: "adventure",
    },
    {
      id: 2,
      title: "Cebu Cultural Heritage",
      date: "AI Recommended • 2 days",
      duration: "2 days",
      destinations: ["Magellan's Cross", "Temple of Leah", "Fort San Pedro"],
      status: "aiRecommended",
      travelers: "Family Friendly",
      budget: "₱4,200",
      features: ["Historical sites", "Photo recognition", "Guided routes"],
      aiScore: 92,
      saved: 189,
      geofenceSpots: 6,
      image: "cultural",
    },
  ];

  // USER'S PERSONAL TRIPS WITH GEOFENCING
  const myTrips = [
    {
      id: 3,
      title: "My Cebu Food Adventure",
      date: "Dec 15-17, 2024",
      duration: "3 days",
      destinations: ["Larsian BBQ", "CNT Lechon", "House of Lechon"],
      status: "planned",
      travelers: 2,
      budget: "₱5,500",
      progress: 0,
      geofenceSpots: 5,
      alertsActive: true,
      image: "food",
      achievements: ["Foodie Explorer"],
    },
    {
      id: 4,
      title: "Weekend Beach Escape",
      date: "Jan 5-7, 2024",
      duration: "3 days",
      destinations: ["Moalboal", "White Beach", "Pescador Island"],
      status: "confirmed",
      travelers: 4,
      budget: "₱7,800",
      progress: 2,
      geofenceSpots: 4,
      alertsActive: true,
      image: "beach",
      achievements: ["Beach Lover", "Snorkeling Pro"],
    },
  ];

  // FLIGHT-INTEGRATED TRIPS
  const flightTrips = [
    {
      id: 5,
      title: "Layover Adventure",
      date: "Flight: 5J 123 • 6hr layover",
      duration: "6 hours",
      destinations: ["MCIA Lounge", "Mactan Shrine", "Local Eateries"],
      status: "flightIntegrated",
      travelers: "Solo",
      budget: "₱1,200",
      flight: "5J 123 • 6hr layover",
      airportDeals: ["20% off massage", "Free SIM card"],
      timeOptimized: true,
      image: "layover",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "aiRecommended":
        return "bg-purple-500";
      case "planned":
        return "bg-blue-500";
      case "confirmed":
        return "bg-green-500";
      case "flightIntegrated":
        return "bg-orange-500";
      case "community":
        return "bg-pink-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "aiRecommended":
        return "AI RECOMMENDED";
      case "planned":
        return "PLANNING";
      case "confirmed":
        return "CONFIRMED";
      case "flightIntegrated":
        return "FLIGHT MODE";
      case "community":
        return "COMMUNITY";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-3 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-1">
          <View>
            <Text className="text-2xl font-black text-gray-900">
              Travel Planner
            </Text>
            <Text className="text-emerald-600 text-sm font-medium">
              AI-Powered Cebu Adventures
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
              <Feather name="search" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-emerald-500 p-2 rounded-xl">
              <Feather name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tab Navigation - SUGVOYAGE FOCUSED */}
      <View className="px-5 border-b border-gray-200 bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
          className="py-4"
        >
          {[
            {
              id: "aiPlans",
              label: "AI Plans",
              count: aiPlans.length,
              icon: "cpu",
            },
            {
              id: "myTrips",
              label: "My Trips",
              count: myTrips.length,
              icon: "map",
            },
            {
              id: "flightTrips",
              label: "Flight Mode",
              count: flightTrips.length,
              icon: "airplay",
            },
            { id: "achievements", label: "Badges", count: 8, icon: "award" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl flex-row items-center ${
                activeTab === tab.id ? "bg-emerald-500" : "bg-gray-100"
              }`}
            >
              <Feather
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                className={`ml-2 font-semibold text-sm ${
                  activeTab === tab.id ? "text-white" : "text-gray-700"
                }`}
              >
                {tab.label}
              </Text>
              <View
                className={`ml-2 px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    activeTab === tab.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* AI PLANS SECTION */}
        {activeTab === "aiPlans" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              AI-Generated Itineraries
            </Text>

            {aiPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                {/* Header with AI Badge */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-purple-100 px-2 py-1 rounded-full mr-2">
                        <Text className="text-purple-700 text-xs font-black">
                          AI RECOMMENDED
                        </Text>
                      </View>
                      <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
                        <Feather name="zap" size={12} color="#059669" />
                        <Text className="text-green-700 text-xs font-bold ml-1">
                          {plan.aiScore}% Match
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-black text-lg mb-1">
                      {plan.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Feather name="calendar" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {plan.date}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Geofencing Features */}
                <View className="mb-3">
                  <View className="flex-row items-center mb-2">
                    <Feather name="map-pin" size={14} color="#059669" />
                    <Text className="text-gray-700 text-sm font-medium ml-1">
                      {plan.geofenceSpots} geofenced locations • {plan.saved}{" "}
                      travelers saved
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap">
                    {plan.features.map((feature, index) => (
                      <View
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        <Text className="text-gray-700 text-xs">
                          📍 {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Destinations */}
                <View className="mb-3">
                  <Text className="text-gray-700 text-sm font-medium mb-2">
                    Destinations:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {plan.destinations.map((destination, index) => (
                      <View
                        key={index}
                        className="bg-emerald-50 px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-emerald-700 text-xs font-medium">
                          {destination}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between">
                  <TouchableOpacity className="flex-1 bg-emerald-500 py-3 rounded-xl mr-2">
                    <Text className="text-white text-center font-bold text-sm">
                      USE THIS PLAN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl">
                    <Text className="text-gray-700 text-center font-bold text-sm">
                      CUSTOMIZE
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity className="bg-white rounded-2xl p-5 mt-4 border-2 border-purple-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-purple-100 p-3 rounded-2xl mr-3">
                    <Feather name="cpu" size={24} color="#7C3AED" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-black text-lg">
                      Create Custom AI Plan
                    </Text>
                    <Text className="text-gray-600 text-sm flex-shrink">
                      Get personalized itinerary based on your preferences
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* MY TRIPS SECTION */}
        {activeTab === "myTrips" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              My Cebu Adventures
            </Text>

            {myTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                {/* Header with Status */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View
                        className={`px-3 py-1 rounded-full ${getStatusColor(trip.status)}`}
                      >
                        <Text className="text-white text-xs font-black">
                          {getStatusText(trip.status)}
                        </Text>
                      </View>
                      {trip.alertsActive && (
                        <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                          <Text className="text-green-700 text-xs font-bold">
                            📍 ALERTS ON
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-900 font-black text-lg mb-1">
                      {trip.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Feather name="calendar" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {trip.date}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Progress & Geofencing */}
                <View className="mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700 text-sm font-medium">
                      {trip.progress}/{trip.geofenceSpots} spots visited
                    </Text>
                    <Text className="text-emerald-600 text-sm font-bold">
                      {trip.geofenceSpots} geofenced
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${(trip.progress / trip.geofenceSpots) * 100}%`,
                      }}
                    />
                  </View>
                </View>

                {/* Achievements */}
                {trip.achievements && (
                  <View className="mb-3">
                    <Text className="text-gray-700 text-sm font-medium mb-2">
                      Achievements:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {trip.achievements.map((achievement, index) => (
                        <View
                          key={index}
                          className="bg-yellow-50 px-3 py-1 rounded-full mr-2 mb-1"
                        >
                          <Text className="text-yellow-700 text-xs font-medium">
                            🏆 {achievement}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row justify-between">
                  <TouchableOpacity className="flex-1 bg-emerald-500 py-3 rounded-xl mr-2">
                    <Text className="text-white text-center font-bold text-sm">
                      VIEW TRIP
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl">
                    <Text className="text-gray-700 text-center font-bold text-sm">
                      SHARE
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* FLIGHT TRIPS SECTION */}
        {activeTab === "flightTrips" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Flight-Integrated Plans
            </Text>

            {flightTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                {/* Flight Info */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-orange-100 px-3 py-1 rounded-full mr-2">
                        <Text className="text-orange-700 text-xs font-black">
                          ✈️ FLIGHT MODE
                        </Text>
                      </View>
                      {trip.timeOptimized && (
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-green-700 text-xs font-bold">
                            ⏱️ TIME OPTIMIZED
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-900 font-black text-lg mb-1">
                      {trip.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Feather name="airplay" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {trip.flight}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Airport Deals */}
                <View className="mb-3">
                  <Text className="text-gray-700 text-sm font-medium mb-2">
                    MCIA Airport Deals:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {trip.airportDeals.map((deal, index) => (
                      <View
                        key={index}
                        className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-1"
                      >
                        <Text className="text-blue-700 text-xs font-medium">
                          🎁 {deal}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity className="flex-1 bg-orange-500 py-3 rounded-xl mr-2">
                    <Text className="text-white text-center font-bold text-sm">
                      START LAYOVER
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl">
                    <Text className="text-gray-700 text-center font-bold text-sm">
                      FLIGHT INFO
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ACHIEVEMENTS SECTION */}
        {activeTab === "achievements" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              My Cebu Badges
            </Text>

            <View className="bg-white rounded-2xl p-5 border border-gray-200">
              <View className="flex-row flex-wrap justify-between">
                {[
                  { name: "Cebu Explorer", icon: "🏝️", earned: true },
                  { name: "Foodie Master", icon: "🍖", earned: true },
                  { name: "Waterfall Chaser", icon: "💦", earned: false },
                  { name: "History Buff", icon: "🏛️", earned: true },
                  { name: "Beach Lover", icon: "🏖️", earned: true },
                  { name: "Adventure Seeker", icon: "🧗", earned: false },
                  { name: "Local Expert", icon: "🎯", earned: false },
                  { name: "Photo Pro", icon: "📸", earned: true },
                ].map((badge, index) => (
                  <View key={index} className="w-[48%] items-center mb-4">
                    <View
                      className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${
                        badge.earned
                          ? "bg-emerald-100 border-2 border-emerald-300"
                          : "bg-gray-100 border-2 border-gray-200"
                      }`}
                    >
                      <Text className="text-2xl">{badge.icon}</Text>
                    </View>
                    <Text
                      className={`text-sm font-medium text-center ${
                        badge.earned ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {badge.name}
                    </Text>
                    <Text
                      className={`text-xs ${
                        badge.earned
                          ? "text-emerald-600 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {badge.earned ? "EARNED" : "LOCKED"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
