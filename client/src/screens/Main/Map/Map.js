import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Map() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const mapRef = useRef();
  const navigation = useNavigation();

  // CEBU LOCATIONS WITH GEOFENCING
  const cebuSpots = [
    {
      id: 1,
      name: "Kawasan Falls",
      type: "waterfall",
      latitude: 9.8167,
      longitude: 123.3833,
      distance: "2.5 hrs away",
      rating: 4.9,
      price: "₱500",
      geofenceRadius: 800,
      alerts: ["Water level safe", "Guides available"],
      popularity: "high",
      color: "#10B981",
    },
    {
      id: 2,
      name: "Temple of Leah",
      type: "historical",
      latitude: 10.3567,
      longitude: 123.8756,
      distance: "20 min away",
      rating: 4.8,
      price: "₱100",
      geofenceRadius: 500,
      alerts: ["Best at sunset", "Parking available"],
      popularity: "medium",
      color: "#8B5CF6",
    },
    {
      id: 3,
      name: "Magellan's Cross",
      type: "cultural",
      latitude: 10.294,
      longitude: 123.9022,
      distance: "15 min away",
      rating: 4.5,
      price: "Free",
      geofenceRadius: 300,
      alerts: ["Open daily", "Free guided tours"],
      popularity: "high",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Sirao Flower Farm",
      type: "scenic",
      latitude: 10.3896,
      longitude: 123.8364,
      distance: "45 min away",
      rating: 4.6,
      price: "₱150",
      geofenceRadius: 600,
      alerts: ["Best morning light", "Photo spots marked"],
      popularity: "medium",
      color: "#EC4899",
    },
    {
      id: 5,
      name: "Bantayan Island",
      type: "beach",
      latitude: 11.1683,
      longitude: 123.7186,
      distance: "4 hrs away",
      rating: 4.7,
      price: "₱1,200",
      geofenceRadius: 1000,
      alerts: ["Ferry schedule", "Beach conditions good"],
      popularity: "medium",
      color: "#06B6D4",
    },
    {
      id: 6,
      name: "MCIA Airport",
      type: "airport",
      latitude: 10.307,
      longitude: 123.978,
      distance: "You are here",
      rating: 4.4,
      price: "N/A",
      geofenceRadius: 1200,
      alerts: ["Flight deals", "Lounge access"],
      popularity: "high",
      color: "#3B82F6",
    },
  ];

  // User's current location (MCIA for demo)
  const userLocation = {
    latitude: 10.307,
    longitude: 123.978,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const filteredSpots =
    activeFilter === "all"
      ? cebuSpots
      : cebuSpots.filter((spot) => spot.type === activeFilter);

  const focusOnSpot = (spot) => {
    setSelectedSpot(spot);
    mapRef.current.animateToRegion(
      {
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
  };

  const focusOnUser = () => {
    setSelectedSpot(null);
    mapRef.current.animateToRegion(userLocation, 1000);
  };

  const getSpotIcon = (type) => {
    const icons = {
      waterfall: "droplet",
      historical: "book",
      cultural: "users",
      scenic: "image",
      beach: "sun",
      airport: "airplay",
    };
    return icons[type] || "map-pin";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-3 pb-4 border-b border-gray-200">
        <View className="flex-row items-center mb-1">
          {/* BACK BUTTON ADDED HERE */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-2xl font-black text-gray-900">
              Live Geofencing Map
            </Text>
            <Text className="text-emerald-600 text-sm font-medium">
              Real-time location alerts
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
              <Feather name="search" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
              <Feather name="filter" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Map Container */}
      <View className="flex-1 relative">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={userLocation}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
          className="rounded-b-2xl"
        >
          {/* User's current location geofence */}
          <Circle
            center={userLocation}
            radius={500}
            strokeWidth={2}
            strokeColor="#3B82F6"
            fillColor="rgba(59, 130, 246, 0.1)"
          />

          {/* Geofence circles for each spot */}
          {filteredSpots.map((spot) => (
            <Circle
              key={spot.id}
              center={{ latitude: spot.latitude, longitude: spot.longitude }}
              radius={spot.geofenceRadius}
              strokeWidth={selectedSpot?.id === spot.id ? 3 : 2}
              strokeColor={spot.color}
              fillColor={`${spot.color}20`}
            />
          ))}

          {/* Custom markers */}
          {filteredSpots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => focusOnSpot(spot)}
            >
              <View
                className={`p-3 rounded-2xl border-2 border-white shadow-xl ${
                  selectedSpot?.id === spot.id ? "scale-110" : ""
                }`}
                style={{ backgroundColor: spot.color }}
              >
                <View className="flex-row items-center">
                  <Feather
                    name={getSpotIcon(spot.type)}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text className="text-white font-black text-xs ml-1">
                    {spot.distance.split(" ")[0]}
                  </Text>
                </View>
                <Text className="text-white font-bold text-xs mt-1">
                  {spot.name}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Map Controls */}
        <View className="absolute top-4 right-4 space-y-2">
          <TouchableOpacity
            onPress={focusOnUser}
            className="bg-white p-3 rounded-xl shadow-lg border border-gray-200"
          >
            <Feather name="navigation" size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
            <Feather name="maximize" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Selected Spot Card */}
        {selectedSpot && (
          <View className="absolute bottom-4 left-4 right-4">
            <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View
                      className="px-2 py-1 rounded-full mr-2"
                      style={{ backgroundColor: `${selectedSpot.color}20` }}
                    >
                      <Text
                        className="text-xs font-black"
                        style={{ color: selectedSpot.color }}
                      >
                        {selectedSpot.type.toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <Feather name="star" size={12} color="#F59E0B" />
                      <Text className="text-yellow-700 text-xs font-bold ml-1">
                        {selectedSpot.rating}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-900 font-black text-lg mb-1">
                    {selectedSpot.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="clock" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {selectedSpot.distance}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedSpot(null)}>
                  <Feather name="x" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Alerts */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-medium mb-2">
                  Live Alerts:
                </Text>
                <View className="flex-row flex-wrap">
                  {selectedSpot.alerts.map((alert, index) => (
                    <View
                      key={index}
                      className="bg-emerald-50 px-3 py-1 rounded-full mr-2 mb-1"
                    >
                      <Text className="text-emerald-700 text-xs">
                        📍 {alert}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity className="flex-1 bg-emerald-500 py-3 rounded-xl mr-2">
                  <Text className="text-white text-center font-bold text-sm">
                    GET DIRECTIONS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl">
                  <Text className="text-gray-700 text-center font-bold text-sm">
                    VIEW DETAILS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Filter Bar */}
        {!selectedSpot && (
          <View className="absolute top-4 left-4 right-20">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {[
                { id: "all", label: "All Spots", count: cebuSpots.length },
                {
                  id: "waterfall",
                  label: "Waterfalls",
                  count: cebuSpots.filter((s) => s.type === "waterfall").length,
                },
                {
                  id: "historical",
                  label: "Historical",
                  count: cebuSpots.filter((s) => s.type === "historical")
                    .length,
                },
                {
                  id: "cultural",
                  label: "Cultural",
                  count: cebuSpots.filter((s) => s.type === "cultural").length,
                },
                {
                  id: "beach",
                  label: "Beaches",
                  count: cebuSpots.filter((s) => s.type === "beach").length,
                },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                  className={`px-3 py-2 rounded-xl ${
                    activeFilter === filter.id
                      ? "bg-emerald-500"
                      : "bg-white/90 backdrop-blur-lg"
                  } border border-gray-200 shadow-sm`}
                >
                  <Text
                    className={`font-semibold text-xs ${
                      activeFilter === filter.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Bottom Stats Bar */}
      <View className="px-5 py-3 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></View>
            <Text className="text-gray-700 text-sm font-medium">
              {filteredSpots.length} active geofences
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-1"></View>
            <Text className="text-gray-600 text-xs">Your location</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="bell" size={14} color="#059669" />
            <Text className="text-emerald-600 text-xs font-bold ml-1">
              ALERTS LIVE
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
