import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

export default function Trips() {
  const [activeTab, setActiveTab] = useState("plans");

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

  const plans = [
    {
      id: 1,
      title: "Cebu Adventure",
      type: "AI Recommended",
      duration: "3 days",
      spots: 8,
      budget: "₱8,500",
      match: 98,
    },
    {
      id: 2,
      title: "Cultural Heritage",
      type: "AI Recommended",
      duration: "2 days",
      spots: 6,
      budget: "₱4,200",
      match: 92,
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
    { id: "plans", label: "AI Plans", icon: "cpu" },
    { id: "trips", label: "My Trips", icon: "map" },
    { id: "saved", label: "Saved", icon: "bookmark" },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      {/* Clean Header */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Trips
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.muted }}>
              Your Cebu travel plans
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Minimal Tab Navigation */}
      <View className="px-5 border-b" style={{ borderColor: colors.border }}>
        <View className="flex-row">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 items-center border-b-2 ${
                activeTab === tab.id ? "border-cyan-500" : "border-transparent"
              }`}
            >
              <View className="flex-row items-center">
                <Feather
                  name={tab.icon}
                  size={16}
                  color={activeTab === tab.id ? colors.primary : colors.muted}
                />
                <Text
                  className={`ml-2 text-sm font-semibold ${
                    activeTab === tab.id ? "text-cyan-600" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </Text>
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
        {/* AI PLANS */}
        {activeTab === "plans" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Recommended Plans
            </Text>

            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className="bg-white rounded-xl p-4 mb-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View
                    className="px-3 py-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.light }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {plan.type}
                    </Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.light }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {plan.match}% match
                    </Text>
                  </View>
                </View>

                <Text
                  className="font-bold text-base mb-2"
                  style={{ color: colors.text }}
                >
                  {plan.title}
                </Text>
                <Text className="text-sm mb-4" style={{ color: colors.muted }}>
                  {plan.duration} • {plan.spots} locations
                </Text>

                <View className="flex-row justify-between items-center">
                  <Text
                    className="font-semibold"
                    style={{ color: colors.text }}
                  >
                    {plan.budget}
                  </Text>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white text-sm font-semibold">
                      Use Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {/* Create New Plan */}
            <TouchableOpacity
              className="bg-white rounded-xl p-5 border-2 border-dashed items-center"
              style={{ borderColor: colors.border }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: colors.light }}
              >
                <Feather name="cpu" size={20} color={colors.primary} />
              </View>
              <Text
                className="font-semibold text-center mb-1"
                style={{ color: colors.text }}
              >
                Create AI Plan
              </Text>
              <Text
                className="text-sm text-center"
                style={{ color: colors.muted }}
              >
                Get personalized itinerary
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MY TRIPS */}
        {activeTab === "trips" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              My Trips
            </Text>

            {myTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                className="bg-white rounded-xl p-4 mb-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      trip.status === "active" ? "bg-cyan-100" : "bg-green-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        trip.status === "active"
                          ? "text-cyan-700"
                          : "text-green-700"
                      }`}
                    >
                      {trip.status === "active" ? "ACTIVE" : "COMPLETED"}
                    </Text>
                  </View>
                </View>

                <Text
                  className="font-bold text-base mb-1"
                  style={{ color: colors.text }}
                >
                  {trip.title}
                </Text>
                <Text className="text-sm mb-4" style={{ color: colors.muted }}>
                  {trip.date} • {trip.spots} spots
                </Text>

                {/* Progress */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm" style={{ color: colors.muted }}>
                      Progress
                    </Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: colors.text }}
                    >
                      {trip.progress}/{trip.spots}
                    </Text>
                  </View>
                  <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${(trip.progress / trip.spots) * 100}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className="py-3 rounded-xl"
                  style={{ backgroundColor: colors.light }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: colors.primary }}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SAVED PLANS */}
        {activeTab === "saved" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Saved Plans
            </Text>

            <View className="items-center py-10">
              <View
                className="w-16 h-16 rounded-xl items-center justify-center mb-4"
                style={{ backgroundColor: colors.light }}
              >
                <Feather name="bookmark" size={24} color={colors.primary} />
              </View>
              <Text
                className="font-semibold text-lg mb-2"
                style={{ color: colors.text }}
              >
                No saved plans
              </Text>
              <Text
                className="text-sm text-center"
                style={{ color: colors.muted }}
              >
                Save AI plans you like for later
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
