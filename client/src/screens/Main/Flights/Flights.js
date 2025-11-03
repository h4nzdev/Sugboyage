import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

export default function Flights() {
  const [activeTab, setActiveTab] = useState("myFlights");
  const [flightNumber, setFlightNumber] = useState("");

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

  const myFlights = [
    {
      id: 1,
      airline: "Cebu Pacific",
      flight: "5J 123",
      route: "Manila → Cebu",
      date: "Dec 15, 2024",
      time: "08:00 AM - 09:30 AM",
      terminal: "T2",
      status: "confirmed",
    },
    {
      id: 2,
      airline: "Philippine Airlines",
      flight: "PR 456",
      route: "Cebu → Tokyo",
      date: "Jan 20, 2024",
      time: "02:00 PM - 08:00 PM",
      terminal: "T1",
      status: "confirmed",
    },
  ];

  const layoverIdeas = [
    {
      id: 1,
      title: "Mactan Shrine",
      time: "1-2 hours",
      budget: "₱500",
      type: "cultural",
      distance: "15min from airport",
    },
    {
      id: 2,
      title: "Airport Lounge",
      time: "2 hours",
      budget: "₱800",
      type: "relax",
      distance: "In terminal",
    },
    {
      id: 3,
      title: "Local Food Tour",
      time: "1.5 hours",
      budget: "₱600",
      type: "food",
      distance: "10min from airport",
    },
  ];

  const tabs = [
    { id: "myFlights", label: "My Flights", icon: "airplay" },
    { id: "layovers", label: "Layovers", icon: "clock" },
    { id: "deals", label: "Deals", icon: "tag" },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      {/* Clean Header */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Flights
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.muted }}>
              Flight plans & layovers
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.light }}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple Flight Input */}
      <View className="px-5 mt-4">
        <View
          className="rounded-xl p-4"
          style={{ backgroundColor: colors.light }}
        >
          <Text className="font-semibold mb-3" style={{ color: colors.text }}>
            Track Your Flight
          </Text>
          <View className="flex-row">
            <TextInput
              placeholder="Flight number (e.g., 5J 123)"
              className="flex-1 bg-white rounded-xl px-4 py-3 mr-2 text-sm"
              style={{ color: colors.text }}
              value={flightNumber}
              onChangeText={setFlightNumber}
              placeholderTextColor={colors.muted}
            />
            <TouchableOpacity
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Feather name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Minimal Tabs */}
      <View
        className="px-5 mt-6 border-b"
        style={{ borderColor: colors.border }}
      >
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
        {/* MY FLIGHTS */}
        {activeTab === "myFlights" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Upcoming Flights
            </Text>

            {myFlights.map((flight) => (
              <TouchableOpacity
                key={flight.id}
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
                      {flight.airline}
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
                      {flight.terminal}
                    </Text>
                  </View>
                </View>

                <Text
                  className="font-bold text-base mb-1"
                  style={{ color: colors.text }}
                >
                  {flight.flight} • {flight.route}
                </Text>
                <Text className="text-sm mb-2" style={{ color: colors.muted }}>
                  {flight.date}
                </Text>
                <Text
                  className="font-semibold text-sm mb-4"
                  style={{ color: colors.text }}
                >
                  {flight.time}
                </Text>

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

            {/* Add Flight */}
            <TouchableOpacity
              className="rounded-xl p-5 border-2 border-dashed items-center"
              style={{ borderColor: colors.border }}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: colors.light }}
              >
                <Feather name="plus" size={20} color={colors.primary} />
              </View>
              <Text
                className="font-semibold text-center mb-1"
                style={{ color: colors.text }}
              >
                Add Flight
              </Text>
              <Text
                className="text-sm text-center"
                style={{ color: colors.muted }}
              >
                Track your upcoming flights
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* LAYOVER IDEAS */}
        {activeTab === "layovers" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Layover Ideas
            </Text>

            {layoverIdeas.map((idea) => (
              <TouchableOpacity
                key={idea.id}
                className="bg-white rounded-xl p-4 mb-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  className="font-bold text-base mb-1"
                  style={{ color: colors.text }}
                >
                  {idea.title}
                </Text>
                <Text className="text-sm mb-2" style={{ color: colors.muted }}>
                  {idea.time} • {idea.budget}
                </Text>
                <Text className="text-xs mb-4" style={{ color: colors.muted }}>
                  {idea.distance}
                </Text>

                <TouchableOpacity
                  className="py-3 rounded-xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-center font-semibold">
                    View Plan
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* AI Layover Planner */}
            <TouchableOpacity
              className="rounded-xl p-4 border-2 items-center"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.light,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Feather name="cpu" size={20} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-semibold"
                    style={{ color: colors.text }}
                  >
                    AI Layover Planner
                  </Text>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    Get personalized layover plan
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* DEALS */}
        {activeTab === "deals" && (
          <View className="px-5 mt-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Airport Deals
            </Text>

            <View className="gap-4">
              <View
                className="bg-white rounded-xl p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  className="font-semibold mb-1"
                  style={{ color: colors.text }}
                >
                  Free SIM Card
                </Text>
                <Text className="text-sm mb-3" style={{ color: colors.muted }}>
                  1GB data for travelers
                </Text>
                <TouchableOpacity
                  className="py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-center font-semibold text-sm">
                    Claim Deal
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                className="bg-white rounded-xl p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  className="font-semibold mb-1"
                  style={{ color: colors.text }}
                >
                  20% Off Massage
                </Text>
                <Text className="text-sm mb-3" style={{ color: colors.muted }}>
                  Relax before your flight
                </Text>
                <TouchableOpacity
                  className="py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-center font-semibold text-sm">
                    Claim Deal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
