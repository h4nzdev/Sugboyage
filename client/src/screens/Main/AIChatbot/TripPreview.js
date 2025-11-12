import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

const TripPreviewModal = ({ tripData, onSave, loading, visible, onClose }) => {
  // Calculate total activities
  const totalActivities =
    tripData?.days?.reduce((total, day) => {
      const activities = day.activities || [];
      return total + activities.length;
    }, 0) || 0;

  // Safe data access functions
  const getDayActivities = (day) => {
    if (!day) return [];
    if (Array.isArray(day.activities)) {
      return day.activities;
    }
    return [];
  };

  const getActivityName = (activity) => {
    if (typeof activity === "string") return activity;
    if (activity && typeof activity === "object") {
      return activity.name || "Activity";
    }
    return "Activity";
  };

  const getActivityTime = (activity) => {
    if (typeof activity === "string") return "";
    if (activity && typeof activity === "object") {
      return activity.time || "";
    }
    return "";
  };

  const getActivityCost = (activity) => {
    if (typeof activity === "string") return "";
    if (activity && typeof activity === "object") {
      return activity.cost || "";
    }
    return "";
  };

  if (!tripData) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-2xl font-black text-gray-900">
                Trip Preview
              </Text>
              <Text className="text-red-600 text-sm font-medium">
                Review your itinerary before saving
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
            >
              <Feather name="x" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Trip Header */}
            <View className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100">
              <Text className="text-xl font-black text-gray-900 mb-2">
                {tripData.title}
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-row items-center">
                  <Feather name="calendar" size={14} color="#DC2626" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {tripData.duration?.days || 0} days
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="map-pin" size={14} color="#DC2626" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {totalActivities} activities
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="dollar-sign" size={14} color="#DC2626" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {tripData.budget?.total || "Flexible"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Itinerary */}
            <Text className="text-lg font-black text-gray-900 mb-4">
              Daily Itinerary
            </Text>

            {tripData.days && tripData.days.length > 0 ? (
              tripData.days.map((day, index) => {
                const activities = getDayActivities(day);

                return (
                  <View
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 p-4 mb-4"
                  >
                    {/* Day Header */}
                    <View className="flex-row items-center mb-4">
                      <View className="w-8 h-8 bg-red-600 rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold text-sm">
                          {index + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-black text-gray-900 text-base">
                          Day {index + 1}
                        </Text>
                        <Text className="text-red-600 font-medium text-sm">
                          {day.theme}
                        </Text>
                      </View>
                    </View>

                    {/* Activities */}
                    {activities.map((activity, activityIndex) => (
                      <View
                        key={activityIndex}
                        className="flex-row mb-4 last:mb-0"
                      >
                        {/* Timeline */}
                        <View className="relative mr-4 items-center">
                          <View className="w-2.5 h-2.5 bg-red-600 rounded-full mt-2 z-10" />
                          {activityIndex < activities.length - 1 && (
                            <View className="absolute top-4 left-1 w-0.5 h-8 bg-gray-300" />
                          )}
                        </View>

                        {/* Activity Content */}
                        <View className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                          <View className="flex-row justify-between items-start mb-1">
                            <Text className="font-semibold text-gray-900 text-sm flex-1">
                              {getActivityName(activity)}
                            </Text>
                            <Text className="text-gray-500 text-xs">
                              {getActivityTime(activity)}
                            </Text>
                          </View>

                          {getActivityCost(activity) && (
                            <View className="flex-row items-center mt-1">
                              <Text className="text-gray-500 text-xs">
                                {getActivityCost(activity)}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })
            ) : (
              <View className="bg-white rounded-2xl border border-gray-200 p-8 items-center">
                <Feather name="calendar" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                  No itinerary available
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-6 mb-8">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-white border border-gray-300 py-4 rounded-xl"
              >
                <Text className="text-gray-700 font-semibold text-center text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                disabled={loading}
                className={`flex-1 py-4 rounded-xl ${
                  loading ? "bg-gray-400" : "bg-red-600"
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {loading ? (
                    <Feather name="loader" size={20} color="white" />
                  ) : (
                    <Feather name="download" size={20} color="white" />
                  )}
                  <Text className="text-white font-semibold text-base ml-2">
                    {loading ? "Saving..." : "Save Trip"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-xs text-center">
              ✨ This itinerary will be saved to your Travel Hub
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TripPreviewModal;
