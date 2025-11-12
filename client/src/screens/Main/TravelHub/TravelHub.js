import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";
import { TripPlanService } from "../../../services/tripPlanService";
import { useAuth } from "../../../context/AuthenticationContext";

export default function TravelHub() {
  const [activeTab, setActiveTab] = useState("planner");
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // 🎯 FETCH USER'S REAL TRIPS FROM DATABASE
  useEffect(() => {
    if (user) {
      loadUserTrips();
    }
  }, [user]);

  const loadUserTrips = async () => {
    try {
      setLoading(true);
      console.log("📂 Loading user trips...");

      const result = await TripPlanService.getUserTrips(user.id);

      if (result.success) {
        console.log("✅ Found", result.trips.length, "trips");
        setUserTrips(result.trips);
      } else {
        console.log("❌ No trips found");
        setUserTrips([]);
      }
    } catch (error) {
      console.error("❌ Error loading trips:", error);
      Alert.alert("Error", "Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  // Sample flights (keeping this for now)
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

  // 🎯 FORMAT DATE FOR DISPLAY
  const formatDate = (dateString) => {
    if (!dateString) return "Flexible dates";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // 🎯 CALCULATE TOTAL ACTIVITIES
  const calculateTotalActivities = (trip) => {
    return (
      trip.days?.reduce(
        (total, day) => total + (day.activities?.length || 0),
        0
      ) || 0
    );
  };

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
          <TouchableOpacity
            onPress={loadUserTrips}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="refresh-cw" size={20} color={colors.text} />
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
              <TouchableOpacity onPress={loadUserTrips}>
                <Text className="text-red-600 text-sm font-semibold">
                  {loading ? "Loading..." : "Refresh"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 🎯 REAL TRIPS FROM DATABASE */}
            {loading ? (
              <View className="items-center py-8">
                <Text className="text-gray-500">Loading your trips...</Text>
              </View>
            ) : userTrips.length === 0 ? (
              <View className="items-center py-8 bg-white rounded-2xl p-6 border border-gray-200">
                <Feather name="map" size={48} color={colors.muted} />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                  No trips yet
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Create your first trip with AI Planner!
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ai")}
                  className="bg-red-600 py-3 px-6 rounded-xl mt-4"
                >
                  <Text className="text-white font-semibold">Plan with AI</Text>
                </TouchableOpacity>
              </View>
            ) : (
              userTrips.map((trip) => {
                const totalActivities = calculateTotalActivities(trip);
                const completedActivities =
                  trip.progress?.completedActivities || 0;
                const completionPercentage =
                  trip.progress?.completionPercentage || 0;

                return (
                  <TouchableOpacity
                    key={trip._id}
                    className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3"
                    onPress={() =>
                      navigation.navigate("TripDetail", { tripId: trip._id })
                    }
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900 text-base mb-1">
                          {trip.title}
                        </Text>
                        <View className="flex-row items-center space-x-3">
                          <View className="flex-row items-center">
                            <Feather
                              name="calendar"
                              size={12}
                              color={colors.muted}
                            />
                            <Text className="text-gray-500 text-xs ml-1">
                              {trip.duration?.days || 0} days
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Feather
                              name="map-pin"
                              size={12}
                              color={colors.muted}
                            />
                            <Text className="text-gray-500 text-xs ml-1">
                              {totalActivities} activities
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="bg-red-50 px-2 py-1 rounded-full">
                        <Text className="text-red-700 text-xs font-semibold">
                          {trip.budget?.total || "Flexible budget"}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-2">
                      <View className="w-full bg-gray-200 rounded-full h-2">
                        <View
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${completionPercentage}%`,
                          }}
                        />
                      </View>
                      <Text className="text-gray-500 text-xs mt-1">
                        {completedActivities} of {totalActivities} activities
                        completed
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        className="flex-1 bg-red-600 py-2 rounded-xl mr-2"
                        onPress={() =>
                          navigation.navigate("trip-details", {
                            tripId: trip._id,
                          })
                        }
                      >
                        <Text className="text-white text-center text-sm font-semibold">
                          {completionPercentage === 100
                            ? "View Trip"
                            : "Continue Planning"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
                        <Feather name="share-2" size={16} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : (
          /* FLIGHTS TAB (Unchanged) */
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
