import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

export default function TravelHub() {
  const [activeTab, setActiveTab] = useState("planner");
  const navigation = useNavigation();

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // Sample itineraries
  const savedItineraries = [
    {
      id: 1,
      title: "Cebu Weekend Getaway",
      duration: "3 days",
      date: "Dec 15-17, 2024",
      spots: 8,
      progress: 3,
      total: 8,
    },
    {
      id: 2,
      title: "Cultural Heritage Tour",
      duration: "2 days",
      date: "Jan 5-6, 2025",
      spots: 6,
      progress: 1,
      total: 6,
    },
    {
      id: 3,
      title: "Beach & Island Hopping",
      duration: "4 days",
      date: "Feb 20-23, 2025",
      spots: 5,
      progress: 0,
      total: 5,
    },
  ];

  // Sample flights
  const flightDeals = [
    {
      id: 1,
      airline: "Cebu Pacific",
      route: "Manila → Cebu",
      price: "₱1,499",
      date: "Dec 15, 2024",
      duration: "1h 15m",
      stops: "Direct",
    },
    {
      id: 2,
      airline: "Philippine Airlines",
      route: "Cebu → Manila",
      price: "₱1,899",
      date: "Dec 20, 2024",
      duration: "1h 15m",
      stops: "Direct",
    },
    {
      id: 3,
      airline: "AirAsia",
      route: "Davao → Cebu",
      price: "₱2,199",
      date: "Jan 10, 2025",
      duration: "1h 45m",
      stops: "Direct",
    },
  ];

  // Quick planning actions
  const quickActions = [
    {
      icon: "plus-circle",
      title: "Create New Trip",
      subtitle: "Start from scratch",
      action: () => navigation.navigate("ai"),
      color: "#DC143C",
    },
    {
      icon: "download",
      title: "Import Plans",
      subtitle: "From other apps",
      action: () => console.log("Import"),
      color: "#059669",
    },
    {
      icon: "users",
      title: "Group Trip",
      subtitle: "Plan with friends",
      action: () => console.log("Group Trip"),
      color: "#0369A1",
    },
    {
      icon: "trending-up",
      title: "Flight Alerts",
      subtitle: "Price drop notifications",
      action: () => console.log("Alerts"),
      color: "#8B5CF6",
    },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-gray-900">
              Travel Hub
            </Text>
            <Text className="text-red-600 text-sm font-semibold">
              Plan • Book • Explore
            </Text>
          </View>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-xl">
            <Feather name="search" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("planner")}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === "planner" ? "border-red-600" : "border-transparent"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "planner" ? "text-red-600" : "text-gray-500"
            }`}
          >
            Trip Planner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("flights")}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === "flights" ? "border-red-600" : "border-transparent"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "flights" ? "text-red-600" : "text-gray-500"
            }`}
          >
            Flights
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {activeTab === "planner" ? (
          /* TRIP PLANNER TAB */
          <View className="p-4">
            {/* Quick Actions */}
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.action}
                  className="w-[48%] mb-3"
                >
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <Feather
                        name={action.icon}
                        size={18}
                        color={action.color}
                      />
                    </View>
                    <Text className="font-semibold text-gray-900 text-sm mb-1">
                      {action.title}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {action.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Saved Itineraries */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                My Itineraries
              </Text>
              <TouchableOpacity>
                <Text className="text-red-600 text-sm font-semibold">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {savedItineraries.map((itinerary) => (
              <TouchableOpacity
                key={itinerary.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-base mb-1">
                      {itinerary.title}
                    </Text>
                    <View className="flex-row items-center space-x-3">
                      <View className="flex-row items-center">
                        <Feather
                          name="calendar"
                          size={12}
                          color={colors.muted}
                        />
                        <Text className="text-gray-500 text-xs ml-1">
                          {itinerary.duration}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Feather
                          name="map-pin"
                          size={12}
                          color={colors.muted}
                        />
                        <Text className="text-gray-500 text-xs ml-1">
                          {itinerary.spots} spots
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-red-50 px-2 py-1 rounded-full">
                    <Text className="text-red-700 text-xs font-semibold">
                      {itinerary.date}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="mb-2">
                  <View className="w-full bg-gray-200 rounded-full h-2">
                    <View
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${(itinerary.progress / itinerary.total) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                    {itinerary.progress} of {itinerary.total} activities planned
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity className="flex-1 bg-red-600 py-2 rounded-xl mr-2">
                    <Text className="text-white text-center text-sm font-semibold">
                      Continue Planning
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
                    <Feather name="share-2" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* FLIGHTS TAB */
          <View className="p-4">
            {/* Quick Search */}
            <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
              <Text className="font-bold text-gray-900 text-lg mb-3">
                Find Flights
              </Text>
              <View className="flex-row space-x-2 mb-3">
                <View className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
                  <Text className="text-gray-500 text-xs">From</Text>
                  <Text className="text-gray-900 text-sm font-medium">
                    Manila
                  </Text>
                </View>
                <View className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
                  <Text className="text-gray-500 text-xs">To</Text>
                  <Text className="text-gray-900 text-sm font-medium">
                    Cebu
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="bg-red-600 py-3 rounded-xl">
                <Text className="text-white text-center font-semibold">
                  Search Flights
                </Text>
              </TouchableOpacity>
            </View>

            {/* Flight Deals */}
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Best Deals to Cebu
            </Text>

            {flightDeals.map((flight) => (
              <TouchableOpacity
                key={flight.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="font-bold text-gray-900 text-base">
                      {flight.airline}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {flight.route}
                    </Text>
                  </View>
                  <View className="bg-green-50 px-3 py-1 rounded-full">
                    <Text className="text-green-700 font-bold text-base">
                      {flight.price}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                      <Feather name="clock" size={12} color={colors.muted} />
                      <Text className="text-gray-500 text-xs ml-1">
                        {flight.duration}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Feather name="layers" size={12} color={colors.muted} />
                      <Text className="text-gray-500 text-xs ml-1">
                        {flight.stops}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-xs">{flight.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
