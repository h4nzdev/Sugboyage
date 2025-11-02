import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle } from "react-native-maps";
import MainHeader from "../../../components/Header/MainHeader";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";

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
      image:
        "https://w5x6j5c9.delivery.rocketcdn.me/wp-content/uploads/2024/06/temple-of-leah-building-front.jpg",
    },
    {
      id: 2,
      name: "Magellan's Cross",
      latitude: 10.294,
      longitude: 123.9022,
      type: "cultural",
      distance: "20 min",
      rating: 4.5,
      image:
        "https://w5x6j5c9.delivery.rocketcdn.me/wp-content/uploads/2024/03/magellan-cross-cebu-1024x768.jpg",
    },
    {
      id: 3,
      name: "Kawasan Falls",
      latitude: 9.8167,
      longitude: 123.3833,
      type: "adventure",
      distance: "2.5 hrs",
      rating: 4.9,
      image:
        "https://i0.wp.com/kawasanfalls.net/wp-content/uploads/2011/04/kawasan-falls-pana-4.jpg?w=1000&ssl=1",
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
    <SafeAreaWrapper className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Clean Header */}
        <MainHeader />

        {/* Hero Search Card */}
        <View className="px-5 mb-5">
          <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden">
            {/* Background Pattern */}
            <View className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-6 -mt-6 opacity-50" />
            <View className="absolute bottom-0 left-0 w-16 h-16 bg-amber-100 rounded-full -ml-4 -mb-4 opacity-50" />

            <View className="relative z-10">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-gray-900 font-black text-2xl mb-1">
                    Your Cebu Adventure Awaits!
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="bg-emerald-500 p-2 rounded-xl">
                  <Feather name="sun" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Weather & Conditions */}
              <View className="flex-row items-center bg-blue-50 rounded-xl p-3 mb-4">
                <Feather name="cloud" size={16} color="#3B82F6" />
                <Text className="text-blue-700 text-sm ml-2 flex-1">
                  Perfect day for beaches & waterfalls ☀️
                </Text>
                <Text className="text-blue-600 text-xs font-bold">28°C</Text>
              </View>

              {/* Quick Start Buttons */}
              <View className="flex-row" style={{ gap: 8 }}>
                <TouchableOpacity className="flex-1 bg-emerald-500 rounded-xl p-3 flex-row items-center justify-center">
                  <Feather name="compass" size={16} color="#FFFFFF" />
                  <Text className="text-white font-bold text-sm ml-2">
                    Start Exploring
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
                  <Feather name="zap" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Must-Visit Cards - MOVED UP! */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-black text-gray-900">
              Must-Visit in Cebu
            </Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 font-semibold text-sm">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {popularSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                style={{ width: 280 }}
              >
                <ImageBackground
                  source={{ uri: spot.image }}
                  resizeMode="cover"
                  className="h-40 rounded-xl overflow-hidden relative"
                >
                  {/* Top right: distance */}
                  <View className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-lg flex-row items-center">
                    <Feather name="clock" size={12} color="#6B7280" />
                    <Text className="text-gray-900 font-bold text-xs ml-1">
                      {spot.distance}
                    </Text>
                  </View>

                  {/* Top left: type */}
                  <View className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full">
                    <Text className="text-gray-900 font-bold text-xs">
                      {spot.type.toUpperCase()}
                    </Text>
                  </View>

                  {/* Bottom section: rating and heart */}
                  <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between">
                    <View className="bg-white px-3 py-1.5 rounded-full flex-row items-center">
                      <Feather name="star" size={12} color="#F59E0B" />
                      <Text className="text-gray-900 font-bold text-xs ml-1">
                        {spot.rating}
                      </Text>
                    </View>

                    <View className="bg-white p-2 rounded-full">
                      <Feather name="heart" size={16} color="#EF4444" />
                    </View>
                  </View>
                </ImageBackground>
                <View className="p-4">
                  <Text className="text-gray-900 font-black text-lg mb-1">
                    {spot.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="map-pin" size={12} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {spot.type.charAt(0).toUpperCase() + spot.type.slice(1)}{" "}
                      Destination
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Access Grid */}
        <View className="px-5 mb-5">
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {[
              { icon: "map-pin", name: "Near Me", color: "#EF4444" },
              { icon: "camera", name: "Scan Place", color: "#8B5CF6" },
              { icon: "compass", name: "Discover", color: "#10B981" },
              { icon: "message-circle", name: "AI Guide", color: "#F59E0B" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-4 border border-gray-200 items-center justify-center"
                style={{ width: "48%" }}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mb-2"
                  style={{ backgroundColor: item.color + "15" }}
                >
                  <Feather name={item.icon} size={22} color={item.color} />
                </View>
                <Text className="text-gray-900 text-sm font-semibold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interactive Map Section */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-black text-gray-900">
              Nearby Locations
            </Text>
            <View className="flex-row items-center bg-emerald-100 px-3 py-1 rounded-full">
              <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></View>
              <Text className="text-emerald-700 text-xs font-bold">LIVE</Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <View className="h-72">
              <MapView
                style={{ flex: 1 }}
                initialRegion={userLocation}
                showsUserLocation={true}
                className="rounded-2xl"
              >
                {/* Geofence circle */}
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
                    <View className="bg-emerald-500 w-6 h-6 rounded-full border-2 border-white items-center justify-center shadow-lg">
                      <Feather name="map-pin" size={12} color="#fff" />
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>

            <View className="p-4 border-t border-gray-100">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-semibold">
                  Geofencing Active
                </Text>
                <Text className="text-emerald-700 text-sm font-bold">
                  5 spots nearby
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Travel Assistant */}
        <View className="px-5 mb-5">
          <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-emerald-500 rounded-xl items-center justify-center mr-3">
                <Feather name="cpu" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  AI Travel Assistant
                </Text>
                <Text className="text-gray-600 text-xs">
                  Get personalized recommendations
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-3">
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

            <TouchableOpacity className="bg-emerald-500 rounded-xl p-3 items-center">
              <Text className="text-white text-sm font-semibold">
                Ask AI Guide
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Local Deals */}
        <View className="px-5 mb-5">
          <View className="bg-amber-500 rounded-2xl p-5 border-2 border-amber-400">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="bg-white px-3 py-1 rounded-full mb-2 self-start">
                  <Text className="text-amber-600 text-xs font-black">
                    🔥 LIMITED
                  </Text>
                </View>
                <Text className="text-white font-black text-2xl mb-1">
                  20% OFF
                </Text>
                <Text className="text-white text-sm opacity-90 mb-3">
                  Selected tours & restaurants
                </Text>
                <TouchableOpacity className="bg-white px-4 py-2 rounded-xl self-start">
                  <Text className="text-amber-600 font-bold text-sm">
                    Claim Now
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="bg-white p-3 rounded-2xl">
                <Feather name="gift" size={28} color="#F59E0B" />
              </View>
            </View>
          </View>
        </View>

        {/* Community Activity */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-black text-gray-900 mb-3">
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
    </SafeAreaWrapper>
  );
}
