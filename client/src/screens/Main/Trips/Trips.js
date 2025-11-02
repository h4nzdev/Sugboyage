import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";

export default function Trips() {
  const [activeTab, setActiveTab] = useState("plans");

  // Simplified, clean data
  const plans = [
    {
      id: 1,
      title: "Cebu Adventure",
      type: "AI Recommended",
      duration: "3 days",
      spots: 8,
      budget: "₱8,500",
      match: 98,
      color: "#10B981",
    },
    {
      id: 2,
      title: "Cultural Heritage",
      type: "AI Recommended",
      duration: "2 days",
      spots: 6,
      budget: "₱4,200",
      match: 92,
      color: "#8B5CF6",
    },
  ];

  const myTrips = [
    {
      id: 3,
      title: "Food Journey",
      date: "Dec 15-17",
      spots: 5,
      progress: 2,
      status: "active",
    },
    {
      id: 4,
      title: "Beach Weekend",
      date: "Jan 5-7",
      spots: 4,
      progress: 4,
      status: "completed",
    },
  ];

  const tabs = [
    { id: "plans", label: "AI Plans", icon: "cpu", count: plans.length },
    { id: "trips", label: "My Trips", icon: "map", count: myTrips.length },
    { id: "saved", label: "Saved", icon: "bookmark", count: 3 },
  ];

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      {/* Clean Header */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-gray-900">Trips</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Your Cebu travel plans
            </Text>
          </View>
          <TouchableOpacity className="bg-emerald-500 w-10 h-10 rounded-xl items-center justify-center">
            <Feather name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Minimal Tab Navigation */}
      <View className="px-5 border-b border-gray-100">
        <View className="flex-row">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === tab.id
                  ? "border-emerald-500"
                  : "border-transparent"
              }`}
            >
              <View className="flex-row items-center">
                <Feather
                  name={tab.icon}
                  size={16}
                  color={activeTab === tab.id ? "#059669" : "#6B7280"}
                />
                <Text
                  className={`ml-2 font-medium text-sm ${
                    activeTab === tab.id ? "text-emerald-600" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View className="ml-1 bg-gray-200 px-1.5 rounded-full">
                    <Text className="text-gray-600 text-xs font-medium">
                      {tab.count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* AI PLANS - Clean Cards */}
        {activeTab === "plans" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Recommended Plans
            </Text>

            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className="bg-white rounded-2xl p-5 mb-4 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className="bg-emerald-100 px-2 py-1 rounded-full">
                        <Text className="text-emerald-700 text-xs font-medium">
                          {plan.type}
                        </Text>
                      </View>
                      <View className="bg-purple-100 px-2 py-1 rounded-full ml-2">
                        <Text className="text-purple-700 text-xs font-medium">
                          {plan.match}% match
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {plan.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {plan.duration} • {plan.spots} locations
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 font-semibold">
                    {plan.budget}
                  </Text>
                  <TouchableOpacity className="bg-emerald-500 px-4 py-2 rounded-lg">
                    <Text className="text-white text-sm font-semibold">
                      Use Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {/* Create New Plan CTA */}
            <TouchableOpacity className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-300 items-center">
              <View className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center mb-3">
                <Feather name="cpu" size={20} color="#FFFFFF" />
              </View>
              <Text className="text-gray-900 font-semibold text-center">
                Create AI Plan
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                Get personalized itinerary
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MY TRIPS - Clean Cards */}
        {activeTab === "trips" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              My Trips
            </Text>

            {myTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                className="bg-white rounded-2xl p-5 mb-4 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View
                        className={`px-2 py-1 rounded-full ${
                          trip.status === "active"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            trip.status === "active"
                              ? "text-blue-700"
                              : "text-green-700"
                          }`}
                        >
                          {trip.status === "active" ? "ACTIVE" : "COMPLETED"}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {trip.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {trip.date} • {trip.spots} spots
                    </Text>
                  </View>
                </View>

                {/* Progress */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700 text-sm">Progress</Text>
                    <Text className="text-gray-900 text-sm font-medium">
                      {trip.progress}/{trip.spots}
                    </Text>
                  </View>
                  <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${(trip.progress / trip.spots) * 100}%`,
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity className="bg-gray-100 py-3 rounded-xl">
                  <Text className="text-gray-900 text-center font-semibold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Empty State for No Trips */}
            {myTrips.length === 0 && (
              <View className="items-center py-10">
                <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center mb-4">
                  <Feather name="map" size={24} color="#9CA3AF" />
                </View>
                <Text className="text-gray-900 font-semibold text-lg mb-2">
                  No trips yet
                </Text>
                <Text className="text-gray-500 text-sm text-center">
                  Create your first Cebu adventure with AI
                </Text>
              </View>
            )}
          </View>
        )}

        {/* SAVED PLANS */}
        {activeTab === "saved" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Saved Plans
            </Text>

            <View className="items-center py-10">
              <View className="w-16 h-16 bg-gray-100 rounded-2xl items-center justify-center mb-4">
                <Feather name="bookmark" size={24} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 font-semibold text-lg mb-2">
                No saved plans
              </Text>
              <Text className="text-gray-500 text-sm text-center">
                Save AI plans you like for later
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
