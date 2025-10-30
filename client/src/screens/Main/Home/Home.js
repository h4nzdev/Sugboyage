import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle } from "react-native-maps";
import MainHeader from "../../../components/Header/MainHeader";

export default function Home() {
  // Cebu-specific locations for geofencing
  const popularSpots = [
    {
      id: 1,
      name: "Temple of Leah",
      latitude: 10.3567,
      longitude: 123.8756,
      type: "historical",
      distance: "15 min",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Magellan's Cross",
      latitude: 10.294,
      longitude: 123.9022,
      type: "cultural",
      distance: "20 min",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Kawasan Falls",
      latitude: 9.8167,
      longitude: 123.3833,
      type: "adventure",
      distance: "2.5 hrs",
      rating: 4.9,
    },
  ];

  // User's current location in Cebu
  const userLocation = {
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Clean Header - SugVoyage Branded */}
        <MainHeader />
        {/* Quick Access - Travel Focused */}
        <View className="px-5 mb-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {[
              { icon: "map-pin", name: "Near Me", color: "#EF4444" },
              { icon: "camera", name: "Scan Place", color: "#8B5CF6" },
              { icon: "compass", name: "Discover", color: "#10B981" },
              { icon: "message-circle", name: "AI Guide", color: "#F59E0B" },
              { icon: "calendar", name: "Plan Trip", color: "#3B82F6" },
            ].map((item, index) => (
              <TouchableOpacity key={index} className="items-center">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-2 border border-gray-200"
                  style={{ backgroundColor: item.color + "08" }}
                >
                  <Feather name={item.icon} size={24} color={item.color} />
                </View>
                <Text className="text-gray-900 text-xs font-semibold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Travel Assistant Card */}
        <View className="px-5 mb-5">
          <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-emerald-500 rounded-lg items-center justify-center mr-2">
                  <Feather name="cpu" size={16} color="#fff" />
                </View>
                <Text className="text-gray-900 font-bold text-base">
                  AI Travel Assistant
                </Text>
              </View>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-gray-600 text-sm mr-1">Details</Text>
                <Feather name="chevron-right" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between">
              {[
                { icon: "navigation", name: "Smart Routes", color: "#059669" },
                { icon: "shield", name: "Safety Check", color: "#F97316" },
                { icon: "gift", name: "Local Deals", color: "#F59E0B" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center"
                  style={{ width: "30%" }}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mb-2 border border-emerald-200"
                    style={{ backgroundColor: item.color + "15" }}
                  >
                    <Feather name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text className="text-gray-700 text-xs text-center font-medium">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-emerald-100">
              <View>
                <Text className="text-gray-900 font-semibold text-sm">
                  Ready to explore?
                </Text>
                <Text className="text-gray-600 text-xs">
                  Get personalized recommendations
                </Text>
              </View>
              <TouchableOpacity className="bg-emerald-500 px-4 py-2 rounded-lg">
                <Text className="text-white text-sm font-semibold">Ask AI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab Navigation - Travel Focused */}
        <View className="px-5 mb-4">
          <View className="flex-row">
            <TouchableOpacity className="mr-6">
              <Text className="text-gray-900 font-bold text-base mb-1">
                Nearby
              </Text>
              <View className="h-1 bg-emerald-500 rounded-full" />
            </TouchableOpacity>
            <TouchableOpacity className="mr-6">
              <Text className="text-gray-500 font-medium text-base">
                Popular
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-500 font-medium text-base">
                Adventures
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Map Section */}
        <View className="px-5 mb-5">
          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <View className="h-72">
              <MapView
                style={{ flex: 1 }}
                initialRegion={userLocation}
                showsUserLocation={true}
                className="rounded-2xl"
              >
                {/* Geofence circle - Core feature! */}
                <Circle
                  center={userLocation}
                  radius={1000}
                  strokeWidth={2}
                  strokeColor="#059669"
                  fillColor="rgba(5, 150, 105, 0.1)"
                />

                {/* Cebu spots markers */}
                {popularSpots.map((spot) => (
                  <Marker
                    key={spot.id}
                    coordinate={{
                      latitude: spot.latitude,
                      longitude: spot.longitude,
                    }}
                    title={spot.name}
                  >
                    <View className="bg-emerald-600 p-3 rounded-2xl shadow-lg border-2 border-white">
                      <View className="flex-row items-center">
                        <Feather name="map-pin" size={14} color="#fff" />
                        <Text className="text-white text-xs font-bold ml-1">
                          {spot.distance}
                        </Text>
                      </View>
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>

            {/* Map Controls */}
            <View className="p-4 border-t border-gray-100">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-semibold">
                  Live Geofencing Active
                </Text>
                <View className="flex-row items-center bg-emerald-100 px-3 py-1 rounded-full">
                  <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></View>
                  <Text className="text-emerald-700 text-xs font-bold">
                    5 SPOTS NEARBY
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Discover Cebu Cards */}
        <View className="px-5 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-gray-900">
              Must-Visit in Cebu
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-emerald-600 font-semibold text-sm mr-1">
                View All
              </Text>
              <Feather name="arrow-right" size={16} color="#059669" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {popularSpots.map((spot, index) => (
              <TouchableOpacity
                key={spot.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                style={{ width: 280 }}
              >
                <View className="h-40 bg-gradient-to-r from-emerald-500 to-green-600 relative">
                  <View className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                    <Text className="text-gray-900 font-bold text-xs">
                      {spot.distance}
                    </Text>
                  </View>
                  <View className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold text-xs">
                      {spot.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-gray-900 font-black text-lg mb-1">
                        {spot.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {spot.type.charAt(0).toUpperCase() + spot.type.slice(1)}{" "}
                        Destination
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-yellow-100 px-2 py-1 rounded">
                      <Feather name="star" size={12} color="#F59E0B" />
                      <Text className="text-yellow-800 font-bold text-sm ml-1">
                        {spot.rating}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="map-pin" size={12} color="#6B7280" />
                    <Text className="text-gray-600 text-xs ml-1">
                      Tap for directions & details
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Local Deals Section */}
        <View className="px-5 mb-6">
          <View className="bg-amber-500 rounded-2xl p-5 border-2 border-amber-400">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="bg-white px-3 py-1 rounded-full mr-2">
                    <Text className="text-amber-600 text-xs font-black">
                      🔥 LIMITED
                    </Text>
                  </View>
                  <Text className="text-white text-sm font-medium">
                    Exclusive Deal
                  </Text>
                </View>
                <Text className="text-white font-black text-2xl mb-1">
                  20% OFF
                </Text>
                <Text className="text-white text-base opacity-90">
                  Selected tours & restaurants in Cebu
                </Text>
              </View>
              <View className="bg-white p-3 rounded-2xl">
                <Feather name="gift" size={24} color="#F59E0B" />
              </View>
            </View>
          </View>
        </View>

        {/* Community Activity */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-black text-gray-900 mb-4">
            Live from Community
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-gray-200">
            {[
              {
                user: "Sarah M.",
                action: "just visited Kawasan Falls",
                time: "2 min ago",
              },
              {
                user: "Mike T.",
                action: "shared a travel tip in Cebu City",
                time: "15 min ago",
              },
              {
                user: "Local Guide",
                action: "added new hidden spot in Mactan",
                time: "1 hour ago",
              },
            ].map((activity, index) => (
              <View
                key={index}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                  <Feather name="user" size={16} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-sm">
                    <Text className="font-black">{activity.user}</Text>{" "}
                    {activity.action}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
