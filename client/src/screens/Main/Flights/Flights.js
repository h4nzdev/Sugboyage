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

export default function Flights() {
  const [activeTab, setActiveTab] = useState("myFlights");
  const [flightNumber, setFlightNumber] = useState("");

  // Simplified data
  const myFlights = [
    {
      id: 1,
      airline: "Cebu Pacific",
      flight: "5J 123",
      route: "Manila → Cebu → Singapore",
      date: "Dec 15, 2024",
      time: "08:00 AM - 09:30 AM",
      layover: "6h 15m",
      status: "confirmed",
    },
    {
      id: 2,
      airline: "Philippine Airlines",
      flight: "PR 456",
      route: "Cebu → Tokyo",
      date: "Jan 20, 2024",
      time: "02:00 PM - 08:00 PM",
      layover: "None",
      status: "confirmed",
    },
  ];

  const layoverIdeas = [
    {
      id: 1,
      title: "Mactan Shrine Visit",
      time: "1-2 hours",
      budget: "₱500",
      type: "cultural",
    },
    {
      id: 2,
      title: "Airport Relaxation",
      time: "1-2 hours",
      budget: "₱1,200",
      type: "relax",
    },
    {
      id: 3,
      title: "Local Food Tour",
      time: "1.5 hours",
      budget: "₱600",
      type: "food",
    },
  ];

  const tabs = [
    { id: "myFlights", label: "My Flights", count: myFlights.length },
    { id: "layovers", label: "Layovers", count: layoverIdeas.length },
    { id: "deals", label: "Deals", count: 3 },
  ];

  return (
    <SafeAreaWrapper className="flex-1 bg-white">
      {/* Clean Header */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-black text-gray-900">Flights</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Flight plans & layovers
            </Text>
          </View>
          <TouchableOpacity className="bg-gray-100 w-10 h-10 rounded-xl items-center justify-center">
            <Feather name="search" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Simple Flight Input */}
      <View className="px-5 mt-4">
        <View className="bg-gray-50 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold mb-3">
            Track Your Flight
          </Text>
          <View className="flex-row">
            <TextInput
              placeholder="Flight number (e.g., 5J 123)"
              className="flex-1 bg-white rounded-xl px-4 py-3 border border-gray-200 mr-2"
              value={flightNumber}
              onChangeText={setFlightNumber}
            />
            <TouchableOpacity className="bg-emerald-500 w-12 h-12 rounded-xl items-center justify-center">
              <Feather name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Minimal Tabs */}
      <View className="px-5 mt-6 border-b border-gray-100">
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
                <Text
                  className={`font-medium text-sm ${
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
        {/* MY FLIGHTS - Clean Cards */}
        {activeTab === "myFlights" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Upcoming Flights
            </Text>

            {myFlights.map((flight) => (
              <TouchableOpacity
                key={flight.id}
                className="bg-white rounded-2xl p-5 mb-4 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className="bg-emerald-100 px-2 py-1 rounded-full">
                        <Text className="text-emerald-700 text-xs font-medium">
                          {flight.airline}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {flight.flight}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {flight.route}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-gray-900 font-semibold">
                      {flight.time}
                    </Text>
                    <Text className="text-gray-500 text-sm">{flight.date}</Text>
                  </View>
                  {flight.layover !== "None" && (
                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="text-orange-700 text-xs font-medium">
                        {flight.layover} layover
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity className="bg-gray-100 py-3 rounded-xl">
                  <Text className="text-gray-900 text-center font-semibold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Add Flight CTA */}
            <TouchableOpacity className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-300 items-center">
              <View className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center mb-3">
                <Feather name="plus" size={20} color="#FFFFFF" />
              </View>
              <Text className="text-gray-900 font-semibold">Add Flight</Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                Track your upcoming flights
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* LAYOVER IDEAS - Clean Cards */}
        {activeTab === "layovers" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Layover Ideas
            </Text>

            {layoverIdeas.map((idea) => (
              <TouchableOpacity
                key={idea.id}
                className="bg-white rounded-2xl p-5 mb-4 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-lg mb-1">
                      {idea.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {idea.time} • {idea.budget}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity className="bg-emerald-500 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">
                    View Plan
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* AI Layover Planner */}
            <TouchableOpacity className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center mr-3">
                  <Feather name="cpu" size={20} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    AI Layover Planner
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Get personalized layover plan
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* DEALS - Clean Cards */}
        {activeTab === "deals" && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Airport Deals
            </Text>

            <View className="gap-4">
              <View className="bg-white rounded-2xl p-5 border border-gray-200">
                <Text className="text-gray-900 font-semibold mb-1">
                  Free SIM Card
                </Text>
                <Text className="text-gray-500 text-sm mb-3">
                  1GB data for travelers
                </Text>
                <TouchableOpacity className="bg-emerald-500 py-2 rounded-lg">
                  <Text className="text-white text-center font-semibold text-sm">
                    Claim Deal
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-2xl p-5 border border-gray-200">
                <Text className="text-gray-900 font-semibold mb-1">
                  20% Off Massage
                </Text>
                <Text className="text-gray-500 text-sm mb-3">
                  Relax before your flight
                </Text>
                <TouchableOpacity className="bg-emerald-500 py-2 rounded-lg">
                  <Text className="text-white text-center font-semibold text-sm">
                    Claim Deal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
