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

export default function Flights() {
  const [activeTab, setActiveTab] = useState("myFlights");
  const [flightNumber, setFlightNumber] = useState("");
  const [layoverTime, setLayoverTime] = useState("");

  // USER'S UPCOMING FLIGHTS
  const myFlights = [
    {
      id: 1,
      airline: "Cebu Pacific",
      flightNumber: "5J 123",
      route: "MANILA → CEBU → SINGAPORE",
      date: "Dec 15, 2024",
      departure: "08:00 AM",
      arrival: "09:30 AM",
      layover: "6h 15m",
      status: "confirmed",
      terminal: "T2",
      gate: "A5",
      activities: [
        "MCIA Lounge access",
        "Mactan Shrine (15min away)",
        "Local food court",
      ],
    },
    {
      id: 2,
      airline: "Philippine Airlines",
      flightNumber: "PR 456",
      route: "CEBU → TOKYO",
      date: "Jan 20, 2024",
      departure: "02:00 PM",
      arrival: "08:00 PM",
      layover: "None",
      status: "confirmed",
      terminal: "T1",
      gate: "B2",
    },
  ];

  // LAYOVER ACTIVITIES SUGGESTIONS
  const layoverActivities = [
    {
      id: 1,
      title: "Quick Mactan Adventure",
      timeRequired: "2-3 hours",
      distance: "15 min from MCIA",
      spots: ["Mactan Shrine", "Local Eateries", "Souvenir Shops"],
      budget: "₱800",
      type: "cultural",
    },
    {
      id: 2,
      title: "Airport Relaxation",
      timeRequired: "1-2 hours",
      distance: "Inside MCIA",
      spots: ["Spa Treatment", "Lounge Access", "Duty Free Shopping"],
      budget: "₱1,200",
      type: "relax",
    },
    {
      id: 3,
      title: "Food Tour",
      timeRequired: "1.5 hours",
      distance: "5-10 min from MCIA",
      spots: ["Local Lechon", "Seafood Market", "Coffee Shops"],
      budget: "₱600",
      type: "food",
    },
  ];

  // MCIA AIRPORT DEALS
  const airportDeals = [
    {
      id: 1,
      title: "Free SIM Card",
      description: "1GB data for international travelers",
      location: "Terminal 2, Arrival Area",
      partner: "Smart Communications",
      validUntil: "Dec 31, 2024",
    },
    {
      id: 2,
      title: "20% Off Massage",
      description: "Relaxing massage before your flight",
      location: "Terminal 1, Departure Area",
      partner: "MCIA Spa",
      validUntil: "Ongoing",
    },
    {
      id: 3,
      title: "Buy 1 Get 1 Coffee",
      description: "At any airport coffee shop",
      location: "All Terminals",
      partner: "SugVoyage Partners",
      validUntil: "Jan 15, 2024",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-3 pb-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-1">
            <View>
              <Text className="text-2xl font-black text-gray-900">
                Flight Assistant
              </Text>
              <Text className="text-emerald-600 text-sm font-medium">
                Smart layovers & airport guides
              </Text>
            </View>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
              <Feather name="search" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Flight Input Section */}
        <View className="px-5 mt-4">
          <View className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200">
            <Text className="text-emerald-900 font-black text-lg mb-3">
              Add Your Flight
            </Text>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-emerald-800 text-sm font-medium mb-2">
                  Flight Number
                </Text>
                <TextInput
                  placeholder="e.g., 5J 123"
                  className="bg-white rounded-xl px-4 py-3 border border-emerald-300"
                  value={flightNumber}
                  onChangeText={setFlightNumber}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-emerald-800 text-sm font-medium mb-2">
                  Layover Time
                </Text>
                <TextInput
                  placeholder="e.g., 6 hours"
                  className="bg-white rounded-xl px-4 py-3 border border-emerald-300"
                  value={layoverTime}
                  onChangeText={setLayoverTime}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <TouchableOpacity className="bg-emerald-500 py-3 rounded-xl">
              <Text className="text-white text-center font-black text-sm">
                GENERATE LAYOVER PLAN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="px-5 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            className="py-2"
          >
            {[
              { id: "myFlights", label: "My Flights", count: myFlights.length },
              {
                id: "layovers",
                label: "Layover Ideas",
                count: layoverActivities.length,
              },
              {
                id: "deals",
                label: "Airport Deals",
                count: airportDeals.length,
              },
              { id: "airport", label: "MCIA Guide", count: 0 },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl ${
                  activeTab === tab.id ? "bg-emerald-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    activeTab === tab.id ? "text-white" : "text-gray-700"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MY FLIGHTS SECTION */}
        {activeTab === "myFlights" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Upcoming Flights
            </Text>

            {myFlights.map((flight) => (
              <TouchableOpacity
                key={flight.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                {/* Flight Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-green-100 px-2 py-1 rounded-full mr-2">
                        <Text className="text-green-700 text-xs font-black">
                          CONFIRMED
                        </Text>
                      </View>
                      <Text className="text-emerald-600 text-xs font-bold">
                        {flight.airline}
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-black text-lg">
                      {flight.flightNumber}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {flight.route}
                    </Text>
                  </View>
                  <Feather name="airplay" size={20} color="#3B82F6" />
                </View>

                {/* Flight Details */}
                <View className="flex-row justify-between mb-3">
                  <View className="items-center">
                    <Text className="text-gray-900 font-black text-lg">
                      {flight.departure}
                    </Text>
                    <Text className="text-gray-500 text-xs">Departure</Text>
                  </View>
                  <View className="items-center">
                    <Feather name="arrow-right" size={16} color="#6B7280" />
                    {flight.layover !== "None" && (
                      <Text className="text-orange-600 text-xs font-bold mt-1">
                        {flight.layover} layover
                      </Text>
                    )}
                  </View>
                  <View className="items-center">
                    <Text className="text-gray-900 font-black text-lg">
                      {flight.arrival}
                    </Text>
                    <Text className="text-gray-500 text-xs">Arrival</Text>
                  </View>
                </View>

                {/* Airport Info */}
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <Feather name="map-pin" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      Terminal {flight.terminal}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="flag" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      Gate {flight.gate}
                    </Text>
                  </View>
                </View>

                {/* Layover Activities */}
                {flight.activities && (
                  <View className="border-t border-gray-100 pt-3">
                    <Text className="text-gray-700 text-sm font-medium mb-2">
                      Layover Suggestions:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {flight.activities.map((activity, index) => (
                        <View
                          key={index}
                          className="bg-emerald-50 px-3 py-1 rounded-full mr-2 mb-1"
                        >
                          <Text className="text-emerald-700 text-xs">
                            📍 {activity}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row justify-between mt-3">
                  <TouchableOpacity className="flex-1 bg-emerald-500 py-2 rounded-xl mr-2">
                    <Text className="text-white text-center font-bold text-sm">
                      VIEW DETAILS
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-xl">
                    <Text className="text-gray-700 text-center font-bold text-sm">
                      SHARE
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* LAYOVER IDEAS SECTION */}
        {activeTab === "layovers" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              Layover Activities
            </Text>

            {layoverActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View
                        className={`px-2 py-1 rounded-full mr-2 ${
                          activity.type === "cultural"
                            ? "bg-orange-100"
                            : activity.type === "relax"
                              ? "bg-green-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-black ${
                            activity.type === "cultural"
                              ? "text-orange-700"
                              : activity.type === "relax"
                                ? "text-green-700"
                                : "text-yellow-700"
                          }`}
                        >
                          {activity.type.toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-emerald-600 text-xs font-bold">
                        {activity.timeRequired}
                      </Text>
                    </View>
                    <Text className="text-gray-900 font-black text-lg mb-1">
                      {activity.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Feather name="clock" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {activity.distance}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Spots */}
                <View className="mb-3">
                  <Text className="text-gray-700 text-sm font-medium mb-2">
                    Includes:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {activity.spots.map((spot, index) => (
                      <View
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-1"
                      >
                        <Text className="text-gray-700 text-xs">📍 {spot}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 font-black text-lg">
                    {activity.budget}
                  </Text>
                  <TouchableOpacity className="bg-emerald-500 px-4 py-2 rounded-xl">
                    <Text className="text-white text-sm font-bold">
                      USE THIS PLAN
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* AIRPORT DEALS SECTION */}
        {activeTab === "deals" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              MCIA Exclusive Deals
            </Text>

            {airportDeals.map((deal) => (
              <TouchableOpacity
                key={deal.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-black text-lg mb-1">
                      {deal.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-2">
                      {deal.description}
                    </Text>

                    <View className="flex-row items-center mb-1">
                      <Feather name="map-pin" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {deal.location}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Feather name="star" size={14} color="#F59E0B" />
                      <Text className="text-gray-600 text-sm ml-1">
                        Partner: {deal.partner}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-green-600 text-sm font-bold">
                    Valid until {deal.validUntil}
                  </Text>
                  <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-xl">
                    <Text className="text-white text-sm font-bold">
                      CLAIM DEAL
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* MCIA GUIDE SECTION */}
        {activeTab === "airport" && (
          <View className="px-5 mt-4">
            <Text className="text-lg font-black text-gray-900 mb-4">
              MCIA Airport Guide
            </Text>

            <View className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200 mb-4">
              <Text className="text-emerald-900 font-black text-lg mb-2">
                Mactan-Cebu International Airport
              </Text>
              <Text className="text-emerald-800 text-sm mb-3">
                Your gateway to exploring Cebu. We'll help you make the most of
                your time here!
              </Text>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Feather name="wifi" size={20} color="#3B82F6" />
                  <Text className="text-emerald-900 text-xs font-bold mt-1">
                    Free WiFi
                  </Text>
                </View>
                <View className="items-center">
                  <Feather name="coffee" size={20} color="#3B82F6" />
                  <Text className="text-emerald-900 text-xs font-bold mt-1">
                    24/7 Food
                  </Text>
                </View>
                <View className="items-center">
                  <Feather name="dollar-sign" size={20} color="#3B82F6" />
                  <Text className="text-emerald-900 text-xs font-bold mt-1">
                    Currency Exchange
                  </Text>
                </View>
                <View className="items-center">
                  <Feather name="briefcase" size={20} color="#3B82F6" />
                  <Text className="text-emerald-900 text-xs font-bold mt-1">
                    Luggage Storage
                  </Text>
                </View>
              </View>
            </View>

            {/* Emergency Info */}
            <View className="bg-red-50 rounded-2xl p-5 border-2 border-red-200">
              <Text className="text-red-900 font-black text-lg mb-2">
                Emergency Contacts
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-red-800 text-sm">Airport Police</Text>
                  <Text className="text-red-900 font-bold">(032) 340-2486</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-red-800 text-sm">
                    Medical Emergency
                  </Text>
                  <Text className="text-red-900 font-bold">(032) 340-2488</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-red-800 text-sm">Lost & Found</Text>
                  <Text className="text-red-900 font-bold">(032) 340-2490</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* AI Assistant CTA */}
        <View className="px-5 mt-6 mb-8">
          <TouchableOpacity className="bg-purple-500 rounded-2xl p-5 border-2 border-purple-400">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-white p-3 rounded-2xl mr-3">
                  <Feather name="cpu" size={24} color="#7C3AED" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-black text-lg">
                    AI Layover Assistant
                  </Text>
                  <Text className="text-white text-sm opacity-90">
                    Get personalized layover plan based on your flight details
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
