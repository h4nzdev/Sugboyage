import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";
import { TripPlanService } from "../../../services/tripPlanService";
import { useAuth } from "../../../context/AuthenticationContext";

export default function TripDetails() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  useEffect(() => {
    if (route.params?.tripId) {
      loadTripDetails();
    }
  }, [route.params?.tripId]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      const result = await TripPlanService.getTripById(route.params.tripId);

      if (result.success) {
        setTrip(result.trip);
      } else {
        Alert.alert("Error", "Trip not found");
        navigation.goBack();
      }
    } catch (error) {
      console.error("❌ Error loading trip details:", error);
      Alert.alert("Error", "Failed to load trip details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Flexible time";
    return timeString; // Your times are already in AM/PM format
  };

  const getCategoryIcon = (category) => {
    const icons = {
      historical: "book",
      food: "coffee",
      nature: "tree",
      cultural: "award",
      adventure: "activity",
      transport: "truck",
      default: "map-pin",
    };
    return icons[category] || icons.default;
  };

  const getCategoryColor = (category) => {
    const colors = {
      historical: "#F59E0B", // amber
      food: "#EF4444", // red
      nature: "#10B981", // green
      cultural: "#8B5CF6", // violet
      adventure: "#DC2626", // red-600
      transport: "#6366F1", // indigo
      default: "#6B7280", // gray
    };
    return colors[category] || colors.default;
  };

  const calculateTotalCost = () => {
    if (!trip?.days) return "₱0";

    let total = 0;
    trip.days.forEach((day) => {
      day.activities.forEach((activity) => {
        // Extract numeric value from cost string
        const cost = activity.cost;
        if (cost && cost !== "Free") {
          const numericValue = cost.match(/₱?([0-9,]+)/);
          if (numericValue) {
            total += parseInt(numericValue[1].replace(/,/g, ""));
          }
        }
      });
    });

    return `₱${total.toLocaleString()}`;
  };

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#DC143C" />
          <Text className="text-gray-500 mt-4">Loading trip details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!trip) {
    return (
      <ScreenWrapper className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Feather name="alert-circle" size={48} color="#718096" />
          <Text className="text-gray-500 mt-4 text-lg">Trip not found</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-red-600 py-3 px-6 rounded-xl mt-4"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={loadTripDetails}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="refresh-cw" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-black text-gray-900 text-center">
          {trip.title}
        </Text>
        <Text className="text-red-600 text-sm font-semibold text-center">
          {trip.duration?.days || 0} Days • {trip.duration?.nights || 0} Nights
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Trip Overview */}
        <View className="p-4">
          <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Trip Overview
            </Text>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-700 font-medium">Trip Progress</Text>
                <Text className="text-red-600 font-semibold">
                  {trip.progress?.completionPercentage || 0}%
                </Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-3">
                <View
                  className="bg-red-600 h-3 rounded-full"
                  style={{
                    width: `${trip.progress?.completionPercentage || 0}%`,
                  }}
                />
              </View>
              <Text className="text-gray-500 text-xs mt-1">
                {trip.progress?.completedActivities || 0} of{" "}
                {trip.progress?.plannedActivities || 0} activities completed
              </Text>
            </View>

            {/* Trip Details Grid */}
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] mb-3">
                <View className="flex-row items-center mb-1">
                  <Feather name="dollar-sign" size={14} color={colors.muted} />
                  <Text className="text-gray-500 text-xs ml-1">Budget</Text>
                </View>
                <Text className="text-gray-900 text-sm font-medium">
                  {trip.budget?.total || "Flexible"}
                </Text>
              </View>

              <View className="w-[48%] mb-3">
                <View className="flex-row items-center mb-1">
                  <Feather name="users" size={14} color={colors.muted} />
                  <Text className="text-gray-500 text-xs ml-1">Travelers</Text>
                </View>
                <Text className="text-gray-900 text-sm font-medium">
                  {trip.travelers
                    ? `${trip.travelers.adults} Adult${trip.travelers.adults !== 1 ? "s" : ""}${
                        trip.travelers.children > 0
                          ? `, ${trip.travelers.children} Child${trip.travelers.children !== 1 ? "ren" : ""}`
                          : ""
                      }${
                        trip.travelers.seniors > 0
                          ? `, ${trip.travelers.seniors} Senior${trip.travelers.seniors !== 1 ? "s" : ""}`
                          : ""
                      }`
                    : "Solo"}
                </Text>
              </View>

              <View className="w-[48%] mb-3">
                <View className="flex-row items-center mb-1">
                  <Feather name="calculator" size={14} color={colors.muted} />
                  <Text className="text-gray-500 text-xs ml-1">Total Cost</Text>
                </View>
                <Text className="text-gray-900 text-sm font-medium">
                  {calculateTotalCost()}
                </Text>
              </View>

              <View className="w-[48%] mb-3">
                <View className="flex-row items-center mb-1">
                  <Feather name="cpu" size={14} color={colors.muted} />
                  <Text className="text-gray-500 text-xs ml-1">Generated</Text>
                </View>
                <Text className="text-gray-900 text-sm font-medium">
                  {trip.generatedByAI ? "AI Planned" : "Manual"}
                </Text>
              </View>
            </View>
          </View>

          {/* Days Navigation */}
          {trip.days && trip.days.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Itinerary
              </Text>

              {/* Day Themes */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-3"
              >
                <View className="flex-row gap-2">
                  {trip.days.map((day, index) => (
                    <TouchableOpacity
                      key={day._id?.$oid || index}
                      onPress={() => setActiveDay(index)}
                      className={`px-4 py-3 rounded-xl min-w-[120px] ${
                        activeDay === index ? "bg-red-600" : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-bold text-center ${
                          activeDay === index ? "text-white" : "text-gray-700"
                        }`}
                      >
                        Day {index + 1}
                      </Text>
                      <Text
                        className={`text-xs text-center mt-1 ${
                          activeDay === index ? "text-red-100" : "text-gray-500"
                        }`}
                        numberOfLines={2}
                      >
                        {day.theme}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Day Activities */}
              <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <View className="mb-4">
                  <Text className="font-bold text-gray-900 text-lg">
                    Day {activeDay + 1}
                  </Text>
                  <Text className="text-red-600 font-medium text-sm">
                    {trip.days[activeDay]?.theme}
                  </Text>
                </View>

                {trip.days[activeDay]?.activities?.length > 0 ? (
                  trip.days[activeDay].activities.map((activity, index) => (
                    <View
                      key={activity._id?.$oid || index}
                      className="mb-6 last:mb-0"
                    >
                      <View className="flex-row">
                        {/* Timeline dot and line */}
                        <View className="relative mr-3">
                          <View
                            className="w-3 h-3 rounded-full mt-1"
                            style={{
                              backgroundColor: getCategoryColor(
                                activity.category
                              ),
                            }}
                          />
                          {index <
                            trip.days[activeDay].activities.length - 1 && (
                            <View className="absolute top-4 left-1.5 w-0.5 h-16 bg-gray-300" />
                          )}
                        </View>

                        {/* Activity content */}
                        <View className="flex-1">
                          <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-row items-center flex-1">
                              <View
                                className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                                style={{
                                  backgroundColor: `${getCategoryColor(activity.category)}20`,
                                }}
                              >
                                <Feather
                                  name={getCategoryIcon(activity.category)}
                                  size={16}
                                  color={getCategoryColor(activity.category)}
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="font-semibold text-gray-900 text-base">
                                  {activity.name}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                  <Feather
                                    name="clock"
                                    size={12}
                                    color={colors.muted}
                                  />
                                  <Text className="text-gray-500 text-xs ml-1">
                                    {activity.time} • {activity.duration}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          {/* Cost and Status */}
                          <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                              <View
                                className={`px-2 py-1 rounded-full ${
                                  activity.cost === "Free"
                                    ? "bg-green-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <Text
                                  className={`text-xs font-medium ${
                                    activity.cost === "Free"
                                      ? "text-green-800"
                                      : "text-blue-800"
                                  }`}
                                >
                                  {activity.cost}
                                </Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              className={`px-3 py-1 rounded-full ${
                                activity.isCompleted
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Text
                                className={`text-xs font-medium ${
                                  activity.isCompleted
                                    ? "text-green-800"
                                    : "text-gray-800"
                                }`}
                              >
                                {activity.isCompleted ? "Completed" : "Pending"}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Category */}
                          <View className="mt-2">
                            <View className="bg-gray-100 px-2 py-1 rounded-full self-start">
                              <Text className="text-gray-600 text-xs font-medium capitalize">
                                {activity.category}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="items-center py-8">
                    <Feather name="calendar" size={32} color={colors.muted} />
                    <Text className="text-gray-500 mt-2">
                      No activities planned for this day
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-red-600 py-3 rounded-xl">
              <Text className="text-white text-center font-semibold">
                Edit Trip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white border border-gray-300 py-3 rounded-xl">
              <Text className="text-gray-700 text-center font-semibold">
                Share Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
